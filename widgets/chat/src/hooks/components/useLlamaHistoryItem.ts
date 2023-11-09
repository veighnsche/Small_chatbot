import { ChangeEvent, useState } from "react";
import { useLlamaDispatch } from "../../stores/llamaStore";
import { deleteConversationApi } from "../../thunks/llamaApiDeleteConversation";
import { editTitleApi } from "../../thunks/llamaApiEditTitle";
import { llamaOnMessagesSnapshot } from "../../thunks/llamaOnMessagesSnapshot";
import { LlamaChat } from "../../types/LlamaChat";

export interface LlamaHistoryItemProps extends LlamaChat {
  selected: boolean;
}

export const useLlamaHistoryItem = ({ id, title, selected }: LlamaHistoryItemProps) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editInputValue, setEditInputValue] = useState<string>(title);

  const dispatch = useLlamaDispatch();

  const onEditValueChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEditInputValue(e.target.value);
  };

  const onHistorySelect = () => {
    dispatch(llamaOnMessagesSnapshot({ chatId: id }));
  };

  const onEditCheck = () => {
    dispatch(editTitleApi({ title: editInputValue }));
    setIsEditing(false);
  };

  const onEditCancel = () => {
    setEditInputValue(title);
    setIsEditing(false);
  };

  const onStartEdit = () => {
    setIsEditing(true);
  };

  const onDelete = () => {
    dispatch(deleteConversationApi());
  };

  return {
    selected,
    title,
    isEditing: selected && isEditing,
    editInputValue,
    onEditValueChange,
    onHistorySelect,
    onEditCheck,
    onEditCancel,
    onStartEdit,
    onDelete,
  };
};