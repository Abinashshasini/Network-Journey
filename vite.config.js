import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        // Long-lived vendor chunks: the 3D stack changes rarely, so it stays
        // cached across deploys of the scene code.
        manualChunks(id) {
          // Keep Vite's tiny preload helper with the entry, or the entry
          // would statically import whichever vendor chunk it lands in.
          if (id.includes('preload-helper') || id.includes('modulepreload-polyfill')) return 'react'
          if (!id.includes('node_modules')) return
          if (/[\\/](react|react-dom|scheduler)[\\/]/.test(id)) return 'react'
          if (/[\\/](three|three-stdlib|troika-[^\\/]+|bidi-js|webgl-sdf-generator)[\\/]/.test(id)) return 'three'
          if (/[\\/](@react-three|postprocessing|maath|camera-controls|meshline|stats-gl)[\\/]/.test(id)) return 'r3f'
          if (/[\\/](gsap)[\\/]/.test(id)) return 'gsap'
        },
      },
    },
  },
})
