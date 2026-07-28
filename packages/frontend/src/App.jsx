import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import { Results } from './pages/Results';
import { JobDetail } from './pages/JobDetail';
import { NotFound } from './pages/NotFound';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { AuthProvider } from './context/AuthContext';
import { JobsProvider } from './context/JobsContext'; 
import { Navbar } from './components/Navbar'; 
import { Profile } from './pages/Profile';
import { Salarios } from './pages/Salarios';
import { Applications } from './pages/Applications';
import { SavedJobs } from './pages/SavedJobs';
import { Settings } from './pages/Settings';
import Empresas from './components/Empresas';
import { CompanyJobs } from './pages/CompanyJobs'; // 👈 Importamos la vista de ofertas de la empresa

// Layout del panel privado
import { DashboardLayout } from './pages/DashboardLayout';
// Componente de protección de rutas
import { ProtectedRoute } from './components/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <JobsProvider> 
        <BrowserRouter>
          <div className="App">
            <Navbar /> 

            <Routes>
              {/* Rutas Públicas */}
              <Route path="/" element={<Home />} />
              <Route path="/resultados" element={<Results />} />
              <Route path="/empleo/:id" element={<JobDetail />} />
              <Route path="/login" element={<Login />} />
              <Route path="/registro" element={<Register />} />
              <Route path="/salarios" element={<Salarios />} />
              <Route path="/empresas" element={<Empresas />} />

              {/* Rutas Protegidas (Solo para usuarios con sesión iniciada) */}
              <Route element={<ProtectedRoute />}>
                <Route element={<DashboardLayout />}>
                  <Route path="/perfil" element={<Profile />} />
                  <Route path="/candidaturas" element={<Applications />} />
                  <Route path="/guardadas" element={<SavedJobs />} />
                  <Route path="/configuracion" element={<Settings />} />
                  <Route path="/mis-ofertas" element={<CompanyJobs />} /> {/* 👈 Panel de la empresa */}
                </Route>
              </Route>

              {/* 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </BrowserRouter>
      </JobsProvider>
    </AuthProvider>
  );
}

export default App;