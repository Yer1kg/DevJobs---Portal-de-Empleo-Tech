// src/components/ResultsItem.jsx
import { Link } from 'react-router-dom'

export function ResultsItem({ id, titulo, empresa, ubicacion, desc }) {
  // Manejo de datos por defecto por si acaso
  const empresaTexto = empresa || 'Empresa Anónima'
  const ubicacionTexto = ubicacion || 'Remoto'
  const descripcionCorta = desc ? desc.substring(0, 160) + '...' : 'Haz clic para ver más detalles...'

  return (
    <article className="resultado-item">
      <div className="info-principal">
        <h2>{titulo}</h2>
        <p className="meta">{empresaTexto} | {ubicacionTexto}</p>
        <p className="descripcion-corta">{descripcionCorta}</p>
      </div>
      
      <div className="grupo-boton">
        {/* Usamos <Link> de react-router-dom para el detalle */}
        <Link to={`/empleo/${id}`} className="btn-aplicar-azul">
          Aplicar
        </Link>
      </div>
    </article>
  )
}