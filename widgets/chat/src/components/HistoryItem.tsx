import { LlamaHistoryItemProps, useLlamaHistoryItem } from "../hooks/components/useLlamaHistoryItem";
import "../styles/HistoryItem.css";
import { IconButton } from "./utils/IconButton";

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
      <div className="history-item-wrapper">
        <input className="edit-input" value={editInputValue} onChange={onEditValueChange}/>
        <div className="action">
          <IconButton onClick={onEditCheck}>
            <img src="http://localhost:3001/icons/check.svg" alt="check icon"/>
          </IconButton>
          <IconButton onClick={onEditCancel}>
            <img src="http://localhost:3001/icons/cross.svg" alt="cross icon"/>
          </IconButton>
        </div>
      </div>
    );
  }

  if (selected) {
    return (
      <div className="history-item-wrapper">
        <p className="history-title">{title}</p>
        <div className="action">
          <IconButton onClick={onStartEdit}>
            <img src="http://localhost:3001/icons/edit_title.svg" alt="edit icon"/>
          </IconButton>
          <IconButton onClick={onDelete}>
            <img src="http://localhost:3001/icons/delete.svg" alt="delete icon"/>
          </IconButton>
        </div>
      </div>
    );
  }

  return (
    <button className="history-item-button" onClick={onHistorySelect}>
      <p className="history-title">{title}</p>
    </button>
  );
};
