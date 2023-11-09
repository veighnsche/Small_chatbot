import * as React from "react";
import styled from "styled-components";
import { InputEditProps, useLlamaInputEdit } from "../hooks/components/useLlamaInputEdit";
import { ButtonPrimary, ButtonSecondary } from "./utils/Button";

const StyledTextArea = styled.textarea`
  width: 100%;
  font-size: 1rem;
  border: none;
  outline: none;
  padding: 0;
  margin: 0;
  resize: none;
  background-color: transparent;
  overflow: hidden;
  white-space: pre-wrap;
  font-family: inherit;
`;

const EditActions = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 0.5rem;
  gap: 0.5rem;
`;


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
      <StyledTextArea
        ref={textAreaRef}
        value={inputValue}
        onChange={inputOnChange}
      />
      <EditActions>
        <ButtonSecondary onClick={onCancel}>
          Cancel
        </ButtonSecondary>
        <ButtonPrimary onClick={handleSend}>
          Save
        </ButtonPrimary>
      </EditActions>
    </>
  );
};