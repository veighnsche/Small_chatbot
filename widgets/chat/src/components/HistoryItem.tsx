import styled, { css } from "styled-components";
import { LlamaHistoryItemProps, useLlamaHistoryItem } from "../hooks/components/useLlamaHistoryItem";
import { IconButton } from "./utils/IconButton";

const HistoryItemWrapper = styled.div<{ $selected: boolean }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 1rem;
  border-bottom: 1px solid #888;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #f5f5f5;
  }

  ${({ $selected }) =>
          $selected &&
          css`
            background-color: #ddd;
          `}
`;

const HistoryItemButton = styled.button<{
  $selected: boolean
}>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 1rem;
  border: 1px solid #888;
  cursor: pointer;
  transition: background-color 0.3s;
  background-color: transparent;
  border-radius: 0; // Reset for consistent appearance
  width: 100%; // To take up full width of container
  text-align: left; // Align text to the left

  &:hover,
  &:focus {
    background-color: #f5f5f5;
    outline: none; // Remove default focus outline
  }

  ${({ $selected }) =>
          $selected &&
          css`
            background-color: #ddd;
          `}
`;

const HistoryTitle = styled.p`
  font-weight: bold;
  color: #333;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const Action = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const EditInput = styled.input.attrs({ type: "text" })`
  border: none;
  border-bottom: 1px solid #888;
  font-size: 1rem;
  font-weight: bold;
  color: #333;
  width: 100%;
`;


export const HistoryItem = (props: LlamaHistoryItemProps) => {
  const {
    selected,
    title,
    isEditing,
    editInputValue,
    onEditValueChange,
    onEditCheck,
    onEditCancel,
    onStartEdit,
    onDelete,
    onHistorySelect,
  } = useLlamaHistoryItem(props);

  if (isEditing) {
    return (
      <HistoryItemWrapper $selected={selected}>
        <EditInput value={editInputValue} onChange={onEditValueChange}/>
        <Action>
          <IconButton onClick={onEditCheck}>
            <img src="http://localhost:3001/icons/check.svg" alt="check icon"/>
          </IconButton>
          <IconButton onClick={onEditCancel}>
            <img src="http://localhost:3001/icons/cross.svg" alt="cross icon"/>
          </IconButton>
        </Action>
      </HistoryItemWrapper>
    );
  }

  if (selected) {
    return (
      <HistoryItemWrapper $selected={selected}>
        <HistoryTitle>{title}</HistoryTitle>
        <Action>
          <IconButton onClick={onStartEdit}>
            <img src="http://localhost:3001/icons/edit_title.svg" alt="edit icon"/>
          </IconButton>
          <IconButton onClick={onDelete}>
            <img src="http://localhost:3001/icons/delete.svg" alt="delete icon"/>
          </IconButton>
        </Action>
      </HistoryItemWrapper>
    );
  }

  return (
    <HistoryItemButton $selected={selected} onClick={onHistorySelect}>
      <HistoryTitle>{title}</HistoryTitle>
    </HistoryItemButton>
  );
};
