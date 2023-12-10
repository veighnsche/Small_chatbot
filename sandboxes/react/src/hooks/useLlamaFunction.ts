import { useEffect } from "react";
import { LlamaFunction, LlamaFunctionCall } from "../types/llamaTypes";
import { useLlamaFunctionListener } from "./useLlamaFunctionListener";
import { useLlamaTree } from "./useLlamaTree";

export const useLlamaFunction = (
  functions: LlamaFunction[],
  selector: (functionCall: LlamaFunctionCall<any>) => any,
) => {
  const { setChatParams } = useLlamaTree();
  const slugs = functions.map((f) => f.name);

  useEffect(() => {
    setChatParams(oldParams => {
      const oldFunction = oldParams.functions;
      if (!oldFunction) {
        return {
          ...oldParams,
          functions,
        };
      }
      return {
        ...oldParams,
        functions: [...oldFunction, ...functions],
      };
    });

    return () => {
      setChatParams(oldParams => {
        const oldFunction = oldParams.functions;
        if (!oldFunction) {
          return oldParams;
        }
        return {
          ...oldParams,
          functions: oldFunction.filter((f) => !slugs.includes(f.name)),
        };
      });
    };
  }, [functions]);

  return useLlamaFunctionListener(slugs, selector);
};