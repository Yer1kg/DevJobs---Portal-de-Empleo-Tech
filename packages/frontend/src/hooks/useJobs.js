import { useState, useEffect } from 'react'

export function useJobs() {
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Hacemos el fetch directamente aquí para no depender de otros archivos
    fetch('http://localhost:3000/api/jobs')
      .then(res => {
        if (!res.ok) throw new Error('Error en la red');
        return res.json();
      })
      .then(data => {
        setJobs(data)
        setLoading(false)
      })
      .catch(err => {
        console.error("❌ Error cargando empleos:", err);
        setLoading(false);
      });
  }, [])

  return { jobs, loading }
}