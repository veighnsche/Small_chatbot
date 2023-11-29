import { ChangeEvent, useState } from "react";
import { useLlamaDispatch } from "../../stores/llamaStore.ts";
import { llamaApiDeleteConversation } from "../../thunks/llamaApiDeleteConversation.ts";
import { llamaApiEditTitle } from "../../thunks/llamaApiEditTitle.ts";
import { llamaOnMessagesSnapshot } from "../../thunks/llamaOnMessagesSnapshot.ts";
import { LlamaChat } from "../../types/LlamaChat.ts";

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
    dispatch(llamaOnMessagesSnapshot({ chat_id: id }));
  };

  const onEditCheck = () => {
    dispatch(llamaApiEditTitle({ title: editInputValue }));
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
    dispatch(llamaApiDeleteConversation());
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