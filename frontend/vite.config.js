import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(
    {
      jsxRuntime: 'classic' // Add this line
    }

  )],
  build: {
    commonjsOptions: {
      transformMixedEsModules: true,
    },
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('sentry')) {
            return 'sentry';
          }
        }
      }
    }
  }
});
