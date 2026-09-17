import { fileURLToPath } from 'node:url'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    // three.js + l'ecosysteme R3F pesent lourd : on les isole dans leur propre
    // chunk pour qu'ils soient telecharges uniquement quand <SceneCanvas /> est
    // monte (import dynamique cote App), sans bloquer le LCP du contenu HTML.
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (
              id.includes('three') ||
              id.includes('@react-three') ||
              id.includes('postprocessing') ||
              id.includes('maath')
            ) {
              return 'three'
            }
            if (id.includes('motion')) return 'motion'
          }
          return null
        },
      },
    },
    // Le chunk three/R3F depasse naturellement 500 kB : on releve le seuil
    // d'avertissement pour garder une sortie de build lisible.
    chunkSizeWarningLimit: 1200,
  },
})
