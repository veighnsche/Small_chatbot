import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { User } from "firebase/auth";
import { DocumentReference } from "firebase/firestore";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { Middleware } from "redux";
import llamaChatParamsSlice, { LlamaChatParamsAction } from "../slices/llamaChatParamsSlice";
import llamaChatSlice, { LlamaChatAction } from "../slices/llamaChatSlice";
import llamaChatViewSlice, { LlamaChatViewAction } from "../slices/llamaChatViewSlice.ts";
import llamaHistorySlice, { LlamaHistoryAction } from "../slices/llamaHistorySlice";
import { Wretch } from "../utils/fetch";
import { actionEmitterMiddleware } from "./middlewares/actionEmitter.ts";


export interface LlamaStoreExtraArgument {
  user: User;
  userDocRef: DocumentReference;
  wretch: Wretch;
}

const rootReducer = combineReducers({
  llamaChat: llamaChatSlice,
  llamaChatParams: llamaChatParamsSlice,
  llamaChatView: llamaChatViewSlice,
  llamaHistory: llamaHistorySlice,
});

export const configureLlamaStore = (extraArgument: LlamaStoreExtraArgument) => configureStore({
  reducer: rootReducer,
  middleware(getDefaultMiddleware) {
    const defaultMiddleware = getDefaultMiddleware({
      thunk: {
        extraArgument,
      },
    });

    return defaultMiddleware.concat([
      actionEmitterMiddleware,
    ]);
  },
});

type llamaStore = ReturnType<typeof configureLlamaStore>;
export type RootLlamaState = ReturnType<llamaStore["getState"]>;
export type LlamaDispatch = llamaStore["dispatch"];
export type LlamaActions = LlamaChatAction | LlamaHistoryAction | LlamaChatParamsAction | LlamaChatViewAction;
export type LlamaMiddleware = Middleware

export interface LlamaThunkApiConfig {
  dispatch: LlamaDispatch,
  state: RootLlamaState,
  extra: LlamaStoreExtraArgument,
}

export const useLlamaSelector: TypedUseSelectorHook<RootLlamaState> = useSelector;
export const useLlamaDispatch = () => useDispatch<LlamaDispatch>();
