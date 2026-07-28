import { Link } from 'react-router-dom';
import { useJobs } from '../context/JobsContext';

export function JobCard({ title = "", company = "", location = "" }) {
  const jobId = title.toLowerCase().replace(/\s+/g, '-');
  const jobData = { id: jobId, title, company, location };

  const { toggleSaveJob, isJobSaved, applyToJob, isJobApplied } = useJobs();

  const saved = isJobSaved(jobId);
  const applied = isJobApplied(jobId);

  return (
    <div className="card-home" style={{ position: 'relative' }}>
      
      {/* Botón de Estrella / Guardar oferta */}
      <button
        onClick={() => toggleSaveJob(jobData)}
        title={saved ? "Quitar de guardadas" : "Guardar oferta"}
        style={{
          position: 'absolute',
          top: '15px',
          right: '15px',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          fontSize: '1.2rem',
          opacity: saved ? 1 : 0.4,
          transition: 'opacity 0.2s'
        }}
      >
        {saved ? '⭐' : '☆'}
      </button>

      <div className="job-icon-container">
        <span>💼</span>
      </div>

      <div className="card-content">
        <h2 className="job-title">{title}</h2>
        <p className="company-name">{company}</p>
        <p className="location-tag">{location}</p>
        
        <div style={{ display: 'flex', gap: '8px', marginTop: '15px' }}>
          {/* Botón para ver detalle */}
          <Link 
            to={`/empleo/${jobId}`} 
            className="btn-aplicar-azul" 
            style={{ 
              flex: 1, 
              textAlign: 'center', 
              textDecoration: 'none',
              backgroundColor: 'rgba(255, 255, 255, 0.08)',
              color: 'white',
              border: '1px solid rgba(255, 255, 255, 0.15)'
            }}
          >
            Ver Detalle
          </Link>

          {/* Botón de Postulación Rápida */}
          <button 
            onClick={() => applyToJob(jobData)}
            disabled={applied}
            className="btn-aplicar-azul" 
            style={{ 
              flex: 1, 
              cursor: applied ? 'default' : 'pointer',
              opacity: applied ? 0.6 : 1,
              backgroundColor: applied ? '#10b981' : undefined
            }}
          >
            {applied ? '✓ Postulado' : 'Postularme'}
          </button>
        </div>
      </div>
    </div>
  );
}