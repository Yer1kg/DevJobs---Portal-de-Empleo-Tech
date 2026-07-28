import { useJobs } from '../context/JobsContext';

export function SavedJobs() {
  const { savedJobs, toggleSaveJob, applyToJob, isJobApplied } = useJobs();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div>
        <h2 style={{ margin: '0 0 5px 0', fontSize: '1.5rem' }}>🔖 Ofertas Guardadas</h2>
        <p style={{ margin: 0, color: 'var(--text-dim, #a0aec0)', fontSize: '0.9rem' }}>
          Tus ofertas marcadas para revisar o postular más tarde.
        </p>
      </div>

      {savedJobs.length === 0 ? (
        <div 
          className="card-home" 
          style={{ 
            padding: '40px', 
            textAlign: 'center', 
            color: 'var(--text-dim, #a0aec0)',
            borderRadius: '12px',
            backgroundColor: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(255, 255, 255, 0.08)'
          }}
        >
          <p style={{ margin: 0 }}>No tienes ofertas guardadas actualmente.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {savedJobs.map((job) => {
            const applied = isJobApplied(job.id);

            return (
              <div 
                key={job.id} 
                style={{ 
                  padding: '20px', 
                  borderRadius: '12px', 
                  backgroundColor: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: '15px'
                }}
              >
                <div>
                  <h3 style={{ margin: '0 0 5px 0', fontSize: '1.1rem' }}>{job.title}</h3>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-dim, #a0aec0)' }}>
                    {job.company} {job.location ? `• ${job.location}` : ''}
                  </span>
                </div>

                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  {/* Botón Quitar de guardadas */}
                  <button
                    onClick={() => toggleSaveJob(job)}
                    style={{
                      background: 'rgba(239, 68, 68, 0.15)',
                      color: '#f87171',
                      border: '1px solid rgba(239, 68, 68, 0.3)',
                      padding: '8px 12px',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '0.85rem'
                    }}
                  >
                    Quitar
                  </button>

                  {/* Botón Postularme */}
                  <button 
                    type="button" 
                    onClick={() => applyToJob(job)}
                    disabled={applied}
                    style={{
                      backgroundColor: applied ? '#10b981' : '#5964E0',
                      color: 'white',
                      border: 'none',
                      padding: '8px 16px',
                      borderRadius: '6px',
                      cursor: applied ? 'default' : 'pointer',
                      fontWeight: 'bold',
                      fontSize: '0.85rem',
                      opacity: applied ? 0.8 : 1
                    }}
                  >
                    {applied ? '✓ Postulado' : 'Postularme'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}