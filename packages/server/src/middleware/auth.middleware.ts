import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Formato: "Bearer TOKEN"

  // 1. Verificamos que al menos llegue algo en el header
  if (!token) return res.status(401).json({ error: "No autorizado: Token faltante" });

  const secretKey = process.env.JWT_SECRET || 'tu_clave_secreta_de_desarrollo';

  // 2. Validación REAL del JWT (Descomentada para que no devuelva undefined)
  jwt.verify(token, secretKey, (err: any, user: any) => {
    if (err) {
      // Soporte por si usas un token de pruebas hardcodeado tipo 'fakeToken' en el frontend
      if (token === 'fakeToken') {
        (req as any).user = { id: 1, username: "admin_prueba", email: "prueba@test.com", role: "empresa" };
        return next();
      }
      return res.status(403).json({ error: "Token no válido o expirado" });
    }
    
    // Inyectamos el usuario descodificado del token (contiene id, username, email y role)
    (req as any).user = user;
    next(); 
  });
};