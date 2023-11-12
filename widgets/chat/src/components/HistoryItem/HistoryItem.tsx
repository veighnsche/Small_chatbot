import Check from "../../assets/check.svg";
import Cross from "../../assets/cross.svg";
import Delete from "../../assets/delete.svg";
import EditTitle from "../../assets/edit-title.svg";
import { IconButton } from "../utils/IconButton/IconButton.tsx";
import "./HistoryItem.css";
import { LlamaHistoryItemProps, useLlamaHistoryItem } from "./useLlamaHistoryItem.ts";

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
          <IconButton onClick={onEditCheck} title="Save">
            <img src={Check} alt="check icon"/>
          </IconButton>
          <IconButton onClick={onEditCancel} title="Cancel">
            <img src={Cross} alt="cross icon"/>
          </IconButton>
        </div>
      </div>
    );
  }

  if (selected) {
    return (
      <div className="history-item-wrapper">
        <p className="history-title" title={title}>{title}</p>
        <div className="action">
          <IconButton onClick={onStartEdit} title="Edit">
            <img src={EditTitle} alt="edit icon"/>
          </IconButton>
          <IconButton onClick={onDelete} title="Delete">
            <img src={Delete} alt="delete icon"/>
          </IconButton>
        </div>
      </div>
    );
  }

  return (
    <button className="history-item-button" onClick={onHistorySelect} title={title}>
      <p className="history-title">{title}</p>
    </button>
  );
};
