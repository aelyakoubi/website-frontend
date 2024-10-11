import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Check if the app is running in production
const isProduction = process.env.NODE_ENV === 'production';

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5173,
    cors: {
      origin: isProduction ? 'https://website-backend-1-n3p3.onrender.com' : 'http://localhost:3000',
      methods: ['GET', 'POST', 'PUT', 'DELETE'],
      allowedHeaders: '*',
    },
    proxy: {
      '/api': {
        target: isProduction ? 'https://api.render.com/deploy/srv-cs4kis52ng1s739mt85g?key=2n5SKhcxcQc' : 'http://localhost:3000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''), // Adjust path if needed
      },
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Customize chunk splitting if needed
          vendor: ['react', 'react-dom'],
        },
      },
    },
    chunkSizeWarningLimit: 600,
  },
  // No need to define process.env.NODE_ENV, use import.meta.env
});
