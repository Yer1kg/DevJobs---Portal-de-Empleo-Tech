import { Request, Response, NextFunction } from 'express';
import db from '../db/database.js';
// @ts-ignore
import { jobSchema } from '../validation/index.js'; // Esto eliminará el error rojo

/**
 * Obtiene todos los empleos de la base de datos SQLite.
 * Soporta búsqueda por título si se pasa el parámetro ?search=...
 */
export const getJobs = (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = req.query.page ? parseInt(req.query.page as string) : null;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;

    const title = req.query.title ? `%${req.query.title}%` : '%';
    const location = req.query.location ? `%${req.query.location}%` : '%';
    const category = req.query.category as string | undefined;

    // WHERE dinámico
    const conditions = [
      `(jobs.title LIKE ? OR jobs.company LIKE ?)`,
      `jobs.location LIKE ?`
    ];
    const params: any[] = [title, title, location];

    if (category && category !== 'todas' && category !== 'all') {
      conditions.push(`jobs.category = ?`);
      params.push(category);
    }

    const whereClause = `WHERE ${conditions.join(' AND ')}`;

    if (!page) {
      return db.all(
        `SELECT * FROM jobs ${whereClause} ORDER BY created_at DESC`,
        params,
        (err, rows) => {
          if (err) return res.status(500).json({ error: err.message });
          res.json(rows);
        }
      );
    }

    const offset = (page - 1) * limit;

    // 1) Contar total real
    db.get(
      `SELECT COUNT(*) as total FROM jobs ${whereClause}`,
      params,
      (err, countRow: any) => {
        if (err) return res.status(500).json({ error: err.message });

        // 2) Traer la página
        db.all(
          `SELECT * FROM jobs ${whereClause} ORDER BY created_at DESC LIMIT ? OFFSET ?`,
          [...params, limit, offset],
          (err, rows) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({
              page,
              limit,
              total: countRow.total,
              totalPages: Math.ceil(countRow.total / limit),
              data: rows
            });
          }
        );
      }
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Crea un nuevo empleo en la base de datos SQLite.
 */
export const createJob = (req: any, res: Response) => {
  const result = jobSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({ errors: result.error.issues });
  }

  const { title, company, location, salary, description, type, contract, category } = result.data;

  const contractType = type || contract || 'Jornada Completa';
  const jobCategory = category || 'otros';
  const userId = req.user?.id || null; // si tienes middleware auth que rellena req.user

  const query = `
    INSERT INTO jobs (title, company, location, salary, description, type, category, user_id)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.run(
    query,
    [title, company, location, salary, description, contractType, jobCategory, userId],
    function (err: any) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.status(201).json({
        message: "Publicado",
        jobId: this.lastID
      });
    }
  );
};

/**
 * Actualiza un empleo existente.
 */
export const updateJob = (req: Request, res: Response) => {
  const { id } = req.params;
  const result = jobSchema.safeParse(req.body);

  if (!result.success) return res.status(400).json({ errors: result.error.issues });

  const { title, company, location, salary, description, type, contract } = result.data;
  const contractType = type || contract || 'Jornada Completa';

  const query = `
    UPDATE jobs 
    SET title = ?, company = ?, location = ?, salary = ?, description = ?, type = ?
    WHERE id = ?
  `;

  db.run(query, [title, company, location, salary, description, contractType, id], function(err: any) {
    if (err) return res.status(500).json({ error: err.message });
    
    if (this.changes === 0) {
      return res.status(404).json({ message: "No encontrado" });
    }
    
    res.json({ message: "Actualizado" });
  });
};
