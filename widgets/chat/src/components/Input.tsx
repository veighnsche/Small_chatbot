import styled from "styled-components";
import { useLlamaInput } from "../hooks/components/useLlamaInput";
import { Regenerate } from "./buttons/Regenerate";
import { ButtonPrimary } from "./utils/Button";

const InputWrapper = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 0.5rem;
  padding: 0.5rem;
  border-top: 1px solid #888;
  grid-area: input;
`;

const ChatInput = styled.textarea`
  flex-grow: 1;
  border: 1px solid #ccc;
  padding: 0.5rem;
  border-radius: 8px;
  resize: none;
  overflow: auto;
`;

export const Input = () => {
  const {
    inputValue,
    inputOnChange,
    handleInputOnKeyPress,
    handleSend,
    textAreaRef,
  } = useLlamaInput();

  return (
    <InputWrapper>
      <ChatInput
        ref={textAreaRef}
        rows={1}
        placeholder="Type a message..."
        value={inputValue}
        onChange={inputOnChange}
        onKeyDown={handleInputOnKeyPress}
      />
      <ButtonPrimary onClick={handleSend}>
        Send
      </ButtonPrimary>
      <Regenerate/>
    </InputWrapper>
  );
};
