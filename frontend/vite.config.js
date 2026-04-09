import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 3000,
    allowedHosts: [
      'localhost',
      '127.0.0.1',
      '.preview.emergentagent.com',
      '.preview.emergentcf.cloud'
    ],
    hmr: {
      // Disable HMR to prevent reconnection issues causing redirects
      overlay: false
    },
    watch: {
      // Reduce file watching frequency
      usePolling: false
    }
  }
})
