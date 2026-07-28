import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAISummary } from '../hooks/useAISummary'; // Importamos tu nuevo hook
import styles from './Detail.module.css';

export const Detail = () => {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  
  // Extraemos la lógica de la IA desde el Hook
  const { summary, loading, getSummary } = useAISummary();

  // 1. Cargar los datos del empleo (Tu lógica de siempre)
  useEffect(() => {
    // Ejemplo: fetch(`/api/jobs/${id}`).then(...)
    // Por ahora, asegúrate de que setJob recibe el objeto del empleo
  }, [id]);

  // 2. Disparar la IA automáticamente cuando el job esté listo
  useEffect(() => {
    if (job?.title && !summary) {
      getSummary(job.title);
    }
  }, [job, summary, getSummary]);

  if (!job) return <p className={styles.loading}>Cargando datos del empleo...</p>;

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>{job.title}</h1>
        <p className={styles.company}>{job.company}</p>
      </header>

      {/* SECCIÓN DE LA IA REFORMULADA */}
      <section className={styles.aiSection}>
        <div className={styles.aiCard}>
          <h3>✨ Resumen Inteligente (Gemini AI)</h3>
          {loading ? (
            <div className={styles.spinner}>Generando resumen mágico...</div>
          ) : (
            <p className={styles.aiText}>
              {summary || "Haz clic para generar un resumen con IA."}
            </p>
          )}
        </div>
      </section>

      <main className={styles.content}>
        <div className={styles.description}>
          <h4>Descripción del puesto</h4>
          <p>{job.description}</p>
        </div>
      </main>
    </div>
  );
};