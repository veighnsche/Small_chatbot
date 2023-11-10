import { useLlamaInput } from "../hooks/components/useLlamaInput";
import { Regenerate } from "./buttons/Regenerate";
import { ButtonPrimary } from "./utils/Button";
import '../styles/Input.css';

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
