import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react-swc';
import tsconfigPaths from 'vite-tsconfig-paths';
import tailwindcss from '@tailwindcss/vite';

interface Chunks {
  [key: string]: string[];
}

const renderChunks = (deps: Record<string, string>) => {
  const chunks: Chunks = {};
  Object.keys(deps).forEach((key) => {
    if (['react', 'react-router-dom', 'react-dom'].includes(key)) {
      return;
    }
    chunks[key] = [key];
  });

  return chunks;
};

const dependencies = {
  '@hookform/resolvers': '@hookform/resolvers',
  '@tanstack/react-query': '@tanstack/react-query',
  '@tanstack/react-query-devtools': '@tanstack/react-query-devtools',
  'airbridge-web-sdk-loader': 'airbridge-web-sdk-loader',
  axios: 'axios',
  exceljs: 'exceljs',
  history: 'history',
  immer: 'immer',
  'lodash-es': 'lodash-es',
  qs: 'qs',
  react: 'react',
  'react-beautiful-dnd': 'react-beautiful-dnd',
  'react-cool-onclickoutside': 'react-cool-onclickoutside',
  'react-dom': 'react-dom',
  'react-draggable': 'react-draggable',
  'react-facebook-pixel': 'react-facebook-pixel',
  'react-ga4': 'react-ga4',
  'react-helmet': 'react-helmet',
  'react-hook-form': 'react-hook-form',
  'react-hot-toast': 'react-hot-toast',
  'react-loader-spinner': 'react-loader-spinner',
  'ts-pattern': 'ts-pattern',
  yup: 'yup',
  zustand: 'zustand',
};

export default defineConfig({
  build: {
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-router-dom', 'react-dom', 'react-router', 'react-router-dom'],
          ...renderChunks(dependencies),
        },
      },
    },
  },
  plugins: [react(), tsconfigPaths(), tailwindcss()],
  server: {
    host: 'localhost',
    port: 3000,
  },
  css: {
    devSourcemap: true,
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/vitest-setup.ts'],
  },
});
