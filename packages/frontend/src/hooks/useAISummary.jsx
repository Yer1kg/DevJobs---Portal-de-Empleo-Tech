import { useState } from 'react';

export const useAISummary = () => {
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);

  const getSummary = async (title) => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:3000/api/ai/generate-description', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title })
      });
      const data = await response.json();
      setSummary(data.description);
    } catch (error) {
      console.error("Error obteniendo resumen:", error);
    } finally {
      setLoading(false);
    }
  };

  return { summary, loading, getSummary };
};