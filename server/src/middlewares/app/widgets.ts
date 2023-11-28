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

function generateWidgetScript(serverUrl: string) {
	// language=JavaScript
	const widgetSetup = `
    const llamaTree = createChatWidget();
    document.body.appendChild(llamaTree);

    const llamaScript = createWidgetScript('${serverUrl}');
    document.head.appendChild(llamaScript);

    function createChatWidget() {
      return document.createElement('llama-tree-chat-widget');
    }

    function createWidgetScript(url) {
      const script = document.createElement('script');
      script.type = 'module';
      script.src = url + '/llama-tree-chat-widget.es.js';
      script.onload = () => llamaTree.setUrl(url);
      return script;
    }
  `;

	return Terser.minify(widgetSetup).then((result) => result.code);
}
