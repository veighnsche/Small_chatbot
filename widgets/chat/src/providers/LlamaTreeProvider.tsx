import { ReactNode } from "react";
import { Provider as ReduxProvider } from "react-redux";
import type { configureLlamaStore } from "../stores/llamaStore";

export interface LlamaTreeProps {
  children: ReactNode;
  llamaStore: ReturnType<typeof configureLlamaStore>;
}

export function LlamaTreeProvider({ llamaStore, children }: LlamaTreeProps) {
  return (
    <ReduxProvider store={llamaStore}>
      {children}
    </ReduxProvider>
  );
}
