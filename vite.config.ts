import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  server: {
    proxy: {
      '/.netlify/functions': {
        target: 'http://localhost:8888',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/.netlify\/functions/, '/.netlify/functions')
      }
    }
  }

  return {
    plugins: [react()],
    envPrefix: ['VITE_', 'ADMIN_'],
    optimizeDeps: {
      exclude: ['lucide-react'],
    },
    define: {
      'import.meta.env.VITE_DATABASE_URL': JSON.stringify(env.DATABASE_URL),
    },
  };
});
