import { defineConfig } from 'vite';
import react from '@vitejs.plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    target: 'esnext', // <-- ESTA LÍNEA ES LA CLAVE
  },
  esbuild: {
    target: 'esnext', // <-- Opcional, para forzar también a esbuild en dev/build
  },
});
