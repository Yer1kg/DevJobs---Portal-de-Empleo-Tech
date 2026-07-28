export function Settings() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
      <div>
        <h2 style={{ margin: '0 0 5px 0', fontSize: '1.5rem' }}>⚙️ Configuración de la Cuenta</h2>
        <p style={{ margin: 0, color: 'var(--text-dim, #a0aec0)', fontSize: '0.9rem' }}>
          Gestiona la seguridad y preferencias de tu cuenta.
        </p>
      </div>

      {/* Cambiar Contraseña */}
      <div style={{ 
        padding: '20px', 
        borderRadius: '12px', 
        backgroundColor: 'rgba(255, 255, 255, 0.03)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        display: 'flex',
        flexDirection: 'column',
        gap: '15px'
      }}>
        <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Cambiar Contraseña</h3>
        <input 
          type="password" 
          placeholder="Contraseña actual" 
          style={{ padding: '10px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.2)', color: 'white' }}
        />
        <input 
          type="password" 
          placeholder="Nueva contraseña" 
          style={{ padding: '10px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.2)', color: 'white' }}
        />
        <button 
          type="button" 
          style={{
            alignSelf: 'flex-start',
            padding: '8px 16px',
            backgroundColor: '#5964E0',
            border: 'none',
            color: 'white',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '0.85rem'
          }}
        >
          Actualizar contraseña
        </button>
      </div>

      {/* Zona de Peligro */}
      <div style={{ 
        padding: '20px', 
        borderRadius: '12px', 
        backgroundColor: 'rgba(239, 68, 68, 0.05)',
        border: '1px solid rgba(239, 68, 68, 0.2)',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px'
      }}>
        <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#ef4444' }}>Zona de Peligro</h3>
        <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-dim, #a0aec0)' }}>
          Una vez eliminada tu cuenta, no podrás recuperar tus candidaturas ni datos guardados.
        </p>
        <button 
          type="button" 
          style={{
            alignSelf: 'flex-start',
            padding: '8px 16px',
            backgroundColor: '#ef4444',
            border: 'none',
            color: 'white',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '0.85rem',
            marginTop: '5px'
          }}
        >
          Eliminar mi cuenta
        </button>
      </div>
    </div>
  );
}