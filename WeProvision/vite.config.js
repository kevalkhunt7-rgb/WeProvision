import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Custom plugin to rewrite lowercase /3dmodels/ requests to /3dModels/
const modelPathRewritePlugin = () => ({
  name: 'model-path-rewrite',
  configureServer(server) {
    server.middlewares.use((req, res, next) => {
      if (req.url && req.url.startsWith('/3dmodels/')) {
        req.url = req.url.replace('/3dmodels/', '/3dModels/');
      }
      next();
    });
  },
});

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), modelPathRewritePlugin()],
})

