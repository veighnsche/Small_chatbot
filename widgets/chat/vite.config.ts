import react from "@vitejs/plugin-react";
import * as fs from "fs";
import { defineConfig } from "vite";
import path from "path";

export default defineConfig(({ mode }) => {
  console.log("mode", mode);

  const config = {
    plugins: [react()],
  };

  if (mode === "production") {
    return {
      ...config,
      define: {
        "process.env": {
          NODE_ENV: "\"production\"",
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
    const projectRoot = path.resolve(__dirname, '../../');
    const vanillaPublicDir = path.resolve(projectRoot, 'sandboxes/vanilla');

    return {
      ...config,
      define: {
        "process.env": {
          NODE_ENV: "\"development\"",
        },
      },
      publicDir: vanillaPublicDir,
    };
  }
});
