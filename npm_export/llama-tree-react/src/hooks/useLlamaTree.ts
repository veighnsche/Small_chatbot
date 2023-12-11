import { useContext } from "react";
import { LlamaTreeContext } from "../context/LlamaTreeContext";
import { _useLlamaTreeProxy } from "./_useLlamaTreeProxy";
import { IChatWidgetElement } from "../types/IChatWidgetElement";

export const useLlamaTree = (): IChatWidgetElement => {
  const { llamaTree } = useContext(LlamaTreeContext);
  const llamaTreeProxy = _useLlamaTreeProxy();

  return llamaTree || llamaTreeProxy;
};