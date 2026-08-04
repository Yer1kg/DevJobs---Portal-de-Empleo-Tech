import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { API_URL } from '../api';




export function Register() {
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError(null);

    // Capturamos los datos del formulario de forma limpia
    const formData = new FormData(e.target);
    const username = formData.get('username');
    const email = formData.get('email');
    const password = formData.get('password');
    const role = formData.get('role');

    try {
      // 🚀 Usamos la variable API_URL dinámica en lugar de localhost:3000
      const response = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password, role }),
      });

      // Leemos primero como texto plano para prevenir errores si el backend responde con un cuerpo vacío
      const text = await response.text();
      const data = text ? JSON.parse(text) : {};

      if (!response.ok) {
        throw new Error(data.error || data.message || 'Error al crear la cuenta');
      }

      alert("¡Cuenta creada con éxito!");
      navigate('/login');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <main className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
      <div className="card-home" style={{ width: '100%', maxWidth: '500px', padding: '40px' }}>
        <h2 style={{ color: 'white', marginBottom: '10px', textAlign: 'center' }}>Crea tu cuenta</h2>
        <p style={{ color: 'var(--text-dim)', textAlign: 'center', marginBottom: '30px' }}>Únete a la comunidad de DevJobs</p>
        
        {error && (
          <div style={{ backgroundColor: '#ef444422', color: '#f87171', padding: '12px', borderRadius: '5px', marginBottom: '20px', border: '1px solid #ef444444', textAlign: 'center' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontWeight: 'bold' }}>Nombre de Usuario</label>
            <input type="text" name="username" className="search-input" style={{ backgroundColor: 'var(--bg-body)', borderRadius: '5px', border: '1px solid #334155' }} placeholder="Tu nombre de usuario" required />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontWeight: 'bold' }}>Email</label>
            <input type="email" name="email" className="search-input" style={{ backgroundColor: 'var(--bg-body)', borderRadius: '5px', border: '1px solid #334155' }} placeholder="correo@ejemplo.com" required />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontWeight: 'bold' }}>Contraseña</label>
            <input type="password" name="password" className="search-input" style={{ backgroundColor: 'var(--bg-body)', borderRadius: '5px', border: '1px solid #334155' }} placeholder="••••••••" required />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontWeight: 'bold' }}>Soy un...</label>
            <select name="role" className="search-input" style={{ backgroundColor: 'var(--bg-body)', borderRadius: '5px', border: '1px solid #334155', color: 'white' }}>
              <option value="trabajador">Desarrollador buscando empleo</option>
              <option value="empresa">Empresa buscando talento</option>
            </select>
          </div>

          <button type="submit" className="btn-aplicar-azul">Crear Cuenta</button>
        </form>

        <p style={{ marginTop: '25px', textAlign: 'center', fontSize: '0.9rem' }}>
          ¿Ya tienes cuenta? <Link to="/login" style={{ color: 'var(--accent)', textDecoration: 'none', fontWeight: 'bold' }}>Inicia sesión</Link>
        </p>
      </div>
    </main>
  );
}
