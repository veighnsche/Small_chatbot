import { IChatWidgetElement } from "./IChatWidgetElement";
import { _LlamaQueue } from "./_LlamaQueue";

export interface _LlamaTreeContextType {
  llamaTree: IChatWidgetElement | null;
  llamaQueue: _LlamaQueue;
}