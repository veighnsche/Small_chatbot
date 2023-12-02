import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig(({ mode }) => {
  console.log('mode', mode)

  const config = {
    plugins: [react()],
    define: {
      "process.env": process.env,
    },
  }

  if (mode === 'production') {
    return {
      ...config,
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
