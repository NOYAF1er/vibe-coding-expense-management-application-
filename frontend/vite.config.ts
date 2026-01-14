import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@shared': path.resolve(__dirname, '../shared/src'),
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: [
        'src/**/*.{ts,tsx}',
      ],
      exclude: [
        'node_modules/',
        'src/test/',
        '**/*.spec.ts',
        '**/*.test.tsx',
        '**/main.tsx',
        '**/App.tsx',
        '**/AppRouter.tsx',
        '**/*.config.js',
        '**/*.config.ts',
        '**/pages/HelloPage.tsx',
        '**/pages/ExpenseReportsPage.tsx',
        '**/pages/NewReportPage.tsx',
        '**/pages/ExpenseReportDetailsPage.tsx',
        '**/pages/ExpenseReportDetailsDemoPage.tsx',
        '**/hooks/**',
      ],
      thresholds: {
        branches: 80,
        functions: 80,
        lines: 80,
        statements: 80,
      },
    },
  },
});
