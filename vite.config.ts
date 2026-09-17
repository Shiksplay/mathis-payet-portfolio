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
    // Pas de manualChunks : la frontiere d'import dynamique de <SceneCanvas />
    // suffit a isoler three.js dans son propre chunk. Un manualChunks manuel
    // creait au contraire une arete statique entre l'entree et le chunk three,
    // ce qui poussait Vite a emettre un <link rel="modulepreload"> et annulait
    // tout le benefice du chargement paresseux.
    // Le chunk three/R3F depasse naturellement 500 kB : on releve le seuil
    // d'avertissement pour garder une sortie de build lisible.
    chunkSizeWarningLimit: 1200,
  },
})
