import * as React from "react";
import { useLlamaFunction, useLlamaFunctionListener } from "../../../src";

export const TextContainer = () => {
  const text = "Hi, I’m new to the job market and looking for my first real job. I studied business in school and did pretty well. I like working with people and am good at using computers. I worked on some group projects in school and did a part-time job at a local store. I’m excited to start working and learn new things. I’m hardworking and want to do a job where I can help and be part of a team.";

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