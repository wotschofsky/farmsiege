import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    assetsInlineLimit: 150 * 1024
  }
});
