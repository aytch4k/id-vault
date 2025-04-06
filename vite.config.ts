/* eslint-disable import/no-extraneous-dependencies */
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      process: "process/browser",
      stream: "stream-browserify",
      zlib: "browserify-zlib",
      util: "util",
      buffer: "buffer",
    },
  },
  define: {
    'process.env': {},
    global: 'globalThis',
  },
  build: {
    target: "esnext",
    minify: "terser",
    terserOptions: {
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
    include: ['react', 'react-dom', 'ethers', 'buffer', 'process/browser'],
    esbuildOptions: {
      target: 'esnext',
    },
  },
});