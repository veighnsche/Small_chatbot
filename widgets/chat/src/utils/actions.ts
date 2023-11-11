import { ActionCreator } from "@reduxjs/toolkit";
import { LlamaActions } from "../stores/llamaStore.ts";

export function getTypeName(action: ActionCreator<LlamaActions>) {
  return action().type;
}