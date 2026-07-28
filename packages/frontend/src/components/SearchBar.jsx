import { useState, useEffect } from 'react'; // Añadimos useEffect
import { useNavigate, useLocation } from 'react-router-dom'; // Añadimos useLocation

export function SearchBar() {
  const navigate = useNavigate();
  const { search } = useLocation(); // Leemos la URL actual
  
  // Inicializamos los estados vacíos
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');

  // Este efecto sincroniza la barra con la URL al recargar
  useEffect(() => {
    const params = new URLSearchParams(search);
    setTitle(params.get('title') || '');
    setLocation(params.get('location') || '');
  }, [search]); // Si la URL cambia (por el botón atrás/adelante), la barra se actualiza

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/resultados?title=${title}&location=${location}`);
  };

  return (
    <div className="container">
      <form className="search-container" onSubmit={handleSearch}>
        <div className="search-group">
          <input 
            type="text" 
            placeholder="Filtrar por título..." 
            className="search-input"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className="search-group border-left">
          <input 
            type="text" 
            placeholder="Filtrar por ubicación..." 
            className="search-input"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>
        <div className="search-actions">
          <button type="submit" className="btn-aplicar-azul">Buscar</button>
        </div>
      </form>
    </div>
  );
}