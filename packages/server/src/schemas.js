import z from 'zod';

export const jobSchema = z.object({
  title: z.string().min(3, "El título es muy corto"),
  company: z.string().min(1, "La empresa es obligatoria"),
  location: z.string().min(1, "La ubicación es obligatoria"),
  description: z.string().min(10, "Añade una descripción más detallada")
});