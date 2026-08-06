import { useEffect, useState, useMemo } from 'react'; 
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { SearchBar } from '../components/SearchBar';
import { useAuth } from '../context/AuthContext';
import { useJobs } from '../context/JobsContext';

// Configuración dinámica de la URL base para Render / Entorno de Producción
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export function Results() {
  const { user, token } = useAuth();
  const { toggleSaveJob, isJobSaved } = useJobs();
  const { search } = useLocation(); 
  const navigate = useNavigate();

  const [allJobs, setAllJobs] = useState([]);
  const [cargandoDatos, setCargandoDatos] = useState(true);
  
  // ESTADOS PARA FILTROS
  const [techFilter, setTechFilter] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [contractFilter, setContractFilter] = useState('');
  const [experienceFilter, setExperienceFilter] = useState('');

  // Paginación
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 6;

  const eliminarEmpleo = async (id) => {
    if (!window.confirm(`¿Seguro que quieres eliminar la vacante con ID: ${id}?`)) return;

    try {
      const response = await fetch(`${API_URL}/api/jobs/delete/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      
      if (response.ok) {
        alert(data.message || "Vacante eliminada correctamente");
        setAllJobs(prevJobs => prevJobs.filter(job => job.id !== id));
      } else {
        alert(`❌ ${data.message || "No se pudo eliminar la vacante"}`);
      }
    } catch (error) {
      console.error("Error al eliminar:", error);
      alert("❌ Hubo un error al intentar conectar con el servidor.");
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    setCargandoDatos(true);

    fetch(`${API_URL}/api/jobs${search}`, { signal: controller.signal })
      .then(res => res.json())
      .then(data => {
        const jobsArray = data && data.data && Array.isArray(data.data) 
          ? data.data 
          : (Array.isArray(data) ? data : []);
        
        setAllJobs(jobsArray);
        setCurrentPage(1);
        setCargandoDatos(false);
      })
      .catch(err => {
        if (err.name !== 'AbortError') {
          console.error("Error al conectar el servidor:", err);
          setCargandoDatos(false);
        }
      });

    return () => controller.abort();
  }, [search]);

// FILTRADO OPTIMIZADO CON useMemo
  const filteredJobs = useMemo(() => {
    return allJobs.filter((job) => {
      const titleAndDesc = `${job.title || ''} ${job.description || ''}`.toLowerCase();
      const locationText = (job.location || '').toLowerCase();
      
      // Captura el tipo de contrato sin importar la clave devuelta por el servidor
      const typeText = (
        job.type || 
        job.contract || 
        job.contract_type || 
        job.jornada || 
        job.tipo_jornada || 
        ''
      ).toLowerCase();

      const matchesTech = !techFilter || titleAndDesc.includes(techFilter.toLowerCase());
      const matchesLocation = !locationFilter || locationText.includes(locationFilter.toLowerCase());
      const matchesContract = !contractFilter || typeText.includes(contractFilter.toLowerCase());
      const matchesExperience = !experienceFilter || titleAndDesc.includes(experienceFilter.toLowerCase());

      return matchesTech && matchesLocation && matchesContract && matchesExperience;
    });
  }, [allJobs, techFilter, locationFilter, contractFilter, experienceFilter]);

  const handleFilterChange = (setter, value) => {
    setter(value);
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setTechFilter('');
    setLocationFilter('');
    setContractFilter('');
    setExperienceFilter('');
    setCurrentPage(1);
  };

  // CÁLCULO DE PAGINACIÓN LOCAL
  const totalResults = filteredJobs.length;
  const totalPages = Math.ceil(totalResults / jobsPerPage);
  
  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = useMemo(() => {
    return filteredJobs.slice(indexOfFirstJob, indexOfLastJob);
  }, [filteredJobs, indexOfFirstJob, indexOfLastJob]);

  if (cargandoDatos) {
    return (
      <div className="container" style={{ color: 'white', padding: '100px', textAlign: 'center' }}>
        <h2>Conectando con el servidor...</h2>
      </div>
    );
  }

  return (
    <main className="bg-dark" style={{ minHeight: '100vh', paddingBottom: '60px' }}>
      
      <style>{`
        .results-hero {
          background: linear-gradient(rgba(17, 23, 41, 0.85), rgba(17, 23, 41, 0.95)), 
                      url('https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1352&q=80');
          background-size: cover;
          background-position: center;
          padding: 60px 0 80px 0;
          border-bottom: 1px solid rgba(255,255,255,0.05);
        }

        .filter-pills-container {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
          margin-top: 20px;
          justify-content: center;
          align-items: center;
        }

        .pill-button {
          background-color: #19202D;
          color: #94a3b8;
          border: 1px solid rgba(255,255,255,0.08);
          padding: 8px 16px;
          border-radius: 20px;
          font-size: 0.85rem;
          cursor: pointer;
          font-weight: 500;
          transition: all 0.2s ease;
          outline: none;
        }

        .pill-button:hover, .pill-button:focus {
          background-color: #5964E0;
          color: white;
          border-color: #5964E0;
        }

        .pill-button option {
          background-color: #19202D;
          color: white;
        }

        .jobs-list-layout {
          display: flex;
          flex-direction: column;
          gap: 20px;
          margin-top: 40px;
        }

        .row-job-card {
          background-color: #19202D;
          border-radius: 8px;
          padding: 28px;
          border: 1px solid rgba(255,255,255,0.05);
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 30px;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .row-job-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(0,0,0,0.25);
        }

        .job-card-main-content {
          flex: 1;
        }

        .job-card-meta {
          display: flex;
          gap: 12px;
          color: #94a3b8;
          font-size: 0.9rem;
          margin: 6px 0 12px 0;
          align-items: center;
        }

        .company-blue-link {
          color: #5964E0;
          font-weight: bold;
          text-decoration: none;
        }

        .job-card-desc {
          color: #94a3b8;
          line-height: 1.6;
          font-size: 0.95rem;
          margin: 0;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .job-card-actions-side {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 10px;
          min-width: 150px;
        }

        .pagination-container {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 8px;
          margin-top: 50px;
        }

        .pagination-btn {
          background-color: #19202D;
          border: 1px solid rgba(255,255,255,0.08);
          color: #94a3b8;
          padding: 10px 16px;
          border-radius: 6px;
          font-weight: bold;
          cursor: pointer;
          transition: all 0.2s ease;
          text-decoration: none;
        }

        .pagination-btn:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }

        .pagination-btn.active {
          background-color: #5964E0;
          color: white;
          border-color: #5964E0;
        }

        .pagination-btn:hover:not(.active):not(:disabled) {
          background-color: rgba(89, 100, 224, 0.1);
          color: #5964E0;
        }

        @media (max-width: 768px) {
          .row-job-card {
            flex-direction: column;
            align-items: flex-start;
            gap: 20px;
          }
          .job-card-actions-side {
            width: 100%;
            flex-direction: row;
            justify-content: space-between;
          }
        }
      `}</style>

      {/* 1. HERO SUPERIOR CON DECORACIÓN */}
      <header className="results-hero">
        <div className="container" style={{ textAlign: 'center' }}>
          <h1 style={{ color: 'white', fontSize: '2.5rem', fontWeight: 'bold' }}>Resultados de búsqueda</h1>
          <p style={{ color: '#94a3b8', marginTop: '10px', fontSize: '1.05rem' }}>
            {totalResults === 0 
              ? "No se encontraron vacantes para esta búsqueda" 
              : `Hemos encontrado ${totalResults} vacantes activas en el sector`}
          </p>
        </div>
      </header>

      {/* 2. BARRA DE BÚSQUEDA INTERACTIVA Y FILTROS */}
      <div className="container" style={{ marginTop: '-35px' }}>
        <SearchBar />
        
        <div className="filter-pills-container">
          <select 
            className="pill-button" 
            value={techFilter} 
            onChange={(e) => handleFilterChange(setTechFilter, e.target.value)}
          >
            <option value="">Tecnología (Todas) ▾</option>
            <option value="react">React</option>
            <option value="node">Node.js</option>
            <option value="javascript">JavaScript</option>
            <option value="python">Python</option>
            <option value="java">Java</option>
          </select>

          <select 
            className="pill-button" 
            value={locationFilter} 
            onChange={(e) => handleFilterChange(setLocationFilter, e.target.value)}
          >
            <option value="">Ubicación / Modalidad (Todas) ▾</option>
            <option value="remoto">100% Remoto</option>
            <option value="híbrido">Híbrido</option>
            <option value="presencial">Presencial</option>
            <option value="madrid">Madrid</option>
            <option value="barcelona">Barcelona</option>
            <option value="valencia">Valencia</option>
          </select>

          <select 
            className="pill-button" 
            value={contractFilter} 
            onChange={(e) => handleFilterChange(setContractFilter, e.target.value)}
          >
            <option value="">Tipo de contrato ▾</option>
            <option value="Jornada Completa">Jornada Completa</option>
            <option value="Jornada Parcial">Jornada Parcial</option>
            <option value="Indefinido">Indefinido</option>
            <option value="Freelance">Freelance</option>
          </select>

          <select 
            className="pill-button" 
            value={experienceFilter} 
            onChange={(e) => handleFilterChange(setExperienceFilter, e.target.value)}
          >
            <option value="">Nivel de experiencia ▾</option>
            <option value="junior">Junior</option>
            <option value="mid">Mid-level</option>
            <option value="senior">Senior</option>
            <option value="lead">Lead</option>
          </select>

          {(techFilter || locationFilter || contractFilter || experienceFilter) && (
            <button 
              onClick={handleResetFilters}
              style={{
                background: 'rgba(255, 77, 77, 0.15)',
                color: '#ff4d4d',
                border: '1px solid rgba(255, 77, 77, 0.3)',
                padding: '8px 14px',
                borderRadius: '20px',
                fontSize: '0.85rem',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              ✕ Limpiar filtros
            </button>
          )}
        </div>
      </div>

      {/* 3. LISTADO DE TRABAJOS ALINEADOS */}
      <div className="container" style={{ marginTop: '20px', paddingBottom: '40px' }}>
        <section className="jobs-list-layout">
          
          {currentJobs.map((job) => {
            const saved = isJobSaved(job.id);
            const isEmpresaOwner = user && 
                                   user.id === job.user_id && 
                                   user.role && 
                                   String(user.role).toLowerCase().trim() === 'empresa';

            return (
              <article key={job.id} className="row-job-card">
                
                {/* Bloque Izquierdo */}
                <div className="job-card-main-content">
                  <h3 style={{ color: 'white', fontSize: '1.35rem', margin: '0', fontWeight: '700' }}>
                    {job.title}
                  </h3>
                  
                  <div className="job-card-meta">
                    <span className="company-blue-link">{job.company}</span>
                    <span style={{ color: 'rgba(255,255,255,0.15)' }}>•</span>
                    <span>{job.location}</span>
                  </div>

                  <p className="job-card-desc">{job.description}</p>
                </div>

                {/* Bloque Derecho */}
                <div className="job-card-actions-side">
                  
                  <Link to={`/empleo/${job.id}`} className="btn-custom-blue" style={{
                    padding: '10px 18px',
                    borderRadius: '6px',
                    textDecoration: 'none',
                    fontWeight: 'bold',
                    fontSize: '0.88rem',
                    textAlign: 'center',
                    width: '100%',
                    display: 'block',
                    backgroundColor: '#5964E0',
                    color: 'white',
                    border: 'none',
                    transition: 'background-color 0.2s ease'
                  }}>
                    Ver Detalles
                  </Link>

                  {(!user || String(user?.role).toLowerCase().trim() === 'trabajador') && (
                    <button 
                      onClick={() => toggleSaveJob(job)} 
                      style={{ 
                        background: saved ? 'rgba(89, 100, 224, 0.15)' : 'transparent', 
                        border: `1px solid ${saved ? '#5964E0' : 'rgba(255,255,255,0.15)'}`, 
                        color: saved ? '#5964E0' : '#94a3b8',
                        padding: '8px 12px',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '0.85rem',
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                        fontWeight: 'bold',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      {saved ? "★ Guardado" : "☆ Guardar"}
                    </button>
                  )}

                  {isEmpresaOwner && (
                    <div style={{ display: 'flex', gap: '8px', width: '100%' }}>
                      <button 
                        onClick={() => navigate(`/empresas?edit=${job.id}`)}
                        style={{ 
                          flex: 1,
                          background: 'rgba(89, 100, 224, 0.1)', 
                          color: '#5964E0', 
                          border: '1px solid rgba(89, 100, 224, 0.3)', 
                          padding: '8px 0', 
                          borderRadius: '6px', 
                          cursor: 'pointer', 
                          fontSize: '0.8rem',
                          fontWeight: 'bold'
                        }}
                      >
                        ✏️ Editar
                      </button>
                      <button 
                        onClick={() => eliminarEmpleo(job.id)}
                        style={{ 
                          flex: 1,
                          background: 'rgba(255, 77, 77, 0.1)', 
                          color: '#ff4d4d', 
                          border: '1px solid rgba(255, 77, 77, 0.3)', 
                          padding: '8px 0', 
                          borderRadius: '6px', 
                          cursor: 'pointer', 
                          fontSize: '0.8rem',
                          fontWeight: 'bold'
                        }}
                      >
                        🗑️ Borrar
                      </button>
                    </div>
                  )}

                </div>
              </article>
            );
          })}
        </section>

        {/* 4. PAGINACIÓN */}
        {totalPages > 1 && (
          <div className="pagination-container">
            <button 
              className="pagination-btn" 
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              &lt;
            </button>
            
            {[...Array(totalPages)].map((_, index) => (
              <button 
                key={index} 
                onClick={() => setCurrentPage(index + 1)}
                className={`pagination-btn ${currentPage === index + 1 ? 'active' : ''}`}
              >
                {index + 1}
              </button>
            ))}
            
            <button 
              className="pagination-btn" 
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              &gt;
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
