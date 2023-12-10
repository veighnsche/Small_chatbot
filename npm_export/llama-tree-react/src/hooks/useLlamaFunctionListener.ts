import { useEffect, useMemo, useState } from "react";
import { IChatWidgetElement } from "../types/IChatWidgetElement";
import { LlamaFunctionCall } from "../types/llamaTypes";
import { useLlamaTree } from "./useLlamaTree";

export const useLlamaFunctionListener = <ArgumentsType extends Record<string, any>>(
  functionNames: string | string[],
  selector: (functionCall: LlamaFunctionCall<ArgumentsType>, llamaTree: IChatWidgetElement) => any,
) => {
  const [value, setValue] = useState<any>(null);
  const llamaTree = useLlamaTree();

  const functionNamesArray = useMemo(() => {
    return Array.isArray(functionNames) ? functionNames : [functionNames];
  }, [functionNames]);

  const functionNamesDigest = JSON.stringify(functionNamesArray);

  useEffect(() => {
    const unsubscribe = llamaTree.onFunctionCall((functionCall: any) => {
      if (functionNamesArray.includes(functionCall.name)) {
        const unparsedArguments = functionCall.arguments;
        const parsedArguments: ArgumentsType = JSON.parse(unparsedArguments);
        const parsedFunctionCall: LlamaFunctionCall<ArgumentsType> = {
          ...functionCall,
          arguments: parsedArguments,
        };
        const selected = selector(parsedFunctionCall, llamaTree);
        if (selected) {
          setValue(selected);
        }
      }
    });

    return () => {
      if (typeof unsubscribe === "function") {
        unsubscribe();
      }
    };
  }, [llamaTree, functionNamesDigest, selector]);


  return value;
};

