import { defineConfig } from 'vite';

export default defineConfig({
  // Entrada: index.html na raiz
  root: '.',

  build: {
    outDir: 'dist',
    // Chunking manual para separar vendor Supabase do app
    rollupOptions: {
      output: {
        manualChunks: {
          supabase: ['@supabase/supabase-js'],
        },
      },
    },
    // Aumentar limite do aviso de chunk (o app é grande propositalmente)
    chunkSizeWarningLimit: 4000,
  },

  // Dev server
  server: {
    port: 5173,
    open: true,
  },
});
