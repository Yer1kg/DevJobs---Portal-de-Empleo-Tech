import sqlite3 from 'sqlite3';

const db = new sqlite3.Database('./devjobs.db', (err) => {
  if (err) {
    console.error("❌ Error de conexión:", err.message);
  } else {
    console.log("✅ SQLITE CONECTADO: El motor binario está vivo.");
  }
});

db.serialize(() => {
  // 1. Crear la tabla 'users' si no existe
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL UNIQUE,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `, (err) => {
    if (err) {
      console.error("❌ Error al crear tabla 'users':", err.message);
    } else {
      console.log("📊 Tabla 'users' verificada en el archivo .db");
      
      // 🛠️ MIGRACIÓN: Añadir columna 'role' si no existe
      db.run(`ALTER TABLE users ADD COLUMN role TEXT DEFAULT 'trabajador'`, (err) => {
        if (err) {
          console.log("ℹ️ La columna 'role' ya existe o no se pudo añadir.");
        } else {
          console.log("🚀 ¡Columna 'role' añadida con éxito a la tabla users!");
        }
      });

      // 🛠️ MIGRACIÓN: Añadir columna 'last_role_change' si no existe
      db.run(`ALTER TABLE users ADD COLUMN last_role_change TEXT`, (err) => {
        if (err) {
          console.log("ℹ️ La columna 'last_role_change' ya existe o no se pudo añadir.");
        } else {
          console.log("🚀 ¡Columna 'last_role_change' añadida con éxito a la tabla users!");
        }
      });
    }
  });

  // 2. Crear la tabla 'jobs' si no existe
  db.run(`
    CREATE TABLE IF NOT EXISTS jobs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      company TEXT NOT NULL,
      location TEXT,
      salary TEXT,
      description TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `, (err) => {
    if (err) {
      console.error("❌ Error al crear tabla 'jobs':", err.message);
    } else {
      console.log("📊 Tabla 'jobs' verificada en el archivo .db");
      
      // 3. Modificar la tabla para añadir 'user_id' si no existe
      db.run(`ALTER TABLE jobs ADD COLUMN user_id INTEGER;`, (err) => {
        if (err) {
          console.log("ℹ️ La columna 'user_id' ya está presente en la tabla.");
        } else {
          console.log("✅ Estructura actualizada: Columna 'user_id' añadida con éxito.");
        }
      });
    }
  });
});

// Función auxiliar actualizada para soportar user_id
export const saveJob = (job: { title: string, company: string, location: string, salary: string, description: string, user_id?: number }) => {
  const { title, company, location, salary, description, user_id } = job;
  
  return new Promise((resolve, reject) => {
    const query = `
      INSERT INTO jobs (title, company, location, salary, description, user_id)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    
    db.run(query, [title, company, location, salary, description, user_id || null], function(err) {
      if (err) reject(err);
      else resolve(this.lastID);
    });
  });
};

export default db;