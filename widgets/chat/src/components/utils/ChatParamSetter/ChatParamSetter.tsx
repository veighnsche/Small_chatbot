import { useEffect } from "react";
import { llamaEventBus } from "../../../services/llamaEventBus.ts";
import { editLlamaChatParams, LlamaChatParams } from "../../../slices/llamaChatParamsSlice.ts";
import { useLlamaDispatch, useLlamaSelector } from "../../../stores/llamaStore.ts";

export const ChatParamSetter = () => {
  const dispatch = useLlamaDispatch();
  const chatParams = useLlamaSelector((state) => state.llamaChatParams);

  useEffect(() => {
    const sub = llamaEventBus.on("chat-params", (params: Partial<LlamaChatParams> | ((params: LlamaChatParams) => Partial<LlamaChatParams>)) => {
      const newParams = typeof params === "function" ? params(chatParams) : params;
      dispatch(editLlamaChatParams(newParams));
    });

    return () => {
      sub();
    };
  }, [chatParams]);

  return null;
};