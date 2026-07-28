import { Router } from 'express';
import Groq from "groq-sdk";
import * as dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { rateLimit } from 'express-rate-limit';
import { authenticateToken } from '../middleware/auth.middleware.js';
import db from '../db/database.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envPath = path.resolve(__dirname, '../../../../.env');
dotenv.config({ path: envPath });

const MODELS = {
  LLAMA: "llama-3.3-70b-versatile",
  MIXTRAL: "mixtral-8x7b-32768",
  DEEPSEEK: "deepseek-r1-distill-llama-70b"
};

const router = Router();

const aiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { error: "Has hecho demasiadas peticiones. Inténtalo de nuevo en 15 minutos." },
  standardHeaders: true, 
  legacyHeaders: false, 
});

const groq = new Groq({ 
  apiKey: process.env.GROQ_API_KEY || '' 
});

router.post('/generate-description', authenticateToken, aiLimiter, async (req, res) => {
  const { title } = req.body;
  
  if (!title) return res.status(400).json({ error: "Falta el título" });

  try {
    const response = await groq.chat.completions.create({
      messages: [
        { 
          role: "system", 
          content: `Eres un redactor de ofertas de empleo estrictamente profesional. 
          REGLAS CRÍTICAS:
          1. Si el título NO es un puesto de trabajo real (ej: "hola", "jugamos", nombres aleatorios), 
             responde ÚNICAMENTE con la palabra: ERROR_INVALID_POSITION.
          2. No saludes ni uses lenguaje conversacional. No eres un asistente de chat.
          3. Escribe directamente la descripción técnica en 3 líneas.` 
        },
        { role: "user", content: `Escribe una descripción profesional para: ${title}` }
      ],
      model: MODELS.LLAMA,
      stream: true,
    });

    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader('Transfer-Encoding', 'chunked');

    for await (const chunk of response) {
      const content = chunk.choices[0]?.delta?.content || "";
      res.write(content); 
    }

    res.end(); 
    
  } catch (error: any) {
    console.error("❌ Error en Groq:", error.message);
    if (!res.headersSent) {
      res.status(500).json({ error: "Error interno" });
    } else {
      res.end();
    }
  }
});

export { router as aiRouter };