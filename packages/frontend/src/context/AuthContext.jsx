import { createContext, useState, useContext, useEffect } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'https://devjobs-api-iu23.onrender.com';
const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('devjobs_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem('token') || null;
  });

  const [loading, setLoading] = useState(true);

  // Sincronización inicial al cargar la página (Valida siempre con la Base de Datos)
  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    
    if (savedToken) {
      // ✅ Reemplazado localhost por API_URL
      fetch(`${API_URL}/api/profile`, {
        headers: { 'Authorization': `Bearer ${savedToken}` }
      })
        .then(res => {
          if (!res.ok) throw new Error("Token inválido o expirado");
          return res.json();
        })
        .then(dbData => {
          const savedUser = localStorage.getItem('devjobs_user');
          const localUser = savedUser ? JSON.parse(savedUser) : {};
          
          // 🔑 PREVALECE EL ROL REAL DE LA BASE DE DATOS (`dbData.role`)
          const updated = { 
            ...localUser, 
            ...dbData,
            id: dbData.id,
            username: dbData.username,
            email: dbData.email,
            role: dbData.role, // La BD es la única fuente de verdad para el rol
            favorites: localUser.favorites || [] 
          };

          setUser(updated);
          localStorage.setItem('devjobs_user', JSON.stringify(updated));
          setToken(savedToken);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error validando perfil inicial:", error);
          logout();
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  // 🔑 FUNCIÓN PARA CAMBIAR DE ROL DE FORMA PERMANENTE
  const toggleUserRole = async () => {
    if (!user || !token) return;

    const isChangingToWorker = user.role === 'empresa';

    if (isChangingToWorker) {
      const confirmChange = window.confirm(
        '⚠️ Atención: Si cambias a rol Trabajador, se eliminarán automáticamente todas tus ofertas de empleo publicadas. ¿Deseas continuar?'
      );
      if (!confirmChange) return;
    }

    try {
      // ✅ Reemplazado localhost por API_URL
      const res = await fetch(`${API_URL}/api/users/change-role`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "No se pudo cambiar el rol");
        return;
      }

      // 💾 Guardamos el NUEVO token devuelto por el servidor
      if (data.token) {
        localStorage.setItem('token', data.token);
        setToken(data.token);
      }

      // Actualizamos el objeto de usuario con el rol guardado en la BD
      const updatedUser = { 
        ...user, 
        role: data.nuevoRol 
      };

      setUser(updatedUser);
      localStorage.setItem('devjobs_user', JSON.stringify(updatedUser));

      alert(data.message);

    } catch (error) {
      console.error("Error al cambiar de rol en el servidor:", error);
      alert("Ocurrió un error de conexión al cambiar de rol.");
    }
  };

  // Función para favoritos
  const toggleFavorite = async (job) => {
    if (!user) return;

    const currentFavorites = user.favorites || [];
    const isFavorite = currentFavorites.some(fav => fav.id === job.id);

    let updatedFavorites;
    if (isFavorite) {
      updatedFavorites = currentFavorites.filter(fav => fav.id !== job.id);
    } else {
      updatedFavorites = [...currentFavorites, job];
    }

    const updatedUser = { ...user, favorites: updatedFavorites };
    setUser(updatedUser);
    localStorage.setItem('devjobs_user', JSON.stringify(updatedUser));
  };

  // --- FUNCIÓN LOGIN ---
  const login = async (userData, userToken) => {
    try {
      localStorage.setItem('token', userToken);
      setToken(userToken);

      // Consultamos el perfil para tomar el ROL REAL recién traído de la Base de Datos
      let dbData = {};
      try {
        // ✅ Reemplazado localhost por API_URL
        const response = await fetch(`${API_URL}/api/profile`, {
          headers: { 'Authorization': `Bearer ${userToken}` }
        });
        if (response.ok) {
          dbData = await response.json();
        }
      } catch (err) {
        console.warn("No se pudo cargar la confirmación de perfil");
      }

      const finalUser = {
        ...userData,
        id: dbData.id || userData.id,
        username: dbData.username || userData.username || userData.name,
        email: dbData.email || userData.email,
        role: dbData.role || userData.role || 'trabajador', // Siempre prevalece la BD
        favorites: userData.favorites || [] 
      };

      setUser(finalUser);
      localStorage.setItem('devjobs_user', JSON.stringify(finalUser));
    } catch (error) {
      console.error("Fallo general en login:", error);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('devjobs_user');
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, toggleFavorite, toggleUserRole, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
