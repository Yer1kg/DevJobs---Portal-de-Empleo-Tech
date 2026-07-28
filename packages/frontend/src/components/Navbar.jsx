import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function Navbar() {
  const { user, logout } = useAuth();

  const isCompany = user?.role === 'empresa';
  
  // Inicial para el avatar por defecto si no hay foto
  const userInitial = user?.name 
    ? user.name.charAt(0).toUpperCase() 
    : (user?.username ? user.username.charAt(0).toUpperCase() : 'U');

  return (
    <nav className="main-nav">
      <div className="container nav-content">
        <Link to="/" className="logo-link">
          <span className="logo-icon">{"</>"}</span>
          <span className="logo-text">DevJobs</span>
        </Link>
        
        <ul className="nav-links">
          <li><Link to="/">Inicio</Link></li>
          <li><Link to="/resultados">Empleos</Link></li>
          <li><Link to="/empresas">Empresas</Link></li>
          <li><Link to="/salarios">Salarios</Link></li>
        </ul>

        <div className="nav-actions" style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          {user ? (
            <>
              <Link to="/perfil" className="btn-perfil">
                Mi Perfil
              </Link>
            
              <button onClick={logout} className="btn-secondary">
                Cerrar Sesión
              </button>

              {/* 🖼️ AVATAR DEL USUARIO */}
              <Link 
                to="/perfil" 
                title="Ir a mi perfil" 
                style={{ display: 'inline-flex', alignItems: 'center', textDecoration: 'none' }}
              >
                {user.avatar || user.avatarUrl ? (
                  <img 
                    src={user.avatar || user.avatarUrl} 
                    alt={user.name || 'Avatar usuario'} 
                    style={{
                      width: '38px',
                      height: '38px',
                      borderRadius: '50%',
                      objectFit: 'cover',
                      border: `2px solid ${isCompany ? '#f59e0b' : '#5964E0'}`,
                      cursor: 'pointer'
                    }}
                  />
                ) : (
                  <div style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '50%',
                    backgroundColor: isCompany ? '#f59e0b' : '#5964E0',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 'bold',
                    fontSize: '1rem',
                    cursor: 'pointer',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.25)'
                  }}>
                    {userInitial}
                  </div>
                )}
              </Link>
            </>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              {/* Botón de Publicar con recuadro azul/oscuro */}
              <Link 
                to="/login" 
                className="btn-secondary" 
                style={{ 
                  textDecoration: 'none', 
                  color: 'white',
                  display: 'inline-block',
                  textAlign: 'center'
                }}
              >
                Publicar un empleo
              </Link>

              {/* Botón de Iniciar Sesión con recuadro azul brillante */}
              <Link 
                to="/login" 
                className="btn-aplicar-azul"
                style={{ textDecoration: 'none' }}
              >
                Iniciar sesión
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}