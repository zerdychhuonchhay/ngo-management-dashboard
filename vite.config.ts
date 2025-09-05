import path from 'path';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      },
      // --- ADD THIS SECTION ---
      server: {
        // This is for local development (npm run dev)
        host: true // This allows Vite to be accessible on your local network
      },
      preview: {
        // This is for production preview (npm run preview)
        host: true, // This is important for Railway
        allowedHosts: [
          "frontend-production-5a78.up.railway.app"
        ]
      }
      // ------------------------
    };
});
