import { InputEditProps, useLlamaInputEdit } from "./useLlamaInputEdit.ts";
import { ButtonPrimary, ButtonSecondary } from "../utils/Button/Button.tsx";
import './InputEdit.css';

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
