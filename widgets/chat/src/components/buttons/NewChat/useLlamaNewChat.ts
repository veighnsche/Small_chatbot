import { useLlamaDispatch } from "../../../stores/llamaStore.ts";
import { llamaOnMessagesSnapshot } from "../../../thunks/llamaOnMessagesSnapshot.ts";

export const useLlamaNewChat = () => {
  const dispatch = useLlamaDispatch();

  const handleNewChat = () => {
    dispatch(llamaOnMessagesSnapshot({}));
  };

  return {
    handleNewChat,
  };
};