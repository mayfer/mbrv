import path from 'path';
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

console.log('Loading vite config from config/vite.config.ts...');


// this file is needed for React hot reloads
const mode = "production";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/client/',
  root: path.resolve(__dirname, '../'),
  build: {
    outDir: '../dist/',
    rollupOptions: {
      input: path.resolve(__dirname, '../client/index.html'),
      output: {
        entryFileNames: `[name].js`,
        chunkFileNames: `[name].js`,
        assetFileNames: `assets/[name].[ext]`
      }
    }
  }
})
