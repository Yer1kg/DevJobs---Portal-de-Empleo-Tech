import { Request, Response, NextFunction } from 'express';

export const requestLogger = (req: Request, _res: Response, next: NextFunction): void => {
  console.log(`>>> [${new Date().toLocaleTimeString()}] ${req.method} en ${req.url}`);
  next(); // Permite que la petición pase al controlador
};