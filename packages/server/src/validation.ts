import { z } from 'zod';

export const jobSchema = z.object({
  title: z.string().min(3),
  company: z.string().min(2),
  description: z.string().min(10),
  // Esta versión ignora tildes, espacios y mayúsculas al comparar
  location: z.preprocess((val) => {
    if (typeof val !== 'string') return val;
    
    // Limpiamos espacios y pasamos a minúsculas para comparar fácil
    const clean = val.trim().toLowerCase();
    
    if (clean.includes('remot')) return 'Remoto';
    if (clean.includes('hibrid') || clean.includes('híbrid')) return 'Híbrido';
    if (clean.includes('presencial')) return 'Presencial';
    
    return val; // Si no es nada de lo anterior, Zod fallará y nos dirá qué era
  }, z.enum(['Remoto', 'Híbrido', 'Presencial'])),
  
  tags: z.array(z.string()).optional().default([])
});