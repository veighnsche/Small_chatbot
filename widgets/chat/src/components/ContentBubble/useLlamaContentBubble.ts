import { useState } from "react";

export const useLlamaContentBubble = {
  user: () => {
    const [isEditing, setIsEditing] = useState<boolean>(false);

    const onStartEdit = () => {
      setIsEditing(true);
    };

    const onCancelEdit = () => {
      setIsEditing(false);
    }

    return {
      isEditing,
      onStartEdit,
      onCancelEdit,
    }
  }
}