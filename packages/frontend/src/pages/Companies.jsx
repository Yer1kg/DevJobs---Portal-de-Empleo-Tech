import { useState } from 'react';
import { generateJobDescription } from '../services/ai'; // Importamos el fetch

export function Companies() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  const handleMagicAI = async () => {
    if (!title) return alert("Por favor, escribe un título primero");
    setLoading(true);
    const aiText = await generateJobDescription(title);
    setDescription(aiText);
    setLoading(false);
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h1>Panel de Empresas</h1>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <label>
          <strong>Título del puesto:</strong>
          <input 
            type="text" 
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
            placeholder="ej: Programador Unity Senior" 
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </label>
        
        <button 
          onClick={handleMagicAI} 
          disabled={loading}
          style={{
            padding: '10px',
            backgroundColor: loading ? '#ccc' : '#646cff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? '⏳ IA Trabajando...' : '✨ Generar descripción con IA'}
        </button>

        <label>
          <strong>Descripción del empleo:</strong>
          <textarea 
            value={description} 
            onChange={(e) => setDescription(e.target.value)}
            placeholder="La IA redactará algo increíble aquí..."
            rows={10}
            style={{ width: '100%', padding: '10px', marginTop: '5px' }}
          />
        </label>
      </div>
    </div>
  );
}