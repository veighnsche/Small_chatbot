import { LlamaGuard } from "../decorators/LlamaGuard";
import { connectionsEventBus } from "../services/eventBus";
import { SseLocals } from "../types/api/locals";
import { LlamaReq, LlamaReqP, LlamaRes } from "../types/api/middleware";
import { Sse_idParams } from "../types/api/params";
import { createEventData } from "../utils/stream";
import { generateUniqueID } from "../utils/uid";

class SSEMiddleware {
  @LlamaGuard()
  static initialize(_: LlamaReq, res: LlamaRes<SseLocals>): void {
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.flushHeaders();

    const id = generateUniqueID();
    res.write(`data: ${JSON.stringify({ sse_id: id })}\n\n`);

    connectionsEventBus.on(id, () => {
      connectionsEventBus.offAll(id);
      res.write(`data: ${JSON.stringify({ cleanup: true })}\n\n`);
      res.write(`event: CLOSE\ndata: ${createEventData("USER STOP", {})}\n\n`);
      res.end();
    });

    res.locals.sse = {
      id,
      initialized: true,
      finalized: false,
    };
  }

  @LlamaGuard("sse_id")
  static stop(req: LlamaReqP<Sse_idParams>): void {
    const id = req.params.sse_id;
    connectionsEventBus.emit(id);
  }

  @LlamaGuard("sse")
  static finalize(_: LlamaReq, res: LlamaRes<SseLocals>): void {
    connectionsEventBus.offAll(res.locals.sse.id);
    res.write(`data: ${JSON.stringify({ cleanup: true })}\n\n`);
    res.end();

    res.locals.sse.initialized = false;
    res.locals.sse.finalized = true;
  }
}


export default {
  initialize: SSEMiddleware.initialize,
  stop: SSEMiddleware.stop,
  finalize: SSEMiddleware.finalize,
};