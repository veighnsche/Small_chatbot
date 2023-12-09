import { MutableRefObject } from "react";
import { IChatWidgetElement } from "./IChatWidgetElement";

export type _LlamaQueue = MutableRefObject<_LlamaQueueAction[]>

export interface _LlamaQueueAction {
  method: keyof IChatWidgetElement;
  args: any[];
}