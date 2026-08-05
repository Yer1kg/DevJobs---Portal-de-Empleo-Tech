import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; 

export default function Empresas() {
  const [jobTitle, setJobTitle] = useState('');
  const [location, setLocation] = useState('Remoto'); // 📍 Modalidad/Ubicación por defecto
  const [contractType, setContractType] = useState('Jornada Completa'); // 💼 Tipo por defecto
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false); 
  const [jobId, setJobId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // 🔑 Extraemos el usuario y token
  const { user, token } = useAuth();
  
  const navigate = useNavigate();
  const consoleEndRef = useRef(null);
  const sendLock = useRef(false);

  // 🔒 FILTRO DE SEGURIDAD EXCLUSIVO: Expulsar si es un trabajador
  useEffect(() => {
    if (!user || user.role !== 'empresa') {
      alert("⚠️ Acceso denegado: Esta sección está reservada exclusivamente para cuentas de Empresa.");
      navigate('/resultados');
    }
  }, [user, navigate]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('edit');
    if (id) {
      setJobId(id);
      setIsEditing(true);
      fetchJobDetails(id);
    }
  }, []);

  const fetchJobDetails = async (id) => {
    try {
      const response = await fetch(`http://localhost:3000/api/jobs`);
      const jobs = await response.json();
      
      const job = jobs.find(j => j.id === parseInt(id));
      if (job) {
        setJobTitle(job.title || '');
        setDescription(job.description || '');
        if (job.location) setLocation(job.location);
        
        // 🛠️ Soporte para múltiples nombres de propiedad al editar
        const typeValue = job.type || job.contract || job.jobType || job.jornada;
        if (typeValue) setContractType(typeValue);
      }
    } catch (error) {
      console.error("Error cargando empleo:", error);
    }
  };

  const scrollToBottom = () => {
    consoleEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [description]);

  const handlePublish = async (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    if (description.includes("❌") || description.includes("ERROR_INVALID_POSITION")) {
      alert("⚠️ No puedes publicar una oferta con un error. Por favor, genera una descripción válida.");
      return;
    }

    if (!description || description.trim().length < 20) {
      alert("⚠️ La descripción es demasiado corta o está vacía.");
      return;
    }

    if (isSubmitting || sendLock.current) return;

    sendLock.current = true;
    setIsSubmitting(true);

    const endpoint = isEditing 
      ? `http://localhost:3000/api/jobs/update/${jobId}` 
      : 'http://localhost:3000/api/jobs/create';

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title: jobTitle,
          description: description,
          company: user?.username || "Empresa Registrada", 
          location: location,
          type: contractType, // 💼 Se envía como 'type'
          contract: contractType, // 💼 Redundancia útil para asegurar compatibilidad con la API
          salary: "A convenir"
        })
      });

      if (response.ok) {
        navigate('/resultados');
      } else {
        const errorData = await response.json();
        
        if (errorData.details && Array.isArray(errorData.details)) {
          const mensajes = errorData.details.map(d => `• ${d.message || d}`).join("\n");
          alert(`⚠️ Revisa los siguientes campos:\n\n${mensajes}`);
        } else {
          alert(`❌ ${errorData.error || "No se pudo procesar la solicitud"}`);
        }
        
        sendLock.current = false;
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error("Error en el envío:", error);
      alert("❌ Error de conexión con el servidor");
      sendLock.current = false;
      setIsSubmitting(false);
    }
  };

  const handleGenerateDescription = async () => {
    if (!jobTitle || jobTitle.length < 10) {
      return alert("Escribe un título descriptivo (mínimo 10 letras) para que la IA trabaje mejor.");
    }
    setLoading(true);
    setDescription(''); 

    try {
      const response = await fetch('http://localhost:3000/api/ai/generate-description', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ title: jobTitle, location: location }),
      });

      if (!response.ok) throw new Error("Error en el servidor");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });

        if (chunk.includes("ERROR_INVALID_POSITION")) {
          setDescription("❌ El título introducido no parece un puesto de trabajo válido. Por favor, sé más específico.");
          setLoading(false);
          return; 
        }

        setDescription((prev) => prev + chunk);
      }
    } catch (error) {
      setDescription("❌ Hubo un error al generar la descripción.");
    } finally {
      setLoading(false);
    }
  };

  const hasError = description.includes("❌");

  return (
    <div className="ai-generator-container">
      <div className="ai-header">
        <h2 style={{fontSize: '1.5rem', fontWeight: 'bold'}}>
          {isEditing ? '🔧 Editando Oferta Existente' : 'Generador de Ofertas con IA'}
        </h2>
      </div>

      {/* INPUT DEL TÍTULO */}
      <div className="ai-input-group">
        <label>Título del puesto</label>
        <input 
          type="text" 
          className="ai-input-field"
          value={jobTitle}
          onChange={(e) => setJobTitle(e.target.value)}
          placeholder="Ej: Senior React Developer Especialista"
        />
      </div>

      {/* 🎛️ SECCIÓN DE MODALIDAD Y TIPO DE JORNADA */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '20px' }}>
        <div className="ai-input-group" style={{ marginBottom: 0 }}>
          <label>Modalidad de Trabajo</label>
          <select 
            className="ai-input-field" 
            value={location} 
            onChange={(e) => setLocation(e.target.value)}
            style={{ backgroundColor: '#161b22', color: 'white', cursor: 'pointer' }}
          >
            <option value="Remoto">100% Remoto</option>
            <option value="Híbrido">Híbrido</option>
            <option value="Presencial">Presencial</option>
          </select>
        </div>

        <div className="ai-input-group" style={{ marginBottom: 0 }}>
          <label>Tipo de Jornada / Contrato</label>
          <select 
            className="ai-input-field" 
            value={contractType} 
            onChange={(e) => setContractType(e.target.value)}
            style={{ backgroundColor: '#161b22', color: 'white', cursor: 'pointer' }}
          >
            <option value="Jornada Completa">Jornada Completa</option>
            <option value="Jornada Parcial">Jornada Parcial</option>
            <option value="Freelance">Freelance</option>
            <option value="Indefinido">Indefinido</option>
          </select>
        </div>
      </div>

      {!isEditing && (
        <button 
          type="button"
          className="ai-button" 
          onClick={handleGenerateDescription} 
          disabled={loading}
        >
          {loading ? 'Generando...' : 'Generar con IA'}
        </button>
      )}

      <div className="ai-console">
        <div className="ai-console-header">
          <span className="ai-console-title">EDITOR_DE_CONTENIDO_V1</span>
          <div className="ai-console-dots">
            <div className="dot red"></div>
            <div className="dot yellow"></div>
            <div className="dot green"></div>
          </div>
        </div>
        
        <div className="ai-console-body">
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="La IA escribirá aquí..."
            style={{
              width: '100%',
              minHeight: '350px',
              background: 'transparent',
              color: hasError ? '#ff6b6b' : '#e6edf3', 
              border: 'none',
              outline: 'none',
              fontFamily: 'monospace',
              resize: 'vertical',
              lineHeight: '1.5'
            }}
          />
          <div ref={consoleEndRef} />
        </div>
      </div>

      <div style={{ display: 'flex', gap: '10px' }}>
        <button 
          type="button" 
          className="ai-button" 
          style={{ 
            marginTop: '20px', 
            backgroundColor: (isSubmitting || hasError) ? '#1b602a' : '#238636', 
            flex: 1,
            opacity: (isSubmitting || hasError) ? 0.5 : 1,
            cursor: (isSubmitting || hasError) ? 'not-allowed' : 'pointer'
          }}
          onClick={handlePublish}
          disabled={isSubmitting || hasError} 
        >
          {isSubmitting ? 'Procesando...' : (isEditing ? 'Guardar Cambios' : 'Publicar Vacante')}
        </button>
        
        {isEditing && (
          <button 
            type="button"
            className="ai-button" 
            style={{ marginTop: '20px', backgroundColor: '#6e7681', flex: 0.3 }}
            onClick={() => navigate('/resultados')}
          >
            Cancelar
          </button>
        )}
      </div>
    </div>
  );
}
