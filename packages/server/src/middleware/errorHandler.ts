import { Request, Response, NextFunction } from 'express';

export interface CustomError extends Error {
  statusCode?: number;
}

export const errorHandler = (
  err: CustomError,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Error interno del servidor';

  // Esto aparecerá en tu terminal de VS Code
  console.error(`🔥 [Error Handler]: ${message}`);

  res.status(statusCode).json({
    status: 'error',
    statusCode,
    message,
    // Solo mostramos el stack trace si estuviéramos en desarrollo, pero por ahora lo dejamos simple
  });
};