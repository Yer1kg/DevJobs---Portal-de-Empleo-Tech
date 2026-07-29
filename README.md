# 💻 Devjobs - Portal de Empleo Tech

**Devjobs** es una plataforma web full-stack diseñada para conectar a desarrolladores con empresas del sector tecnológico. Permite la búsqueda de empleo, gestión de vacantes y perfiles profesionales dinámicos según el rol del usuario.

<p align="center">
  <img src="https://devjobs-web-6uil.onrender.com" alt="Devjobs Preview" width="800">
</p>

---

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

---

## 🚀 Instalación y Configuración Local

Este proyecto utiliza **pnpm** como gestor de paquetes para garantizar descargas más rápidas, un uso eficiente del disco y mayor seguridad en el manejo de dependencias.

### 1. Clonar el repositorio
```bash
git clone [https://github.com/TU_USUARIO/devjobs.git](https://github.com/TU_USUARIO/devjobs.git)
cd devjobs
2. Configurar el Backend
Bash
cd backend
pnpm install
Crea un archivo .env en la carpeta backend con las siguientes variables:

Fragmento de código
PORT=3000
JWT_SECRET=tu_clave_secreta_super_segura
Inicia el servidor de desarrollo:

Bash
pnpm dev
3. Configurar el Frontend
Abre otra terminal en la raíz del proyecto y ejecuta:

Bash
cd frontend
pnpm install
pnpm dev
