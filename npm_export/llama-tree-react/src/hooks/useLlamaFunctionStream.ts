import { useEffect, useMemo, useState } from "react";
import { LlamaFunctionCall } from "../types/llamaTypes";
import { useLlamaFunctionListener } from "./useLlamaFunctionListener";
import { useLlamaTree } from "./useLlamaTree";


/**
 * A hook that listens to Llama function calls and returns a stream value based on the selected function and arguments.
 * TODO: This does not work if the llamaTree is a Proxy. Race condition?
 */
export const useLlamaFunctionStream = <ArgumentsType extends Record<string, any>>(
  functionNames: string | string[],
  selector: (functionCall: LlamaFunctionCall<ArgumentsType>) => any,
) => {
  const [streamValue, setStreamValue] = useState<any>(null);
  const llamaTree = useLlamaTree();

  const functionNamesArray = useMemo(() => {
    return Array.isArray(functionNames) ? functionNames : [functionNames];
  }, [functionNames]);

  const functionNamesDigest = JSON.stringify(functionNamesArray);

  useEffect(() => {
    console.log("adding functions", functionNamesArray)
    const subs = functionNamesArray.map((functionName) => {
      return llamaTree.onFunctionArgumentsStream(functionName, (args) => {
        const selected = selector({
          name: functionName,
          arguments: args as ArgumentsType,
        });
        console.log("selected", selected)
        if (selected) {
          setStreamValue(selected);
        }
      });
    });

    return () => {
      subs.forEach((sub) => {
        sub();
      });
    };
  }, [functionNamesDigest]);

  const llamaFunctionListener = useLlamaFunctionListener(functionNames, selector);

  useEffect(() => {
    if (llamaFunctionListener) {
      setStreamValue(llamaFunctionListener);
    }
  }, [llamaFunctionListener]);

  return streamValue;
};