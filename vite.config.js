import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    // Netlify publishes build/, which is where CRA wrote its output
    outDir: 'build',
    // Oldest browsers the CRA browserslist (>0.2%, not dead) still covered
    target: ['chrome109', 'edge109', 'firefox115', 'safari15'],
  },
})
