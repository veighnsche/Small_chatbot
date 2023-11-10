import { configureStore } from "@reduxjs/toolkit";
import { User } from "firebase/auth";
import { DocumentReference } from "firebase/firestore";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import llamaChatSlice, { LlamaChatAction } from "../slices/llamaChatSlice";
import llamaHistorySlice, { LlamaHistoryAction } from "../slices/llamaHistorySlice";
import { Wretch } from "../utils/fetch";


export interface LlamaStoreExtraArgument {
  user: User;
  userDocRef: DocumentReference;
  wretch: Wretch;
}

export const configureLlamaStore = (extraArgument: LlamaStoreExtraArgument) => configureStore({
  reducer: {
    llamaChat: llamaChatSlice,
    llamaHistory: llamaHistorySlice,
  },
  middleware(getDefaultMiddleware) {
    return getDefaultMiddleware({
      thunk: {
        extraArgument,
      },
    });
  },
});

type llamaStore = ReturnType<typeof configureLlamaStore>;
export type RootLlamaState = ReturnType<llamaStore["getState"]>;
export type LlamaDispatch = llamaStore["dispatch"];
export type LlamaActions = LlamaChatAction | LlamaHistoryAction;

export interface LlamaThunkApiConfig {
  dispatch: LlamaDispatch,
  state: RootLlamaState,
  extra: LlamaStoreExtraArgument,
}

export const useLlamaSelector: TypedUseSelectorHook<RootLlamaState> = useSelector;
export const useLlamaDispatch = () => useDispatch<LlamaDispatch>();
