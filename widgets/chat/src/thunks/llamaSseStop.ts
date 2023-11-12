import { createAsyncThunk } from "@reduxjs/toolkit";
import { LlamaThunkApiConfig } from "../stores/llamaStore";

export const llamaSseStop = createAsyncThunk<void, {
  sseId: string,
}, LlamaThunkApiConfig>(
  "llamaChat/stop",
  async ({ sseId }, {
    extra: { wretch },
  }) => {
    try {
      await wretch(`chat/stop/${sseId}`).delete();
    } catch (err) {
      console.error(err);
      throw new Error("Failed to stop");
    }
  },
);