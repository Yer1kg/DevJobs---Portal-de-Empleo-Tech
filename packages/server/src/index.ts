import express from 'express';
import cors from 'cors';
import * as dotenv from 'dotenv';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { aiRouter } from './routes/ai.routes.js';
import db from './db/database.js';
import { authenticateToken } from './middleware/auth.middleware.js'; 

dotenv.config();

db.run(`CREATE UNIQUE INDEX IF NOT EXISTS idx_job_unique ON jobs (title, description)`);

const app = express();
app.use(express.json());
app.use(cors());

const jobSchema = z.object({
  title: z.string()
    .min(10, "El título es demasiado genérico")
    .max(100, "El título no puede superar los 100 caracteres"),
  description: z.string()
    .min(30, "La descripción es demasiado corta")
    .refine((val) => !val.includes("Lo siento") && !val.includes("no parece ser"), {
      message: "La descripción contains un mensaje de error de la IA y no puede ser publicada."
    })
    .refine((val) => !val.includes("¡Claro!") && !val.includes("¿Quieres jugar?"), {
      message: "El contenido no es profesional."
    }),
  company: z.string().min(2, "El nombre de la empresa es obligatorio"),
  location: z.string().min(3, "La ubicación debe tener al menos 3 caracteres"),
  salary: z.string().default("A convenir")
});

// --- RUTAS DE AUTENTICACIÓN (AUTH) ---

app.post('/api/auth/register', async (req, res) => {
  const { username, email, password, role } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ error: "Todos los campos son obligatorios" });
  }

  try {
    const hashedPassword = await bcryptjs.hash(password, 10);
    const rolFinal = (role === 'empresa' || role === 'trabajador') ? role : 'trabajador';

    const query = `INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)`;
    
    db.run(query, [username, email, hashedPassword, rolFinal], function(err) {
      if (err) {
        if (err.message.includes("UNIQUE constraint failed")) {
          return res.status(400).json({ error: "El nombre de usuario o el email ya están registrados." });
        }
        return res.status(500).json({ error: err.message });
      }
      
      res.status(201).json({ 
        message: "Usuario registrado con éxito", 
        userId: this.lastID 
      });
    });

  } catch (error) {
    res.status(500).json({ error: "Error en el servidor al procesar el registro" });
  }
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email y contraseña son obligatorios" });
  }

  try {
    const query = `SELECT * FROM users WHERE email = ?`;
    
    db.get(query, [email], async (err, user: any) => {
      if (err) return res.status(500).json({ error: err.message });
      if (!user) return res.status(401).json({ error: "El email o la contraseña no son correctos." });

      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) return res.status(401).json({ error: "El email o la contraseña no son correctos." });

      const secretKey = process.env.JWT_SECRET || 'tu_clave_secreta_de_desarrollo';
      const token = jwt.sign(
        { id: user.id, username: user.username, email: user.email, role: user.role },
        secretKey,
        { expiresIn: '24h' }
      );

      res.json({
        message: "¡Inicio de sesión correcto!",
        token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role
        }
      });
    });
  } catch (error) {
    res.status(500).json({ error: "Error en el servidor" });
  }
});

app.get('/api/profile', authenticateToken, (req: any, res: any) => {
  const userId = req.user?.id;

  if (!userId) {
    console.error("🚨 Error crítico: El middleware no inyectó un ID válido en req.user");
    return res.status(400).json({ error: "El token de sesión no contains un ID de usuario válido." });
  }

  db.get('SELECT id, username, email, role FROM users WHERE id = ?', [userId], (err, user: any) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!user) return res.status(404).json({ error: "Usuario no encontrado en la base de datos" });

    res.json({
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role
    });
  });
});

app.put('/api/profile/update', authenticateToken, (req: any, res: any) => {
  const userId = req.user?.id;
  const { username, email } = req.body;

  if (!userId) {
    return res.status(400).json({ error: "Token de sesión no válido o expirado." });
  }

  if (!username || !email) {
    return res.status(400).json({ error: "El nombre de usuario y el correo electrónico son campos obligatorios." });
  }

  const query = `UPDATE users SET username = ?, email = ? WHERE id = ?`;

  db.run(query, [username, email, userId], function(err) {
    if (err) {
      if (err.message.includes("UNIQUE constraint failed")) {
        return res.status(400).json({ error: "El nombre de usuario o el email ya están siendo usados por otra cuenta." });
      }
      return res.status(500).json({ error: err.message });
    }

    db.get('SELECT id, username, email, role FROM users WHERE id = ?', [userId], (err, updatedUser: any) => {
      if (err) return res.status(500).json({ error: err.message });
      
      const secretKey = process.env.JWT_SECRET || 'tu_clave_secreta_de_desarrollo';
      const nuevoToken = jwt.sign(
        { id: updatedUser.id, username: updatedUser.username, email: updatedUser.email, role: updatedUser.role },
        secretKey,
        { expiresIn: '24h' }
      );

      res.json({
        message: "¡Perfil guardado en la Base de Datos con éxito!",
        user: updatedUser,
        token: nuevoToken
      });
    });
  });
});

