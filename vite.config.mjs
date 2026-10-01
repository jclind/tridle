import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./glm-test-setup.js'],
    // The puzzle day is anchored to Eastern midnight, so tests run there.
    // Other zones shift which answer a wall-clock time maps to by design.
    env: { TZ: 'America/New_York' },
  },
  build: {
    // Netlify publishes build/, which is where CRA wrote its output
    outDir: 'build',
    // Oldest browsers the CRA browserslist (>0.2%, not dead) still covered
    target: ['chrome109', 'edge109', 'firefox115', 'safari15'],
  },
})
