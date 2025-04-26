// Global type declarations
interface Window {
  Buffer: typeof Buffer;
  process: any;
  global: Window;
}

declare module 'buffer' {
  export const Buffer: any;
}

declare module 'process' {
  const process: any;
  export = process;
}

// Vite module declarations
declare module 'vite' {
  export function defineConfig(config: any): any;
}

declare module '@vitejs/plugin-react' {
  const plugin: any;
  export default plugin;
}

// React module declarations
declare module 'react' {
  import * as React from 'react';
  export = React;
  export as namespace React;
}

declare module 'react-dom/client' {
  import * as ReactDOM from 'react-dom/client';
  export = ReactDOM;
  export as namespace ReactDOM;
}

declare module 'vite/client' {
  // Empty module declaration to satisfy TypeScript
}

// JSX declarations
declare namespace JSX {
  interface IntrinsicElements {
    [elemName: string]: any;
  }
}