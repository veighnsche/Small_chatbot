import { useEffect } from "react";
import { LlamaFunction, LlamaFunctionCall } from "../types/llamaTypes";
import { useLlamaFunctionListener } from "./useLlamaFunctionListener";
import { useLlamaFunctionStream } from "./useLlamaFunctionStream";
import { useLlamaTree } from "./useLlamaTree";

export const useLlamaFunction = (
  functions: LlamaFunction[],
  selector: (functionCall: LlamaFunctionCall<any>) => any,
  stream?: true,
) => {
  const { setChatParams } = useLlamaTree();
  const slugs = functions.map((f) => f.name);

  // Calculate a digest and set as useEffect dependency
  const functionsDigest = JSON.stringify(slugs);

  useEffect(() => {
    console.log("adding functions", slugs)
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
      console.log("removing functions", slugs)
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
  }, [functionsDigest]);
  if (stream) {
    return useLlamaFunctionStream(slugs, selector);
  }
  return useLlamaFunctionListener(slugs, selector);
};