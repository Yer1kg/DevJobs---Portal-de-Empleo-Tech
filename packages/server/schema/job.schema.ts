import { z } from 'zod';

export const jobSchema = z.object({
  title: z.string().min(5)...
  description: z.string().min(20)...
  company: z.string().default("Empresa Anónima"),
  location: z.string().default("Remoto"),
  salary: z.string().optional(),
  type: z.string().optional(),
  contract: z.string().optional(),
  contractType: z.string().optional()
});
