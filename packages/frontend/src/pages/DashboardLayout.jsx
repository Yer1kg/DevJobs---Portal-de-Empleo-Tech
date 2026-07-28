import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function DashboardLayout() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const isCompany = user?.role === 'empresa';

  return (
    <main className="container" style={{ padding: '30px 20px', color: 'white', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: '40px', alignItems: 'start' }}>
        
        {/* MENÚ LATERAL */}
        <aside style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
          
          {/* Info básica del usuario */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              backgroundColor: isCompany ? '#f59e0b' : '#5964E0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.2rem',
              fontWeight: 'bold'
            }}>
              {user?.name ? user.name.charAt(0).toUpperCase() : (user?.username ? user.username.charAt(0).toUpperCase() : 'U')}
            </div>
            <div>
              <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 'bold' }}>
                {user?.name || user?.username || 'Usuario'}
              </h4>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-dim, #a0aec0)', textTransform: 'capitalize' }}>
                {isCompany ? 'Empresa' : 'Trabajador'}
              </span>
            </div>
          </div>

          {/* Links de Navegación */}
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <button 
              onClick={() => navigate('/')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '10px 14px',
                borderRadius: '8px',
                background: 'transparent',
                color: 'var(--text-dim, #a0aec0)',
                border: 'none',
                cursor: 'pointer',
                textAlign: 'left',
                fontSize: '0.9rem'
              }}
            >
              🏠 Inicio
            </button>

            <NavLink 
              to="/perfil" 
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '10px 14px',
                borderRadius: '8px',
                background: isActive ? 'rgba(89, 100, 224, 0.2)' : 'transparent',
                color: isActive ? '#818cf8' : 'var(--text-dim, #a0aec0)',
                textDecoration: 'none',
                fontWeight: isActive ? 'bold' : 'normal',
                fontSize: '0.9rem'
              })}
            >
              👤 Mi perfil
            </NavLink>

            {!isCompany ? (
              <>
                <NavLink 
                  to="/candidaturas" 
                  style={({ isActive }) => ({
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    background: isActive ? 'rgba(89, 100, 224, 0.2)' : 'transparent',
                    color: isActive ? '#818cf8' : 'var(--text-dim, #a0aec0)',
                    textDecoration: 'none',
                    fontWeight: isActive ? 'bold' : 'normal',
                    fontSize: '0.9rem'
                  })}
                >
                  💼 Mis candidaturas
                </NavLink>

                <NavLink 
                  to="/guardadas" 
                  style={({ isActive }) => ({
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    background: isActive ? 'rgba(89, 100, 224, 0.2)' : 'transparent',
                    color: isActive ? '#818cf8' : 'var(--text-dim, #a0aec0)',
                    textDecoration: 'none',
                    fontWeight: isActive ? 'bold' : 'normal',
                    fontSize: '0.9rem'
                  })}
                >
                  🔖 Ofertas guardadas
                </NavLink>
              </>
            ) : (
              <NavLink 
                to="/mis-ofertas" 
                style={({ isActive }) => ({
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '10px 14px',
                  borderRadius: '8px',
                  background: isActive ? 'rgba(245, 158, 11, 0.2)' : 'transparent',
                  color: isActive ? '#f59e0b' : 'var(--text-dim, #a0aec0)',
                  textDecoration: 'none',
                  fontWeight: isActive ? 'bold' : 'normal',
                  fontSize: '0.9rem'
                })}
              >
                📢 Panel de Ofertas
              </NavLink>
            )}

            <NavLink 
              to="/configuracion" 
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '10px 14px',
                borderRadius: '8px',
                background: isActive ? 'rgba(89, 100, 224, 0.2)' : 'transparent',
                color: isActive ? '#818cf8' : 'var(--text-dim, #a0aec0)',
                textDecoration: 'none',
                fontWeight: isActive ? 'bold' : 'normal',
                fontSize: '0.9rem'
              })}
            >
              ⚙️ Configuración
            </NavLink>
          </nav>

        </aside>

        {/* CONTENIDO DINÁMICO */}
        <section>
          <Outlet />
        </section>

      </div>
    </main>
  );
}