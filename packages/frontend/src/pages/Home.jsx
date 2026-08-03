import { useState, useEffect } from 'react'
import { SearchBar } from '../components/SearchBar'
import { JobCard } from '../components/JobCard'

// 🚀 Toma la variable de entorno de Vite o usa por defecto la API de Render
const API_URL = import.meta.env.VITE_API_URL || 'https://devjobs-api-iu23.onrender.com';

export function Home() {
  // Estado para los resultados de la barra de búsqueda
  const [searchResults, setSearchResults] = useState([])
  const [hasSearched, setHasSearched] = useState(false)

  // Estado para los 3 empleos destacados aleatorios
  const [featuredJobs, setFeaturedJobs] = useState([])

  // Carga los empleos destacados aleatorios desde el backend al montar el componente
  useEffect(() => {
    fetch(`${API_URL}/api/jobs/featured`)
      .then(res => res.json())
      .then(data => setFeaturedJobs(data))
      .catch(err => console.error("Error cargando destacados:", err))
  }, [])

  // Esta función se la pasaremos a la SearchBar para que nos devuelva los datos filtrados
  const handleSearchResults = (data) => {
    setSearchResults(data)
    setHasSearched(true)
  }

  return (
    <main>
      <header className="hero">
        <div className="container">
          <h1>Encuentra el trabajo de tus sueños</h1>
          <p>Únete a la comunidad más grande de desarrolladores y encuentra tu próxima oportunidad.</p>
        </div>
      </header>

      {/* Le pasamos la función para actualizar los resultados de búsqueda */}
      <SearchBar onSearch={handleSearchResults} />

      {/* 🔍 SECCIÓN DINÁMICA: RESULTADOS DE LA BÚSQUEDA (Solo aparece si se ha buscado algo) */}
      {hasSearched && (
        <div className="container" style={{ marginTop: '40px', marginBottom: '40px' }}>
          <div className="section-header">
            <h2 style={{ color: '#5964E0' }}>Resultados de la búsqueda</h2>
          </div>
          {searchResults.length === 0 ? (
            <p style={{ color: '#979797' }}>No se encontraron ofertas que coincidan con tu búsqueda.</p>
          ) : (
            <section className="grid-proyectos">
              {searchResults.map(job => (
                <JobCard 
                  key={job.id} 
                  title={job.title} 
                  company={job.company} 
                  location={job.location} 
                  authorName={job.author_name} // 🌟 Integrado para mostrar el nombre dinámico del creador
                />
              ))}
            </section>
          )}
        </div>
      )}

      {/* SECCIÓN: ¿POR QUÉ DEVJOBS? */}
      <section className="explanation-section">
        <div className="container">
          <h2>¿Por qué DevJobs?</h2>
          <p>DevJobs es la principal bolsa de trabajo para desarrolladores. Conectamos a los desarrolladores con las mejores empresas del mundo.</p>
          
          <div className="grid-proyectos" style={{ marginTop: '40px' }}>
            <div className="card-home">
              <div className="job-icon-container" style={{ backgroundColor: 'rgba(89, 100, 224, 0.1)' }}>
                <span style={{ color: '#5964E0' }}>💼</span>
              </div>
              <h3>Encuentra el trabajo de tus sueños</h3>
              <p>Busca miles de empleos de las mejores empresas de todo el mundo.</p>
            </div>

            <div className="card-home">
              <div className="job-icon-container" style={{ backgroundColor: 'rgba(89, 100, 224, 0.1)' }}>
                <span style={{ color: '#5964E0' }}>👥</span>
              </div>
              <h3>Conecta con las mejores empresas</h3>
              <p>Conecta con empresas que están contratando por tus habilidades.</p>
            </div>

            <div className="card-home">
              <div className="job-icon-container" style={{ backgroundColor: 'rgba(89, 100, 224, 0.1)' }}>
                <span style={{ color: '#5964E0' }}>📊</span>
              </div>
              <h3>Obtén el salario que mereces</h3>
              <p>Obtén el salario que mereces con nuestra calculadora de salarios.</p>
            </div>
          </div>
        </div>
      </section>

      {/* SECCIÓN: EMPLEOS RECIENTES / DESTACADOS ALEATORIOS */}
      <div className="container">
        <div className="section-header">
          <h2 style={{ color: 'white' }}>Empleos destacados</h2>
        </div>
        <section className="grid-proyectos">
          {featuredJobs.length === 0 ? (
            <p style={{ color: '#979797' }}>Cargando empleos destacados...</p>
          ) : (
            featuredJobs.map(job => (
              <JobCard 
                key={job.id} 
                title={job.title} 
                company={job.company} 
                location={job.location} 
                authorName={job.author_name} // 🌟 Integrado para mostrar el nombre dinámico del creador
              />
            ))
          )}
        </section>
      </div>
    </main>
  )
}
