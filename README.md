# 💻 Devjobs - Portal de Empleo Tech

DevJobs es una plataforma web full-stack de empleo tech que conecta desarrolladores con empresas. Construida como proyecto final del bootcamp JSCamp de midudev, disponible online como demo técnica

Permite a empresas publicar, editar y borrar vacantes; a candidatos buscar ofertas con filtros dinámicos por título, ubicación, tipo de contrato y categoría, guardar favoritos y gestionar postulaciones. Incluye autenticación con JWT y roles, validación con Zod y generación de descripciones con IA en streaming.

Web: https://devjobs-web-6uil.onrender.com
Api: https://devjobs-api-iu23.onrender.com

## ✨ Características Principales

### 👤 Para Candidatos (Trabajadores):
* **Búsqueda de empleo:** Filtrado y consulta de vacantes disponibles.
* **Perfil profesional:** Edición de experiencia, habilidades técnicas (tags) y subida de CV.
* **Ofertas Guardadas:** Sistema de favoritos sincronizado en tiempo real.
* **Gestión de candidaturas:** Panel para revisar el estado de tus postulaciones.

### 🏢 Para Reclutadores (Empresas):
* **Panel de Ofertas:** Publicación, edición y eliminación de vacantes.
* **Cambio de Rol Seguro:** Si una empresa pasa a perfil de trabajador, el sistema limpia automáticamente sus publicaciones activas en la base de datos.

### 🔐 Seguridad y Autenticación:
* Autenticación basada en **JSON Web Tokens (JWT)**.
* Rutas protegidas y middleware de verificación de roles en backend y frontend.
* Persistencia de sesión mediante `localStorage` y validación directa en base de datos.

---

## 🛠️ Tecnologías Utilizadas

### Gestor de Paquetes:
* **pnpm** (Elegido por su arquitectura orientada a la seguridad, aislamiento estricto de dependencias en `node_modules` frente a vulnerabilidades y eficiencia en espacio de disco).

### Frontend:
* **React.js** (con Vite)
* **React Router DOM** (Navegación y Layouts)
* **Context API** (Gestión de estado global de autenticación)
* **CSS Puro / Módulos** (Modo oscuro personalizado)

### Backend:
* **Node.js** con **Express** (TypeScript)
* **SQLite** (Base de datos relacional)
* **JWT (JsonWebToken)** & **Bcrypt** (Seguridad y encriptación)
* **CORS** & **Dotenv**
