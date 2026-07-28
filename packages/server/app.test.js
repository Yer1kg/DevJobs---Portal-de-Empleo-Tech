const request = require('supertest');
const app = require('./index');

describe('POST /api/jobs', () => {
  it('debería crear un nuevo empleo si los datos son válidos', async () => {
    const { expect } = await import('vitest');
    
    const nuevoJob = {
      title: "Programador de naves espaciales",
      company: "NASA",
      location: "Remoto",
      description: "Para trabajar en Marte"
    };

    const response = await request(app)
      .post('/api/jobs')
      .send(nuevoJob); // AQUÍ enviamos los datos

    expect(response.status).toBe(201);
    expect(response.body.job.title).toBe("Programador de naves espaciales");
  });

  it('debería fallar (400) si faltan datos obligatorios', async () => {
    const { expect } = await import('vitest');
    
    const jobInvalido = { title: "Solo titulo" }; // Falta company, location, etc.

    const response = await request(app)
      .post('/api/jobs')
      .send(jobInvalido);

    expect(response.status).toBe(400); // Zod debería rechazarlo
  });
});