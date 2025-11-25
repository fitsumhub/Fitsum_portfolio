import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
    include: ['react', 'react-dom', 'react-router-dom'],
    // Force pre-bundling for faster dev server
    force: false,
    // Optimize dependencies
    esbuildOptions: {
      target: 'esnext',
    },
  },
  build: {
    // Enable code splitting and chunk optimization
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Separate vendor chunks for better caching
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom')) {
              return 'vendor-react';
            }
            if (id.includes('react-router')) {
              return 'vendor-router';
            }
            if (id.includes('lucide-react')) {
              return 'vendor-icons';
            }
            // Other node_modules
            return 'vendor';
          }
          // Admin components in separate chunk
          if (id.includes('Admin')) {
            return 'admin';
          }
        },
        // Optimize chunk file names
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
      },
    },
    // Optimize chunk size - reduced for better performance
    chunkSizeWarningLimit: 500,
    // Enable minification (using esbuild which is faster and included by default)
    minify: 'esbuild',
    // Enable source maps in development only
    sourcemap: false,
    // Optimize assets - increased inline limit for better caching
    assetsInlineLimit: 8192, // Inline small assets up to 8KB
    cssCodeSplit: true,
    // Target modern browsers for smaller bundles
    target: 'esnext',
    // Reduce build output size
    reportCompressedSize: false,
  },
  // Server configuration
  server: {
    // Watch configuration to prevent resource exhaustion
    watch: {
      // Exclude unnecessary directories from file watching
      ignored: [
        '**/node_modules/**',
        '**/server/**',
        '**/.git/**',
        '**/dist/**',
        '**/build/**',
        '**/coverage/**',
        '**/*.log',
        '**/package-lock.json'
      ],
      // Use polling as fallback (helps on Windows)
      usePolling: false,
      // Reduce file system events
      interval: 1000,
      binaryInterval: 3000
    },
    // Limit concurrent connections
    hmr: {
      overlay: true,
      protocol: 'ws',
      host: 'localhost'
    },
    // File system access
    fs: {
      // Restrict file system access to project root only
      strict: true,
      allow: ['.']
    }
  },
  // Pre-bundle optimization
  esbuild: {
    legalComments: 'none',
    treeShaking: true,
  },
});
