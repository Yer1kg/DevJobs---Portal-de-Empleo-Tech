import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

export function Profile() {
  const { user, toggleUserRole } = useAuth();

  // Estados del formulario
  const [formData, setFormData] = useState({
    name: user?.username || user?.name || 'Usuario',
    email: user?.email || '',
    location: '',
    about: '',
    jobTitle: 'Desarrollador Frontend',
    company: 'Tech Corp',
    experienceYears: '2',
  });

  const [skills, setSkills] = useState(['JavaScript', 'React', 'Node.js', 'HTML', 'CSS']);
  const [newSkill, setNewSkill] = useState('');
  const [cvFile, setCvFile] = useState(null);

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.username || user.name || prev.name,
        email: user.email || prev.email,
      }));
    }
  }, [user]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddSkill = (e) => {
    if (e.key === 'Enter' && newSkill.trim()) {
      e.preventDefault();
      if (!skills.includes(newSkill.trim())) {
        setSkills([...skills, newSkill.trim()]);
      }
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setSkills(skills.filter((s) => s !== skillToRemove));
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px 0' }}>
      {/* Título de la sección */}
      <div style={{ marginBottom: '25px' }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 'bold', margin: '0 0 6px 0' }}>Mi perfil</h1>
        <p style={{ color: 'var(--text-dim)', margin: 0, fontSize: '0.9rem' }}>
          Actualiza tu información personal y profesional
        </p>
      </div>

      {/* 🔑 ÚNICO BOTÓN / TARJETA PARA CAMBIAR DE ROL */}
      <div className="card-home" style={{ 
        padding: '25px', 
        marginBottom: '32px', 
        border: '1px solid #3b82f6', 
        backgroundColor: 'rgba(59, 130, 246, 0.05)',
        borderRadius: '8px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
          <div>
            <h3 style={{ fontSize: '1.1rem', margin: '0 0 6px 0', fontWeight: 'bold' }}>
              Rol de la cuenta
            </h3>
            <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-dim)' }}>
              Actualmente tienes rol de: <strong style={{ color: '#60a5fa', textTransform: 'capitalize' }}>{user?.role || 'trabajador'}</strong>
            </p>
          </div>
          <button 
            type="button" 
            onClick={toggleUserRole}
            className="btn-aplicar-azul"
            style={{ 
              padding: '10px 20px', 
              backgroundColor: user?.role === 'empresa' ? '#ef4444' : '#2563eb',
              cursor: 'pointer' 
            }}
          >
            Cambiar a {user?.role === 'empresa' ? 'Trabajador' : 'Empresa'}
          </button>
        </div>
      </div>

      <form style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
        
        {/* SECCIÓN 1: Información personal */}
        <div className="card-home" style={{ padding: '25px' }}>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '20px', fontWeight: 'bold' }}>
            Información personal
          </h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', color: 'var(--text-dim)' }}>Nombre de usuario</label>
              <input 
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="search-input"
                style={{ backgroundColor: 'var(--bg-body)', borderRadius: '6px', border: '1px solid #334155' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', color: 'var(--text-dim)' }}>Correo electrónico</label>
              <input 
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="search-input"
                style={{ backgroundColor: 'var(--bg-body)', borderRadius: '6px', border: '1px solid #334155' }}
              />
            </div>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', color: 'var(--text-dim)' }}>Ubicación</label>
            <input 
              type="text"
              name="location"
              placeholder="Ej. Madrid, España o Remoto"
              value={formData.location}
              onChange={handleInputChange}
              className="search-input"
              style={{ backgroundColor: 'var(--bg-body)', borderRadius: '6px', border: '1px solid #334155' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', color: 'var(--text-dim)' }}>Sobre mí</label>
            <textarea 
              name="about"
              rows="4"
              placeholder="Cuenta brevemente tu experiencia y metas profesionales..."
              value={formData.about}
              onChange={handleInputChange}
              style={{
                width: '100%',
                padding: '12px',
                backgroundColor: 'var(--bg-body)',
                border: '1px solid #334155',
                borderRadius: '6px',
                color: 'white',
                outline: 'none',
                resize: 'vertical',
                boxSizing: 'border-box'
              }}
            />
          </div>
        </div>

        {/* SECCIÓN 2: Experiencia */}
        <div className="card-home" style={{ padding: '25px' }}>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '20px', fontWeight: 'bold' }}>
            Experiencia
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', color: 'var(--text-dim)' }}>Cargo</label>
              <input 
                type="text"
                name="jobTitle"
                placeholder="Ej. Frontend Developer"
                value={formData.jobTitle}
                onChange={handleInputChange}
                className="search-input"
                style={{ backgroundColor: 'var(--bg-body)', borderRadius: '6px', border: '1px solid #334155' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', color: 'var(--text-dim)' }}>Empresa</label>
              <input 
                type="text"
                name="company"
                placeholder="Ej. Tech Corp"
                value={formData.company}
                onChange={handleInputChange}
                className="search-input"
                style={{ backgroundColor: 'var(--bg-body)', borderRadius: '6px', border: '1px solid #334155' }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', color: 'var(--text-dim)' }}>Años de experiencia</label>
            <input 
              type="number"
              name="experienceYears"
              placeholder="Ej. 2"
              value={formData.experienceYears}
              onChange={handleInputChange}
              className="search-input"
              style={{ backgroundColor: 'var(--bg-body)', borderRadius: '6px', border: '1px solid #334155', maxWidth: '200px' }}
            />
          </div>
        </div>

        {/* SECCIÓN 3: Habilidades */}
        <div className="card-home" style={{ padding: '25px' }}>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '15px', fontWeight: 'bold' }}>
            Habilidades
          </h3>
          
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '15px' }}>
            {skills.map((skill) => (
              <span key={skill} style={{
                backgroundColor: 'rgba(89, 100, 224, 0.2)',
                color: '#818cf8',
                border: '1px solid rgba(89, 100, 224, 0.3)',
                padding: '6px 14px',
                borderRadius: '20px',
                fontSize: '0.85rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                {skill}
                <button 
                  type="button" 
                  onClick={() => handleRemoveSkill(skill)}
                  style={{ background: 'none', border: 'none', color: '#818cf8', cursor: 'pointer', padding: 0, fontWeight: 'bold' }}
                >
                  ×
                </button>
              </span>
            ))}
          </div>

          <input 
            type="text"
            placeholder="Escribe una habilidad y pulsa Enter..."
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            onKeyDown={handleAddSkill}
            className="search-input"
            style={{ backgroundColor: 'var(--bg-body)', borderRadius: '6px', border: '1px solid #334155', maxWidth: '350px' }}
          />
        </div>

        {/* SECCIÓN 4: Subida de CV */}
        <div className="card-home" style={{ padding: '25px' }}>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '15px', fontWeight: 'bold' }}>
            CV
          </h3>
          
          <label style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '30px',
            border: '2px dashed #334155',
            borderRadius: '8px',
            backgroundColor: 'rgba(255,255,255,0.01)',
            cursor: 'pointer',
            textAlign: 'center'
          }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--text-dim)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: '10px' }}>
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
            <span style={{ fontWeight: 'bold', fontSize: '0.9rem', marginBottom: '4px' }}>
              {cvFile ? cvFile.name : 'Sube tu CV o arrastra y suelta'}
            </span>
            <span style={{ color: 'var(--text-dim)', fontSize: '0.78rem' }}>
              PDF, DOC, DOCX (MÁX. 5MB)
            </span>
            <input type="file" accept=".pdf,.doc,.docx" onChange={(e) => e.target.files[0] && setCvFile(e.target.files[0])} style={{ display: 'none' }} />
          </label>
        </div>

        {/* Botón Guardar Cambios */}
        <div style={{ textAlign: 'right' }}>
          <button type="submit" className="btn-aplicar-azul" style={{ padding: '12px 32px' }}>
            Guardar cambios
          </button>
        </div>

      </form>
    </div>
  );
}