import { IChatWidgetElement } from "../../public/types/IChatWidgetElement";
import { LlamaQueue } from "./llamaQueue";

export interface LlamaTreeContextType {
  llamaTree: IChatWidgetElement | null;
  llamaQueue: LlamaQueue;
}