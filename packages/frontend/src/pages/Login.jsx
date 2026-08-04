import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { API_URL } from '../api';
import { useAuth } from '../context/AuthContext';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Contexto de autenticación y navegación
  const { login } = useAuth();
  const navigate = useNavigate();

  // Estados para el Modal de recuperar contraseña
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [recoveryEmail, setRecoveryEmail] = useState('');
  const [recoveryStatus, setRecoveryStatus] = useState({ loading: false, success: false, message: '' });

  // 1. CARGAR EMAIL RECORDADO (Si el usuario marcó "Recordarme" previamente)
  useEffect(() => {
    const savedEmail = localStorage.getItem('rememberedEmail');
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  // 2. SUBMIT CON MANEJO SEGURO DE ERRORES HTTP Y JSON
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      // 🛑 Validar respuesta del servidor antes de procesar JSON
      if (!response.ok) {
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const errorData = await response.json();
          throw new Error(errorData.error || `Error ${response.status}: Error al iniciar sesión`);
        } else {
          const textError = await response.text();
          console.error('Servidor respondió con un error no JSON:', response.status, textError);
          throw new Error(`Ruta de API no encontrada o error en servidor (${response.status})`);
        }
      }

      // ✅ Solo convertimos a JSON si la respuesta fue válida (status 200-299)
      const data = await response.json();

      // LÓGICA DE RECORDARME
      if (rememberMe) {
        localStorage.setItem('rememberedEmail', email);
      } else {
        localStorage.removeItem('rememberedEmail');
      }

      // 🔑 Guardar el usuario y el token en tu AuthContext
      login({ id: data.user.id, name: data.user.username, email: data.user.email }, data.token); 

      // Redirigir al inicio
      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // 3. RECUPERACIÓN SIMULADA PARA EL MODAL
  const handleForgotPassword = (e) => {
    e.preventDefault();
    setRecoveryStatus({ loading: true, success: false, message: '' });

    setTimeout(() => {
      setRecoveryStatus({
        loading: false,
        success: true,
        message: 'Se ha enviado un enlace de recuperación a tu correo.'
      });
    }, 1000);
  };

  return (
    <main className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
      <div className="card-home" style={{ width: '100%', maxWidth: '450px', padding: '40px' }}>
        <h2 style={{ color: 'white', marginBottom: '10px', textAlign: 'center' }}>Bienvenido de nuevo</h2>
        <p style={{ color: 'var(--text-dim)', textAlign: 'center', marginBottom: '30px' }}>Ingresa tus credenciales para acceder</p>
        
        {/* Alerta de error */}
        {error && (
          <div style={{ backgroundColor: '#ef444422', color: '#f87171', padding: '12px', borderRadius: '5px', marginBottom: '20px', border: '1px solid #ef444444', textAlign: 'center' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Email */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontWeight: 'bold' }}>Email</label>
            <input 
              type="email" 
              className="search-input" 
              style={{ backgroundColor: 'var(--bg-body)', borderRadius: '5px', border: '1px solid #334155' }}
              placeholder="correo@ejemplo.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Contraseña */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontWeight: 'bold' }}>Contraseña</label>
            <input 
              type="password" 
              className="search-input" 
              style={{ backgroundColor: 'var(--bg-body)', borderRadius: '5px', border: '1px solid #334155' }}
              placeholder="********"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {/* 🌟 FILA HORIZONTAL: Checkbox + ¿Olvidaste tu contraseña? */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-dim)', cursor: 'pointer', userSelect: 'none' }}>
              <input 
                type="checkbox" 
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                style={{ accentColor: 'var(--accent)', width: '16px', height: '16px', cursor: 'pointer' }} 
              />
              Recordarme
            </label>

            <button 
              type="button"
              onClick={() => { setShowForgotModal(true); setRecoveryStatus({ loading: false, success: false, message: '' }); }}
              style={{ background: 'none', border: 'none', color: 'var(--accent)', fontWeight: 'bold', cursor: 'pointer', padding: 0 }}
            >
              ¿Olvidaste tu contraseña?
            </button>
          </div>

          {/* Botón Submit */}
          <button type="submit" disabled={loading} className="btn-aplicar-azul" style={{ marginTop: '10px' }}>
            {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </button>
        </form>

        <p style={{ marginTop: '25px', textAlign: 'center', fontSize: '0.9rem' }}>
          ¿No tienes cuenta? <Link to="/registro" style={{ color: 'var(--accent)', textDecoration: 'none', fontWeight: 'bold' }}>Regístrate aquí</Link>
        </p>
      </div>

      {/* 🌟 MODAL RECUPERAR CONTRASEÑA */}
      {showForgotModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.75)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 1000, padding: '20px'
        }}>
          <div className="card-home" style={{ maxWidth: '400px', width: '100%', padding: '30px' }}>
            <h3 style={{ color: 'white', margin: '0 0 10px 0', textAlign: 'center' }}>Restablecer contraseña</h3>
            <p style={{ color: 'var(--text-dim)', fontSize: '0.9rem', marginBottom: '20px', textAlign: 'center' }}>
              Introduce tu correo para recibir las instrucciones de recuperación.
            </p>

            {recoveryStatus.success ? (
              <div style={{ backgroundColor: '#5964e022', border: '1px solid var(--accent)', color: 'white', padding: '12px', borderRadius: '5px', fontSize: '0.9rem', marginBottom: '20px', textAlign: 'center' }}>
                {recoveryStatus.message}
              </div>
            ) : (
              <form onSubmit={handleForgotPassword} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <input 
                  type="email" 
                  className="search-input"
                  placeholder="tu@email.com" 
                  value={recoveryEmail}
                  onChange={(e) => setRecoveryEmail(e.target.value)}
                  required
                  style={{ backgroundColor: 'var(--bg-body)', borderRadius: '5px', border: '1px solid #334155' }}
                />
                <button 
                  type="submit" 
                  disabled={recoveryStatus.loading}
                  className="btn-aplicar-azul"
                >
                  {recoveryStatus.loading ? "Enviando..." : "Enviar enlace"}
                </button>
              </form>
            )}

            <button 
              onClick={() => setShowForgotModal(false)}
              style={{ width: '100%', padding: '10px', backgroundColor: 'transparent', color: 'var(--text-dim)', border: 'none', cursor: 'pointer', marginTop: '10px' }}
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
