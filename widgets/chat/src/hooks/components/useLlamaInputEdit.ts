import { ChangeEvent, useEffect, useRef, useState } from "react";
import { useLlamaDispatch } from "../../stores/llamaStore";
import { llamaSseEditMessage } from "../../thunks/llamaSseEditMessage";

export interface InputEditProps {
  content: string;
  parent_id: string;
  onCancel: () => void;
}

export const useLlamaInputEdit = ({ content, parent_id, onCancel }: InputEditProps) => {
  const dispatch = useLlamaDispatch();
  const [inputValue, setInputValue] = useState<string>(content);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textAreaRef.current) {
      textAreaRef.current.style.height = "auto"; // Reset the height to auto before setting the scrollHeight
      const newHeight = textAreaRef.current.scrollHeight;
      textAreaRef.current.style.height = `${newHeight}px`;
    }
  }, [inputValue]);

  const inputOnChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
  };

  const handleSend = async () => {
    await dispatch(llamaSseEditMessage({
      parent_id,
      newMessages: [{
        content: inputValue,
        role: "user",
      }],
    }));
  };

  return {
    inputValue,
    inputOnChange,
    onCancel,
    handleSend,
    textAreaRef,
  };
};