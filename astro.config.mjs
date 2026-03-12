import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://citemaps.org',
  outDir: './dist',
  build: {
    format: 'file'  // /about.html not /about/index.html — matches current URL structure
  }
});
