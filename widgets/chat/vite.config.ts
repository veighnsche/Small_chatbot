import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [
    react(),
  ],
  define: {
    "process.env": process.env,
  },
  build: {
    lib: {
      entry: "src/index.tsx",
      name: "LlamaTreeChatWidget",
      fileName: (format) => `llama-tree-chat-widget.${format}.js`,
      formats: ["es"],
    },
  },
});
