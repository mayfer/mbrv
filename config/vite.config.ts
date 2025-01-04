import path from 'path';
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

console.log('Loading vite config from config/vite.config.ts...');

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  root: path.resolve(__dirname, '../'),
  appType: 'custom',
  base: '/client/', // dev mode will override this as '/' in vite.ts
  clearScreen: false,
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
