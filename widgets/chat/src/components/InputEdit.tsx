import { InputEditProps, useLlamaInputEdit } from "../hooks/components/useLlamaInputEdit";
import { ButtonPrimary, ButtonSecondary } from "./utils/Button";
import '../styles/InputEdit.css';

export const InputEdit = (props: InputEditProps) => {
  const {
    inputValue,
    inputOnChange,
    onCancel,
    handleSend,
    textAreaRef,
  } = useLlamaInputEdit(props);

  return (
    <>
      <textarea
        className="input-edit"
        ref={textAreaRef}
        value={inputValue}
        onChange={inputOnChange}
      />
      <div className="edit-actions">
        <ButtonSecondary onClick={onCancel}>
          Cancel
        </ButtonSecondary>
        <ButtonPrimary onClick={handleSend}>
          Save
        </ButtonPrimary>
      </div>
    </>
  );
};
