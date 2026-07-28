import { useEffect, useState } from 'react'; 
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useJobs } from '../context/JobsContext';

export function JobDetail() {
  const { id } = useParams(); 
  const { user } = useAuth();
  const { toggleSaveJob, isJobSaved, applyToJob, isJobApplied } = useJobs();
  const navigate = useNavigate();
  
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.body.className = 'bg-dark';
    
    fetch(`http://localhost:3000/api/jobs/${id}`)
      .then(res => {
        if (!res.ok) throw new Error("No se encontró el empleo");
        return res.json();
      })
      .then(data => {
        setJob(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="container" style={{ color: 'white', textAlign: 'center', padding: '100px' }}>
        <h2>Cargando detalles...</h2>
      </div>
    );
  }
  
  if (!job) {
    return (
      <div className="container" style={{ color: 'white', textAlign: 'center', padding: '100px' }}>
        <h2>Empleo no encontrado</h2>
        <Link to="/resultados" style={{ color: '#5964E0', marginTop: '10px', display: 'inline-block' }}>
          Volver al listado
        </Link>
      </div>
    );
  }

  // Solo evaluamos guardado/aplicado si el usuario está autenticado
  const saved = user ? isJobSaved(job.id) : false;
  const applied = user ? isJobApplied(job.id) : false;

  const handleApplyClick = () => {
    if (!user) {
      // Si no hay usuario, lo redirigimos a la página de login/registro
      navigate('/login');
      return;
    }
    applyToJob(job);
  };

  const handleSaveClick = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    toggleSaveJob(job);
  };

  return (
    <main className="bg-dark">
      {/* 1. CABECERA ANCHA (Hero) */}
      <header className="hero-detail">
        <div className="container hero-detail-content">
          <div className="breadcrumbs">
            <Link to="/resultados">Empleos</Link> / <span>{job.title}</span>
          </div>
          <div className="hero-title-area">
            <div>
              <h1 className="job-detail-main-title">{job.title}</h1>
              <p className="job-detail-meta">{job.company} · {job.location} · ID: {id}</p>
            </div>
            <Link to="/resultados" className="btn-secondary">Volver al listado</Link>
          </div>
        </div>
      </header>

      {/* 2. CONTENIDO PRINCIPAL DETALLADO */}
      <div className="container container-detail-card">
        <section className="job-card-detailed">
          
          <div className="job-detail-top-bar">
            <div className="job-brand-info">
              <span className="badge-location">{job.location}</span>
              <h2 className="job-title-large">{job.title}</h2>
              <p className="job-company-highlight">{job.company}</p>
            </div>
            
            <div className="job-actions-group" style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              
              {/* Botón Guardar Oferta (Visible para usuarios trabajadores o visitantes) */}
              {(!user || user.role === 'trabajador') && (
                <button 
                  onClick={handleSaveClick}
                  className="btn-secondary btn-action-detail"
                  style={{
                    backgroundColor: saved ? 'rgba(89, 100, 224, 0.15)' : 'transparent',
                    color: saved ? '#5964E0' : '#94a3b8',
                    borderColor: saved ? '#5964E0' : 'rgba(255,255,255,0.15)'
                  }}
                >
                  {saved ? "★ Guardado" : "☆ Guardar"}
                </button>
              )}

              {/* Botón Editar (Solo Empresa creadora de la oferta) */}
              {user && user.role === 'empresa' && user.id === job.user_id && (
                <Link 
                  to={`/empresas?edit=${job.id}`} 
                  className="btn-secondary btn-action-detail btn-edit-link"
                >
                  ✏️ Editar Oferta
                </Link>
              )}

              {/* Botón Principal para Postularse */}
              {(!user || user.role === 'trabajador') && (
                <button 
                  onClick={handleApplyClick}
                  disabled={applied}
                  className="btn-aplicar-azul"
                  style={{
                    backgroundColor: applied ? '#10b981' : '#5964E0',
                    cursor: applied ? 'default' : 'pointer',
                    opacity: applied ? 0.85 : 1
                  }}
                >
                  {!user ? "Iniciar sesión para aplicar" : applied ? "✓ Inscrito" : "Aplicar ahora"}
                </button>
              )}
            </div>
          </div>

          {/* 💼 NUEVA SECCIÓN DE DATOS RÁPIDOS: CONTRATO, MODALIDAD Y SALARIO */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '15px',
            backgroundColor: '#111729',
            padding: '16px 20px',
            borderRadius: '8px',
            marginTop: '20px',
            border: '1px solid rgba(255, 255, 255, 0.08)'
          }}>
            <div>
              <span style={{ color: '#94a3b8', fontSize: '0.8rem', display: 'block', marginBottom: '4px' }}>
                UBICACIÓN / MODALIDAD
              </span>
              <strong style={{ color: '#ffffff', fontSize: '0.95rem' }}>
                 {job.location || 'Remoto'}
              </strong>
            </div>

            <div>
              <span style={{ color: '#94a3b8', fontSize: '0.8rem', display: 'block', marginBottom: '4px' }}>
                TIPO DE CONTRATO
              </span>
              <strong style={{ color: '#5964E0', fontSize: '0.95rem' }}>
                 {job.type || job.contract || 'Jornada Completa'}
              </strong>
            </div>

            <div>
              <span style={{ color: '#94a3b8', fontSize: '0.8rem', display: 'block', marginBottom: '4px' }}>
                SALARIO ESTIMADO
              </span>
              <strong style={{ color: '#10b981', fontSize: '0.95rem' }}>
                 {job.salary || 'A convenir'}
              </strong>
            </div>
          </div>

          <hr className="divider" style={{ margin: '25px 0' }} />

          {/* CUERPO EXTENDIDO DE LA OFERTA */}
          <div className="job-body-content">
            <div className="job-body-section">
              <h3>Descripción del puesto</h3>
              <p>{job.description}</p>
            </div>
            
            {/* Requisitos */}
            {job.requirements && job.requirements.length > 0 ? (
              <div className="job-body-section">
                <h3>Requisitos para el puesto</h3>
                <ul className="custom-bullets-list">
                  {job.requirements.map((req, index) => (
                    <li key={index}>
                      <span className="bullet-icon">✓</span>
                      <span className="bullet-text">{req}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <div className="job-body-section">
                <h3>Requisitos para el puesto</h3>
                <ul className="custom-bullets-list">
                  <li>
                    <span className="bullet-icon">✓</span>
                    <span className="bullet-text">Experiencia demostrable trabajando en proyectos de desarrollo web.</span>
                  </li>
                  <li>
                    <span className="bullet-icon">✓</span>
                    <span className="bullet-text">Conocimientos básicos de control de versiones y trabajo en equipo.</span>
                  </li>
                </ul>
              </div>
            )}

            {/* Responsabilidades */}
            {job.responsibilities && job.responsibilities.length > 0 ? (
              <div className="job-body-section">
                <h3>Responsabilidades</h3>
                <ul className="custom-bullets-list">
                  {job.responsibilities.map((resp, index) => (
                    <li key={index}>
                      <span className="bullet-icon">✓</span>
                      <span className="bullet-text">{resp}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <div className="job-body-section">
                <h3>Responsabilidades</h3>
                <ul className="custom-bullets-list">
                  <li>
                    <span className="bullet-icon">✓</span>
                    <span className="bullet-text">Escribir código limpio, modular, bien documentado y fácil de mantener.</span>
                  </li>
                  <li>
                    <span className="bullet-icon">✓</span>
                    <span className="bullet-text">Colaborar activamente en la implementación de nuevas características del producto.</span>
                  </li>
                </ul>
              </div>
            )}
          </div>

          {/* BOTÓN INFERIOR CTA */}
          {(!user || user.role === 'trabajador') && (
            <div className="job-footer-cta">
              <button 
                onClick={handleApplyClick}
                disabled={applied}
                className="btn-aplicar-azul"
                style={{
                  backgroundColor: applied ? '#10b981' : '#5964E0',
                  cursor: applied ? 'default' : 'pointer',
                  opacity: applied ? 0.85 : 1
                }}
              >
                {!user 
                  ? "Iniciar sesión para aplicar" 
                  : applied 
                    ? "✓ Ya estás inscrito en esta oferta" 
                    : "Aplicar ahora"}
              </button>
            </div>
          )}

        </section>
      </div>
    </main>
  );
}