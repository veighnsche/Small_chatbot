import { useLlamaChatTitle } from "../hooks/components/useLlamaChatTitle";
import "../styles/chatTitle.css";

export const ChatTitle = () => {
  const { title } = useLlamaChatTitle();

  return (
    <div className="title-container">
      <h1 className="title">{title}</h1>
    </div>
  );
};
