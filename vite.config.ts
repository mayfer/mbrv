import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// this file is needed for React hot reloads
const mode = "production";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/dist/'
})
