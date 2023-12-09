import { useContext } from "react";
import { _useLlamaProxy } from "./_useLlamaProxy";
import { LlamaTreeContext } from "../providers/LlamaProvider";
import { IChatWidgetElement } from "../types/IChatWidgetElement";

export const useLlamaTree = (): IChatWidgetElement => {
  const { llamaTree } = useContext(LlamaTreeContext);
  const llamaTreeProxy = _useLlamaProxy();

  return llamaTree || llamaTreeProxy;
};