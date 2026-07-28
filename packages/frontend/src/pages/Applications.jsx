import { useJobs } from '../context/JobsContext';

export function Applications() {
  const { applications } = useJobs();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div>
        <h2 style={{ margin: '0 0 5px 0', fontSize: '1.5rem' }}>💼 Mis Candidaturas</h2>
        <p style={{ margin: 0, color: 'var(--text-dim, #a0aec0)', fontSize: '0.9rem' }}>
          Sigue el estado de los empleos a los que te has postulado.
        </p>
      </div>

      {applications.length === 0 ? (
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
          <p style={{ margin: 0 }}>Aún no te has inscrito en ninguna oferta de empleo.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {applications.map((app) => (
            <div 
              key={app.id} 
              className="card-home" 
              style={{ 
                padding: '20px', 
                borderRadius: '12px', 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                backgroundColor: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.08)'
              }}
            >
              <div>
                <h3 style={{ margin: '0 0 5px 0', fontSize: '1.1rem' }}>{app.title}</h3>
                <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-dim, #a0aec0)' }}>
                  {app.company} {app.location ? `• ${app.location}` : ''} • Postulado el {app.date}
                </p>
              </div>

              <span style={{
                backgroundColor: `${app.statusColor || '#f59e0b'}20`,
                color: app.statusColor || '#f59e0b',
                border: `1px solid ${app.statusColor || '#f59e0b'}50`,
                padding: '6px 14px',
                borderRadius: '20px',
                fontSize: '0.8rem',
                fontWeight: 'bold'
              }}>
                ⏳ {app.status}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}