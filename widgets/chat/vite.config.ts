import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react({
    include: [/\.tsx?$/],
    babel: {
      plugins: ['styled-components'],
      babelrc: false,
      configFile: false,
    }
  })],
  define: {
    'process.env': process.env, // Only if necessary, and you understand the implications
  },
  build: {
    // Options for building a library
    lib: {
      entry: 'src/index.tsx', // The path to your web component file
      name: 'LlamaTreeChatWidget', // The global variable name in UMD builds
      // The file name for the output
      fileName: (format) => `llama-tree-chat-widget.${format}.js`
    },
    // Rollup options
    rollupOptions: {
      // Externalize dependencies that shouldn't be bundled
      // into your library
      external: ['react', 'react-dom'],
      output: {
        // Provide global variables to use in the UMD build for externalized deps
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM'
        }
      }
    }
  }
});
