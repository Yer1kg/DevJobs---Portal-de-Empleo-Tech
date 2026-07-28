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
    const { search } = req.query;

    if (search && typeof search === 'string') {
      const searchTerm = `%${search}%`;
      const query = 'SELECT * FROM jobs WHERE title LIKE ? OR company LIKE ?';
      
      db.all(query, [searchTerm, searchTerm], (err: any, rows: any) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
      });
    } else {
      // Si no hay búsqueda, devolvemos todo
      db.all('SELECT * FROM jobs', [], (err: any, rows: any) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
      });
    }
  } catch (error) {
    next(error);
  }
};

/**
 * Crea un nuevo empleo en la base de datos SQLite.
 */
export const createJob = (req: Request, res: Response) => {
  const result = jobSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({ errors: result.error.issues });
  }

  const { title, company, location, salary, description } = result.data;

  const query = `
    INSERT INTO jobs (title, company, location, salary, description)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.run(query, [title, company, location, salary, description], function(err: any) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json({ 
      message: "Publicado", 
      jobId: this.lastID 
    });
  });
};

/**
 * Actualiza un empleo existente.
 */
export const updateJob = (req: Request, res: Response) => {
  const { id } = req.params;
  const result = jobSchema.safeParse(req.body);

  if (!result.success) return res.status(400).json({ errors: result.error.issues });

  const { title, company, location, salary, description } = result.data;
  
  const query = `
    UPDATE jobs 
    SET title = ?, company = ?, location = ?, salary = ?, description = ?
    WHERE id = ?
  `;

  db.run(query, [title, company, location, salary, description, id], function(err: any) {
    if (err) return res.status(500).json({ error: err.message });
    
    if (this.changes === 0) {
      return res.status(404).json({ message: "No encontrado" });
    }
    
    res.json({ message: "Actualizado" });
  });
};