// --- RUTAS DE TRABAJOS (JOBS) CON COALESCE Y BUSCADOR INTELIGENTE INTEGRADOS ---

app.get('/api/jobs', (req, res) => {
  const page = req.query.page ? parseInt(req.query.page as string) : null;
  const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
  
  // Usamos una variable común de búsqueda para interceptar título, texto estático de empresa o el username actualizado
  const search = req.query.title ? `%${req.query.title}%` : '%';
  const searchLocation = req.query.location ? `%${req.query.location}%` : '%';

  if (!page) {
    const query = `
      SELECT 
        jobs.id, jobs.title, jobs.location, jobs.salary, jobs.description, jobs.created_at, jobs.user_id,
        COALESCE(users.username, jobs.company) AS company,
        users.username AS author_name 
      FROM jobs 
      LEFT JOIN users ON jobs.user_id = users.id 
      WHERE (jobs.title LIKE ? OR users.username LIKE ? OR jobs.company LIKE ?) 
        AND jobs.location LIKE ?
      ORDER BY jobs.created_at DESC
    `;
    return db.all(query, [search, search, search, searchLocation], (err: any, rows: any) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows);
    });
  }

  const offset = (page - 1) * limit;
  const query = `
    SELECT 
      jobs.id, jobs.title, jobs.location, jobs.salary, jobs.description, jobs.created_at, jobs.user_id,
      COALESCE(users.username, jobs.company) AS company,
      users.username AS author_name
    FROM jobs 
    LEFT JOIN users ON jobs.user_id = users.id
    WHERE (jobs.title LIKE ? OR users.username LIKE ? OR jobs.company LIKE ?) 
      AND jobs.location LIKE ?
    ORDER BY jobs.created_at DESC LIMIT ? OFFSET ?
  `;

  db.all(query, [search, search, search, searchLocation, limit, offset], (err: any, rows: any) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ page, limit, count: rows.length, data: rows });
  });
});

app.get('/api/jobs/featured', (req, res) => {
  const query = `
    SELECT 
      jobs.id, jobs.title, jobs.location, jobs.salary, jobs.description, jobs.created_at, jobs.user_id,
      COALESCE(users.username, jobs.company) AS company,
      users.username AS author_name 
    FROM jobs 
    LEFT JOIN users ON jobs.user_id = users.id 
    ORDER BY RANDOM() 
    LIMIT 3
  `;
  db.all(query, [], (err: any, rows: any) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.get('/api/jobs/:id', (req, res) => {
  const { id } = req.params;

  const query = `
    SELECT 
      jobs.id, jobs.title, jobs.location, jobs.salary, jobs.description, jobs.created_at, jobs.user_id,
      COALESCE(users.username, jobs.company) AS company,
      users.username AS author_name 
    FROM jobs 
    LEFT JOIN users ON jobs.user_id = users.id 
    WHERE jobs.id = ?
  `;

  db.get(query, [id], (err: any, row: any) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ error: "La oferta de empleo no existe." });
    
    res.json(row);
  });
});

app.post('/api/jobs/create', authenticateToken, (req: any, res) => {
  if (req.user.role !== 'empresa') {
    return res.status(403).json({ error: "Acceso denegado: Solo las cuentas de Empresa pueden publicar ofertas." });
  }

  const result = jobSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ error: "Datos inválidos", details: result.error.errors.map(e => ({ message: e.message })) });
  }

  const userId = req.user.id; 
  const { title, description, company, location, salary } = result.data;

  const query = `INSERT INTO jobs (title, description, company, location, salary, user_id) VALUES (?, ?, ?, ?, ?, ?)`;
  db.run(query, [title, description, company, location, salary, userId], function(err: any) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Vacante creada correctamente", id: this.lastID });
  });
});

app.post('/api/jobs/update/:id', authenticateToken, (req: any, res) => {
  if (req.user.role !== 'empresa') {
    return res.status(403).json({ error: "No tienes permisos de empresa para editar." });
  }

  const { id } = req.params;
  const result = jobSchema.safeParse(req.body);
  if (!result.success) return res.status(400).json({ error: "Datos inválidos", details: result.error.errors });

  const userId = req.user.id;
  const { title, description, company, location, salary } = result.data;

  const query = `UPDATE jobs SET title = ?, description = ?, company = ?, location = ?, salary = ? WHERE id = ? AND user_id = ?`;
  db.run(query, [title, description, company, location, salary, id, userId], function(err: any) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0) return res.status(403).json({ message: "No eres el dueño de esta oferta o no existe." });
    res.json({ message: "Cambios guardados correctamente" });
  });
});

app.get('/api/jobs/delete/:id', authenticateToken, (req: any, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  const query = 'DELETE FROM jobs WHERE id = ? AND user_id = ?';
  db.run(query, [id, userId], function(err: any) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0) return res.status(403).json({ message: "No tienes permisos para eliminar esta vacante." });
    res.json({ message: "Vacante registrada eliminada correctamente" });
  });
});

// --- RUTAS DE USUARIOS / CUENTA CON TRANSACCIONES Y BORRADO AUTOMÁTICO DE OFERTAS ---

