import { createContext } from "react";
import { _LlamaTreeContextType } from "../types/_LlamaTreeContextType";

export const LlamaTreeContext = createContext<_LlamaTreeContextType>({} as _LlamaTreeContextType);
