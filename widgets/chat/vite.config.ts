import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig(({ mode }) => {
  console.log('mode', mode)

  const config = {
    plugins: [react()],
  }

  if (mode === 'production') {
    return {
      ...config,
      define: {
        "process.env": {
          NODE_ENV: '"production"',
        },
      },
      build: {
        lib: {
          entry: "src/index.tsx",
          name: "LlamaTreeChatWidget",
          fileName: (format) => `llama-tree-chat-widget.${format}.js`,
          formats: ["es"],
        },
      },
    };
  } else {
    return {
      ...config,
      publicDir: "sandbox/vanilla",
    };
  }
});
