import { useLlamaDispatch } from "../../../stores/llamaStore";
import { llamaOnMessagesSnapshot } from "../../../thunks/llamaOnMessagesSnapshot";

export const useLlamaNewChat = () => {
  const dispatch = useLlamaDispatch();

  const handleNewChat = () => {
    dispatch(llamaOnMessagesSnapshot({}));
  };

  return {
    handleNewChat,
  };
};