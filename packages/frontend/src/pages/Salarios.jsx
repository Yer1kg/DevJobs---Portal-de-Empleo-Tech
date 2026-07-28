import { useState } from 'react';

export function Salarios() {
  const [rol, setRol] = useState('Frontend');
  const [experiencia, setExperiencia] = useState('Mid');

  // Base de datos local para alimentar el simulador
  const salariosData = {
    Frontend: {
      Junior: { min: "22K", med: "26K", max: "32K" },
      Mid: { min: "34K", med: "42K", max: "48K" },
      Senior: { min: "50K", med: "65K", max: "80K" }
    },
    Backend: {
      Junior: { min: "24K", med: "28K", max: "35K" },
      Mid: { min: "38K", med: "46K", max: "55K" },
      Senior: { min: "55K", med: "72K", max: "95K" }
    },
    Sysadmin: {
      Junior: { min: "20K", med: "24K", max: "30K" },
      Mid: { min: "30K", med: "38K", max: "45K" },
      Senior: { min: "48K", med: "58K", max: "70K" }
    },
    Fullstack: {
      Junior: { min: "25K", med: "30K", max: "38K" },
      Mid: { min: "40K", med: "50K", max: "60K" },
      Senior: { min: "60K", med: "78K", max: "105K" }
    }
  };

  const currentData = salariosData[rol]?.[experiencia] || { min: "0K", med: "0K", max: "0K" };

  // Datos para la tabla comparativa de tecnologías este año
  const topTech = [
    { tech: "React / Next.js", rol: "Frontend", media: "45,000 €", demanda: "Muy Alta" },
    { tech: "Node.js / Go", rol: "Backend", media: "52,000 €", demanda: "Alta" },
    { tech: "Docker / Kubernetes", rol: "DevOps", media: "58,000 €", demanda: "Muy Alta" },
    { tech: "Python / AI Models", rol: "Data / AI", media: "62,000 €", demanda: "Crítica" },
  ];

  return (
    <main className="bg-dark" style={{ minHeight: '100vh', paddingBottom: '60px' }}>
      
      {/* 1. HERO SUPERIOR (Mismo estilo que el detalle de empleo) */}
      <header className="hero-detail-container">
        <div className="hero-detail-inner" style={{ textAlign: 'center', padding: '40px 20px' }}>
          <span className="location-tag" style={{ fontSize: '0.9rem', color: '#5964E0', fontWeight: 'bold' }}>Estadísticas de Mercado 2026</span>
          <h1 className="job-title-h1" style={{ fontSize: '2.5rem', marginTop: '10px' }}>Calculadora de Salarios Tech</h1>
          <p className="job-meta-p" style={{ fontSize: '1.1rem' }}>
            Compara y descubre los rangos salariales reales en el sector tecnológico de manera inmediata.
          </p>
        </div>
      </header>

      {/* 2. TARJETA CENTRAL (Estilo "premium-job-card") */}
      <div className="card-shift-container" style={{ marginTop: '-40px' }}>
        <section className="premium-job-card" style={{ maxWidth: '750px', margin: '0 auto' }}>
          
          {/* Selector de Perfil */}
          <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', marginBottom: '30px' }}>
            <div style={{ flex: '1', minWidth: '200px' }}>
              <label style={{ color: '#94a3b8', fontSize: '0.85rem', fontWeight: 'bold', display: 'block', marginBottom: '8px' }}>PUESTO O ROL</label>
              <select 
                value={rol} 
                onChange={(e) => setRol(e.target.value)}
                style={{ width: '100%', padding: '14px', background: '#121721', color: 'white', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', fontSize: '1rem', outline: 'none' }}
              >
                <option value="Frontend">Frontend Developer</option>
                <option value="Backend">Backend Developer</option>
                <option value="Fullstack">Fullstack Developer</option>
                <option value="Sysadmin">Sysadmin / DevOps</option>
              </select>
            </div>

            <div style={{ flex: '1', minWidth: '200px' }}>
              <label style={{ color: '#94a3b8', fontSize: '0.85rem', fontWeight: 'bold', display: 'block', marginBottom: '8px' }}>EXPERIENCIA</label>
              <select 
                value={experiencia} 
                onChange={(e) => setExperiencia(e.target.value)}
                style={{ width: '100%', padding: '14px', background: '#121721', color: 'white', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', fontSize: '1rem', outline: 'none' }}
              >
                <option value="Junior">Junior (0 - 2 años)</option>
                <option value="Mid">Mid / Semi-Senior (2 - 5 años)</option>
                <option value="Senior">Senior (5+ años)</option>
              </select>
            </div>
          </div>

          <hr className="card-horizontal-rule" />

          {/* Visualización del Salario Medio */}
          <div style={{ textAlign: 'center', padding: '10px 0 25px 0' }}>
            <span className="location-tag">Salario Medio Estimado</span>
            <h2 className="card-title-h2" style={{ fontSize: '3.5rem', color: '#5964E0', margin: '10px 0', fontWeight: '800' }}>
              {currentData.med} <span style={{ fontSize: '1.8rem', color: '#94a3b8' }}>/ año</span>
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '0.95rem' }}>
              Rango calculado para un perfil <strong>{rol}</strong> con nivel <strong>{experiencia}</strong>.
            </p>
          </div>

          {/* Barra de Rango Dinámica */}
          <div style={{ background: '#121721', padding: '25px', borderRadius: '8px', marginBottom: '40px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8', fontSize: '0.85rem', marginBottom: '10px', fontWeight: 'bold' }}>
              <span>MÍNIMO: {currentData.min}</span>
              <span style={{ color: '#5964E0' }}>MEDIO: {currentData.med}</span>
              <span>MÁXIMO: {currentData.max}</span>
            </div>
            {/* Visualización de la Barra */}
            <div style={{ height: '8px', width: '100%', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', position: 'relative' }}>
              <div style={{ position: 'absolute', left: '15%', right: '15%', top: '0', bottom: '0', background: '#5964E0', borderRadius: '4px' }}></div>
              <div style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', top: '-4px', width: '16px', height: '16px', background: 'white', borderRadius: '50%', border: '3px solid #5964E0', boxShadow: '0 0 8px rgba(89, 100, 224, 0.6)' }}></div>
            </div>
          </div>

          {/* 3. TABLA COMPARATIVA DE TECNOLOGÍAS */}
          <div className="details-section">
            <h3 style={{ fontSize: '1.3rem', color: 'white', marginBottom: '15px' }}>Tecnologías más cotizadas (2026)</h3>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', marginTop: '10px' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                    <th style={{ padding: '12px 8px', color: '#94a3b8', fontSize: '0.85rem' }}>TECNOLOGÍA</th>
                    <th style={{ padding: '12px 8px', color: '#94a3b8', fontSize: '0.85rem' }}>ÁREA</th>
                    <th style={{ padding: '12px 8px', color: '#94a3b8', fontSize: '0.85rem' }}>MEDIA ESTIMADA</th>
                    <th style={{ padding: '12px 8px', color: '#94a3b8', fontSize: '0.85rem', textAlign: 'right' }}>DEMANDA</th>
                  </tr>
                </thead>
                <tbody>
                  {topTech.map((item, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      <td style={{ padding: '14px 8px', color: 'white', fontWeight: 'bold' }}>{item.tech}</td>
                      <td style={{ padding: '14px 8px', color: '#94a3b8' }}>{item.rol}</td>
                      <td style={{ padding: '14px 8px', color: '#5964E0', fontWeight: 'bold' }}>{item.media}</td>
                      <td style={{ padding: '14px 8px', color: item.demanda === 'Crítica' ? '#f43f5e' : '#10b981', fontWeight: 'bold', textAlign: 'right' }}>
                        {item.demanda}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </section>
      </div>
    </main>
  );
}