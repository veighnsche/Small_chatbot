import { MutableRefObject } from "react";
import { IChatWidgetElement } from "../../public/types/IChatWidgetElement";

export type LlamaQueue = MutableRefObject<LlamaQueueAction[]>

export interface LlamaQueueAction {
  method: keyof IChatWidgetElement;
  args: any[];
}