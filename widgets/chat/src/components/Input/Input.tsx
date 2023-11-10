import { useLlamaInput } from "./useLlamaInput.ts";
import { Regenerate } from "../buttons/Regenerate/Regenerate.tsx";
import { ButtonPrimary } from "../utils/Button/Button.tsx";
import './Input.css';

export const Input = () => {
  const {
    inputValue,
    inputOnChange,
    handleInputOnKeyPress,
    handleSend,
    textAreaRef,
  } = useLlamaInput();

  return (
    <div className="chat-input-wrapper">
      <textarea
        className="chat-input"
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
    </div>
  );
};
