import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Empresas from '../components/Empresas';

export function CompanyJobs() {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [myJobs, setMyJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        let res = await fetch('http://localhost:3000/api/my-jobs', {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!res.ok) {
          res = await fetch('http://localhost:3000/api/jobs');
        }

        if (res.ok) {
          const data = await res.json();
          const allJobs = Array.isArray(data) ? data : (data.jobs || []);
          
          const userCompanyJobs = allJobs.filter(job => 
            job.company === user?.name || 
            job.company === user?.username || 
            job.userId === user?.id || 
            job.userEmail === user?.email
          );

          setMyJobs(userCompanyJobs);

          if (userCompanyJobs.length === 0) {
            setShowCreateForm(true);
          }
        }
      } catch (err) {
        console.error('Error cargando las ofertas de la empresa:', err);
        setShowCreateForm(true);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchJobs();
    }
  }, [user, token]);

  const handleDeleteJob = async (jobId) => {
    if (!window.confirm('¿Seguro que quieres eliminar esta oferta?')) return;

    try {
      const res = await fetch(`http://localhost:3000/api/jobs/${jobId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (res.ok) {
        const updatedList = myJobs.filter(job => job.id !== jobId);
        setMyJobs(updatedList);
        if (updatedList.length === 0) {
          setShowCreateForm(true);
        }
      }
    } catch (err) {
      console.error('Error al borrar oferta:', err);
    }
  };

  // ✏️ Redirige a la ruta /empresas pasando el id en el query param ?edit=
  const handleEditJob = (jobId) => {
    navigate(`/empresas?edit=${jobId}`);
  };

  if (loading) {
    return <p style={{ color: 'var(--text-dim)', padding: '20px' }}>Cargando tus ofertas...</p>;
  }

  if (showCreateForm) {
    return (
      <div>
        {myJobs.length > 0 && (
          <button
            type="button"
            onClick={() => setShowCreateForm(false)}
            style={{
              backgroundColor: 'transparent',
              border: '1px solid #334155',
              color: 'white',
              padding: '8px 16px',
              borderRadius: '6px',
              cursor: 'pointer',
              marginBottom: '20px'
            }}
          >
            ← Volver a mis ofertas ({myJobs.length})
          </button>
        )}
        <Empresas />
      </div>
    );
  }

  return (
    <div>
      <div style={{ marginBottom: '25px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 'bold', margin: '0 0 6px 0' }}>Mis ofertas publicadas</h1>
          <p style={{ color: 'var(--text-dim)', margin: 0, fontSize: '0.9rem' }}>
            Gestiona las ofertas que has creado como empresa
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowCreateForm(true)}
          className="btn-aplicar-azul"
          style={{ padding: '10px 20px', fontSize: '0.9rem' }}
        >
          + Publicar nueva oferta
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        {myJobs.map(job => (
          <div 
            key={job.id} 
            className="card-home" 
            style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
          >
            <div>
              <h3 style={{ margin: '0 0 6px 0', fontSize: '1.1rem' }}>{job.title}</h3>
              <p style={{ margin: 0, color: 'var(--text-dim)', fontSize: '0.85rem' }}>
                📍 {job.location || 'Remoto'} • 💼 {job.type || 'Jornada Completa'}
              </p>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                type="button"
                onClick={() => handleEditJob(job.id)}
                style={{
                  backgroundColor: 'rgba(59, 130, 246, 0.15)',
                  color: '#60a5fa',
                  border: '1px solid rgba(59, 130, 246, 0.3)',
                  padding: '8px 16px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  fontSize: '0.85rem'
                }}
              >
                ✏️ Editar
              </button>

              <button
                type="button"
                onClick={() => handleDeleteJob(job.id)}
                style={{
                  backgroundColor: 'rgba(239, 68, 68, 0.15)',
                  color: '#f87171',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  padding: '8px 16px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  fontSize: '0.85rem'
                }}
              >
                🗑️ Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}