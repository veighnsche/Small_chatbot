import { createAsyncThunk } from "@reduxjs/toolkit";
import { LlamaThunkApiConfig } from "../stores/llamaStore";

export const llamaSseStop = createAsyncThunk<void, {
  sse_id: string,
}, LlamaThunkApiConfig>(
  "llamaChat/stop",
  async ({ sse_id }, {
    extra: { wretch },
  }) => {
    try {
      await wretch(`chat/stop/${sse_id}`).delete();
    } catch (err) {
      console.trace(err);
      throw new Error("Failed to stop");
    }
  },
);