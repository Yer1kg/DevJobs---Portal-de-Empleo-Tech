import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext'; // Importamos la autenticación

const JobsContext = createContext();

export function JobsProvider({ children }) {
  const { user } = useAuth(); // Obtenemos el usuario autenticado actual

  const userId = user ? user.id || user.email : null;

  // Estados para empleos guardados y postulación
  const [savedJobs, setSavedJobs] = useState([]);
  const [applications, setApplications] = useState([]);

  // Cada vez que cambia el usuario (login/logout), cargamos sus datos específicos
  useEffect(() => {
    if (userId) {
      const savedLocal = localStorage.getItem(`saved_jobs_${userId}`);
      const appsLocal = localStorage.getItem(`user_applications_${userId}`);

      setSavedJobs(savedLocal ? JSON.parse(savedLocal) : []);
      setApplications(appsLocal ? JSON.parse(appsLocal) : []);
    } else {
      // Si no hay sesión iniciada, reseteamos las listas
      setSavedJobs([]);
      setApplications([]);
    }
  }, [userId]);

  // Guardar en localStorage usando la clave única del usuario
  useEffect(() => {
    if (userId) {
      localStorage.setItem(`saved_jobs_${userId}`, JSON.stringify(savedJobs));
    }
  }, [savedJobs, userId]);

  useEffect(() => {
    if (userId) {
      localStorage.setItem(`user_applications_${userId}`, JSON.stringify(applications));
    }
  }, [applications, userId]);

  // Alternar Guardar / Desguardar
  const toggleSaveJob = (job) => {
    if (!userId) return; // Si no hay usuario, no guardamos

    setSavedJobs((prev) => {
      const exists = prev.some((item) => item.id === job.id);
      if (exists) {
        return prev.filter((item) => item.id !== job.id);
      } else {
        return [...prev, job];
      }
    });
  };

  const isJobSaved = (jobId) => {
    if (!userId) return false;
    return savedJobs.some((item) => item.id === jobId);
  };

  // Postularse a una oferta
  const applyToJob = (job) => {
    if (!userId) return; // Si no hay usuario, no postulamos

    const isApplied = applications.some((item) => item.id === job.id);
    if (!isApplied) {
      const newApp = {
        id: job.id,
        title: job.title,
        company: job.company,
        location: job.location,
        date: new Date().toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' }),
        status: 'En revisión',
        statusColor: '#f59e0b'
      };
      setApplications((prev) => [newApp, ...prev]);
    }
  };

  const isJobApplied = (jobId) => {
    if (!userId) return false;
    return applications.some((item) => item.id === jobId);
  };

  return (
    <JobsContext.Provider value={{
      savedJobs,
      toggleSaveJob,
      isJobSaved,
      applications,
      applyToJob,
      isJobApplied
    }}>
      {children}
    </JobsContext.Provider>
  );
}

export const useJobs = () => useContext(JobsContext);