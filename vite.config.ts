import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import type { UserConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig(({ mode }): UserConfig => {
  // Load env vars based on mode and prefix
  const env = loadEnv(mode, process.cwd(), '');
  
  const config: UserConfig = {
    // Base public path for production
    base: mode === 'production' ? '/frontend/' : '/',
    
    // Development server config
    server: {
      port: 3005,
      strictPort: false,
      cors: true,
      proxy: {
        '/api': {
          target: env.VITE_API_URL || 'http://localhost:3001',
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace(/^\/api/, '')
        },
        // Serve backend static uploads through Vite dev server
        '/uploads': {
          target: env.VITE_API_URL || 'http://localhost:3001',
          changeOrigin: true,
          secure: false
        }
      }
    },
    plugins: [
      react(),
      ...(mode === 'development' ? [componentTagger()] : [])
    ],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./frontend"),
      },
    },
    optimizeDeps: {
      include: ['react', 'react-dom'],
    },
    build: {
      sourcemap: true,
      outDir: 'dist',
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom'],
          },
        },
      },
    },
  };

  return config;
});