app.post('/api/users/change-role', authenticateToken, (req: any, res: any) => {
  const userId = req.user.id;
  const secretKey = process.env.JWT_SECRET || 'tu_clave_secreta_de_desarrollo';

  db.serialize(() => {
    db.run("BEGIN TRANSACTION", (txErr) => {
      if (txErr) return res.status(500).json({ error: "No se pudo iniciar la transacción de seguridad." });
    });

    db.get(`SELECT username, email, role FROM users WHERE id = ?`, [userId], (err, user: any) => {
      if (err || !user) {
        db.run("ROLLBACK");
        return res.status(user ? 500 : 404).json({ error: err ? err.message : "Usuario no encontrado" });
      }

      const ahora = new Date();
      const miNuevoRol = user.role === 'empresa' ? 'trabajador' : 'empresa';

      // SI CAMBIA DE 'EMPRESA' A 'TRABAJADOR', ELIMINAMOS SUS VACANTES PUBLICADAS
      if (user.role === 'empresa' && miNuevoRol === 'trabajador') {
        db.run(`DELETE FROM jobs WHERE user_id = ?`, [userId], function (deleteErr) {
          if (deleteErr) {
            db.run("ROLLBACK");
            return res.status(500).json({ error: "Error al borrar las ofertas del usuario." });
          }

          db.run(
            `UPDATE users SET role = ?, last_role_change = ? WHERE id = ?`,
            [miNuevoRol, ahora.toISOString(), userId],
            function (updateErr) {
              if (updateErr) {
                db.run("ROLLBACK");
                return res.status(500).json({ error: "Error al actualizar el rol en la base de datos." });
              }

              db.run("COMMIT", (commitErr) => {
                if (commitErr) {
                  db.run("ROLLBACK");
                  return res.status(500).json({ error: "Error al aplicar COMMIT en la base de datos." });
                }

                const nuevoToken = jwt.sign(
                  { id: userId, username: user.username, email: user.email, role: miNuevoRol },
                  secretKey,
                  { expiresIn: '24h' }
                );

                return res.json({ 
                  message: `¡Rol cambiado con éxito! Ahora eres: ${miNuevoRol}. Tus ofertas han sido eliminadas automáticamente.`, 
                  nuevoRol: miNuevoRol, 
                  token: nuevoToken 
                });
              });
            }
          );
        });

      } else {
        // SI CAMBIA DE 'TRABAJADOR' A 'EMPRESA'
        db.run(
          `UPDATE users SET role = ?, last_role_change = ? WHERE id = ?`,
          [miNuevoRol, ahora.toISOString(), userId],
          function (updateErr) {
            if (updateErr) {
              db.run("ROLLBACK");
              return res.status(500).json({ error: "Error al actualizar el rol en la base de datos." });
            }

            db.run("COMMIT", (commitErr) => {
              if (commitErr) {
                db.run("ROLLBACK");
                return res.status(500).json({ error: "Error al aplicar COMMIT en la base de datos." });
              }

              const nuevoToken = jwt.sign(
                { id: userId, username: user.username, email: user.email, role: miNuevoRol },
                secretKey,
                { expiresIn: '24h' }
              );

              return res.json({ 
                message: `¡Rol cambiado con éxito! Ahora eres: ${miNuevoRol}`, 
                nuevoRol: miNuevoRol, 
                token: nuevoToken 
              });
            });
          }
        );
      }
    });
  });
});

app.get('/api/admin/clean-db', (req, res) => {
  db.run("DELETE FROM jobs WHERE user_id IS NULL", function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: `Limpieza exitosa. Se han eliminado ${this.changes} vacantes antiguas.` });
  });
});

app.get('/api/users/profile-public/:id', (req: any, res: any) => {
  const { id } = req.params;

  const queryPerfil = `
    SELECT 
      users.id, 
      users.username, 
      users.email, 
      users.role,
      GROUP_CONCAT(jobs.title, ' | ') AS lista_empleos,
      COUNT(jobs.id) AS total_ofertas
    FROM users
    LEFT JOIN jobs ON users.id = jobs.user_id
    WHERE users.id = ?
    GROUP BY users.id
  `;

  db.get(queryPerfil, [id], (err, perfilEmpresa: any) => {
    if (err) return res.status(500).json({ error: "Error en la consulta SQL relacional." });
    if (!perfilEmpresa || !perfilEmpresa.id) return res.status(404).json({ error: "El usuario o empresa no existe." });

    const ofertasArray = perfilEmpresa.lista_empleos 
      ? perfilEmpresa.lista_empleos.split(' | ') 
      : [];

    res.json({
      message: "Perfil consultado con éxito mediante combinación relacional y GROUP_CONCAT",
      data: {
        id: perfilEmpresa.id,
        username: perfilEmpresa.username,
        email: perfilEmpresa.email,
        role: perfilEmpresa.role,
        total_ofertas: perfilEmpresa.total_ofertas,
        ofertas_publicadas: ofertasArray
      }
    });
  });
});

app.use('/api/ai', aiRouter);

const PORT = 3000;
app.listen(PORT, () => console.log(`🚀 SERVIDOR EN PUERTO ${PORT}`));
