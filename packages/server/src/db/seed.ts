// packages/server/src/seed.ts
import { db } from '../index.js'; // Ajusta la importación según tu cliente de BD (SQLite)

const sampleJobs = [
  {
    title: 'Frontend Developer React',
    company: 'TechFlow Solutions',
    location: 'Madrid, España (Híbrido)',
    salary: '38.000€ - 45.000€',
    description: 'Buscamos un desarrollador React experimentado para trabajar en nuestra plataforma principal. Experiencia con TypeScript y Tailwind CSS.',
    type: 'Full-time'
  },
  {
    title: 'Backend Engineer Node.js',
    company: 'DataCloud Systems',
    location: 'Remoto',
    salary: '45.000€ - 55.000€',
    description: 'Buscamos ingeniero Backend para diseñar y escalar nuestras APIs RESTful con Express/Fastify y SQLite/PostgreSQL.',
    type: 'Full-time'
  },
  {
    title: 'Diseñador UX/UI Senior',
    company: 'CreativeLab',
    location: 'Barcelona, España',
    salary: '32.000€ - 40.000€',
    description: 'Únete a nuestro equipo creativo para diseñar sistemas de diseño modernos e interfaces accesibles para clientes internacionales.',
    type: 'Full-time'
  }
];

async function runSeed() {
  console.log('🌱 Sembrando empleos de prueba...');
  
  for (const job of sampleJobs) {
    // Adapta esta consulta SQL según tu estructura de base de datos
    await db.run(
      `INSERT INTO jobs (title, company, location, salary, description, type) VALUES (?, ?, ?, ?, ?, ?)`,
      [job.title, job.company, job.location, job.salary, job.description, job.type]
    );
  }

  console.log('✅ ¡Empleos añadidos con éxito!');
}

runSeed().catch(console.error);
