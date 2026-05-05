import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  // Laad de React plugin zodat Vite JSX bestanden begrijpt
  plugins: [react()],

  // Server instellingen — alleen actief tijdens 'npm run dev' (lokaal)
  server: {
    host: '0.0.0.0', // Toegankelijk op je hele netwerk, niet alleen localhost
    port: 5173, // Lokale poort voor de frontend
    cors: {
      // Sta requests toe vanuit je lokale backend
      origin: 'http://localhost:3000',
      methods: ['GET', 'POST', 'PUT', 'DELETE'],
      allowedHeaders: '*',
    },
    proxy: {
      // Alle /api requests worden doorgestuurd naar je lokale backend
      // Zodat je geen CORS problemen hebt tijdens development
      '/api': {
        target: 'http://localhost:3000', // Je lokale backend adres
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },

  // Preview instellingen — actief tijdens 'npm run start' (vite preview)
  // Dit simuleert productie lokaal
  preview: {
    allowedHosts: [
      'ivory-dugong-883765.hostingersite.com', // Frontend op Hostinger
      'mintcream-aardvark-942303.hostingersite.com', // Backend op Hostinger
    ],
  },

  // Build instellingen — actief tijdens 'npm run build'
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Splits React in een aparte chunk voor betere laadtijd
          vendor: ['react', 'react-dom'],
        },
      },
    },
    chunkSizeWarningLimit: 600, // Waarschuwing als een chunk groter is dan 600kb
  },
});
