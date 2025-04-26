/* eslint-disable import/no-extraneous-dependencies */
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { nodePolyfills } from 'vite-plugin-node-polyfills';

// Access to process.env
declare const process: {
  env: Record<string, string>;
};

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    nodePolyfills({
      // Whether to polyfill `node:` protocol imports.
      protocolImports: true,
    }),
  ],
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
    'import.meta.env': JSON.stringify(process.env),
    'global': 'window',
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
    include: [
      'react', 
      'react-dom', 
      '@web3auth/modal-react-hooks',
      '@web3auth/base',
      'buffer',
      'process'
    ],
    esbuildOptions: {
      target: 'esnext',
      define: {
        global: 'globalThis',
      },
    },
  },
});