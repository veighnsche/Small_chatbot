import { useEffect } from "react";
import { useLlamaTree } from "../../../src";

export const SetterOfThings = () => {
  const { setChatParams } = useLlamaTree();
  useEffect(() => {
    setChatParams({
      functions: [
        {
          name: "fetchSection",
          description: "Fetches the introduction text",
          parameters: {
            type: "object",
            required: ["section"],
            properties: {
              section: {
                type: "string",
                enum: ["introduction"],
              },
            },
          },
        },
      ],
    });
  }, []);

  return null;
};