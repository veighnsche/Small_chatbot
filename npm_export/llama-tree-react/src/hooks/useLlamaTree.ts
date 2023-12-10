import { useContext } from "react";
import { _useLlamaTreeProxy } from "./_useLlamaTreeProxy";
import { LlamaTreeContext } from "../providers/LlamaProvider";
import { IChatWidgetElement } from "../types/IChatWidgetElement";

export const useLlamaTree = (): IChatWidgetElement => {
  const { llamaTree } = useContext(LlamaTreeContext);
  const llamaTreeProxy = _useLlamaTreeProxy();

  return llamaTree || llamaTreeProxy;
};