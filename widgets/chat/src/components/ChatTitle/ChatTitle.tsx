import { useLlamaChatTitle } from "./useLlamaChatTitle.ts";
import "./ChatTitle.css";
import { IconButton } from "../utils/IconButton/IconButton.tsx";

export const ChatTitle = () => {
  const { title } = useLlamaChatTitle();

  /**
   * TODO: Place into useLlamaChatTitle
   */

  return (
    <div className="title-container">
      <div className="left-actions">
        <IconButton>
          <img src={''} alt={'Back'}/>
        </IconButton>
      </div>
      <h3 className="title">{title}</h3>
    </div>
  );
};
