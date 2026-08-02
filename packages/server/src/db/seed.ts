// Importamos la conexión de base de datos como import por defecto (default import)
import db from './database.js';

const sampleJobs = [
  {
    title: 'Frontend Developer React',
    company: 'TechFlow Solutions',
    location: 'Madrid, España (Híbrido)',
    salary: '38.000€ - 45.000€',
    description: 'Buscamos un desarrollador React experimentado para trabajar en nuestra plataforma principal. Experiencia con TypeScript y Tailwind CSS.'
  },
  {
    title: 'Backend Engineer Node.js',
    company: 'DataCloud Systems',
    location: 'Remoto',
    salary: '45.000€ - 55.000€',
    description: 'Buscamos ingeniero Backend para diseñar y escalar nuestras APIs RESTful con Express/Fastify y SQLite/PostgreSQL.'
  },
  {
    title: 'Diseñador UX/UI Senior',
    company: 'CreativeLab',
    location: 'Barcelona, España',
    salary: '32.000€ - 40.000€',
    description: 'Únete a nuestro equipo creativo para diseñar sistemas de diseño modernos e interfaces accesibles para clientes internacionales.'
  }
];

// Función auxiliar para promisificar el db.run de sqlite3
function runQuery(sql: string, params: any[]): Promise<void> {
  return new Promise((resolve, reject) => {
    db.run(sql, params, (err) => {
      if (err) reject(err);
      else resolve();
    });
  });
}

async function runSeed() {
  console.log('🌱 Sembrando empleos de prueba...');
  
  for (const job of sampleJobs) {
    await runQuery(
      `INSERT INTO jobs (title, company, location, salary, description) VALUES (?, ?, ?, ?, ?)`,
      [job.title, job.company, job.location, job.salary, job.description]
    );
  }

  console.log('✅ ¡Empleos añadidos con éxito!');
}

runSeed().catch(console.error);
