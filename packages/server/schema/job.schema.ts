import { z } from 'zod';

export const jobSchema = z.object({
  title: z.string().min(5, "El título es demasiado corto").max(100),
  description: z.string().min(20, "La descripción debe ser más detallada"),
  company: z.string().default("Empresa Anónima"),
  location: z.string().default("Remoto"),
  salary: z.string().optional()
});

