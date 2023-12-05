import express, { Application } from "express";
import path from "path";
import Terser from "terser";

export function setupWidgets(app: Application) {
  const widgetPath = path.join(__dirname, "../../../../widgets/chat/dist");
  app.use(express.static(widgetPath));

  app.get("/module", async (req, res) => {
    const serverUrl = `${req.protocol}://${req.get("host")}`;

    const moduleJs = await generateWidgetScript(serverUrl);
    res.setHeader("Content-Type", "text/javascript");
    res.send(moduleJs);
  });
}

async function generateWidgetScript(serverUrl: string) {
  // language=JavaScript
  const widgetSetup = `
    async function createWidgetScript(url) {
      const script = document.createElement('script');
      script.type = 'module';
      script.src = url + '/llama-tree-chat-widget.es.js';

      script.onload = () => {
        const llamaTree = document.createElement('llama-tree-chat-widget');
        document.body.appendChild(llamaTree);
        llamaTree.setUrl(url);
      };

      script.onerror = (e) => {
       throw new Error('Error loading Llama Tree chat widget script: ' + e);
      };

      document.head.appendChild(script);
    }

    async function init() {
      if (document.readyState === 'loading') {
        await new Promise(resolve => document.addEventListener('DOMContentLoaded', resolve));
      }
      await createWidgetScript('${serverUrl}');
    }

    init().catch(e => console.error('Error initializing Llama Tree chat widget:', e));
  `;

  const result = await Terser.minify(widgetSetup);
  return result.code;
}
