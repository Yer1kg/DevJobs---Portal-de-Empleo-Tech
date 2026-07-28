import { Link } from 'react-router-dom';

export function NotFound() {
  return (
    <main className="container" style={{ textAlign: 'center', padding: '100px 20px' }}>
      <h1 style={{ fontSize: '6rem', color: 'var(--accent)' }}>404</h1>
      <h2>¡Ups! Página no encontrada</h2>
      <p style={{ color: 'var(--text-dim)', margin: '20px 0' }}>
        Parece que el puesto de trabajo que buscas ya ha sido cubierto o la dirección no existe.
      </p>
      <Link to="/" className="btn-aplicar-azul">Volver al Inicio</Link>
    </main>
  );
}
