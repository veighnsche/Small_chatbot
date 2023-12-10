import * as React from "react";
import { useLlamaFunction, useLlamaFunctionListener } from "../../../src";

export const TextContainer = () => {
  const text = "Dynamic and results-driven marketing professional with over five years of comprehensive experience in digital marketing, brand management, and strategic planning. Adept at leveraging data-driven strategies to increase market share and boost brand loyalty. Proven track record in leading cross-functional teams to exceed business objectives while fostering innovative thinking. Seeking a challenging role in a forward-thinking company where I can contribute my expertise in marketing analytics and customer engagement to drive business growth and success.";

  useLlamaFunctionListener<{
    section: string;
  }>("fetchSection", async (functionCall, llamaTree) => {
    if (functionCall.arguments.section === "introduction") {
      console.log("fetching introduction text", { functionCall, llamaTree });
      await llamaTree
        .loadSystemMessage({
          title: "introduction text",
          content: text,
        })
        .sendLlamaMessage(
          "Please improve the introduction text.",
        );
    }
  });

  const llamaText = useLlamaFunction(
    [
      {
        name: "setSection",
        description: "Sets the introduction text",
        parameters: {
          type: "object",
          required: ["text"],
          properties: {
            text: {
              type: "string",
            },
          },
        },
      },
    ],
    (functionCall) => {
      console.log("setting introduction text", { functionCall });
      return functionCall.arguments.text;
    },
  );

  return (
    <>
      <p style={{
        color: "green",
        backgroundColor: "white",
        padding: "10px",
        width: "33%",
      }}>
        {llamaText}
      </p>
      <p style={{
        backgroundColor: "white",
        padding: "10px",
        width: "33%",
      }}>
        {text}
      </p>
    </>
  );
};