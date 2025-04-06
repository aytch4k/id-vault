/* eslint-disable import/no-extraneous-dependencies */
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      crypto: "empty-module",
    },
  },
  define: {
    global: "globalThis",
  },
  build: {
    target: "esnext",
    minify: "terser",
    terserOptions: {
      parallel: true, // Use multi-core CPU
      format: {
        comments: false,
      },
    },
    reportCompressedSize: false, // Speed up build
    chunkSizeWarningLimit: 1000, // Increase warning limit
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: [
            'react', 
            'react-dom', 
            '@web3auth/modal-react-hooks', 
            '@web3auth/base',
            'ethers'
          ],
        },
      },
    },
  },
  server: {
    host: true,
    port: 5173,
    hmr: {
      overlay: true,
    },
  },
  worker: {
    format: 'es',
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'ethers'],
    esbuildOptions: {
      target: 'esnext',
    },
  },
});