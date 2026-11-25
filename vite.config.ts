import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import mkcert from 'vite-plugin-mkcert';
import fs from 'fs';
import path from 'path';

const keyPath = path.resolve(__dirname, 'cert.key');
const certPath = path.resolve(__dirname, 'cert.crt');
const hasCustomCerts = fs.existsSync(keyPath) && fs.existsSync(certPath);

export default defineConfig(({ command }) => ({
  base: '/wifi-bandwidth-frontend/',
  plugins: [
    react(),
    ...(command === 'serve' && !hasCustomCerts ? [mkcert()] : []),
  ],
  server: {
    port: 3000,
    host: true,
    ...(hasCustomCerts
      ? {
          https: {
            key: fs.readFileSync(keyPath),
            cert: fs.readFileSync(certPath),
          },
        }
      : {}),
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
      '/media': {
        target: 'http://localhost:9000',
        changeOrigin: true,
      },
      '/minio': {
        target: 'http://localhost:9000',
        changeOrigin: true,
        rewrite: (pathStr) => pathStr.replace(/^\/minio/, ''),
      },
    },
  },
}));
