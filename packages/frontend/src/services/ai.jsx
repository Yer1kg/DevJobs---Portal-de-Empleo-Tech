// packages/frontend/src/services/ai.js
export const generateJobDescription = async (title) => {
  try {
    const response = await fetch('http://localhost:3000/api/ai/generate-description', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title }),
    });

    if (!response.ok) throw new Error('Error al generar la descripción');

    const data = await response.json();
    return data.description;
  } catch (error) {
    console.error("Error en la IA:", error);
    return "No se pudo generar la descripción automáticamente.";
  }
};