import { User } from "firebase/auth";
import React from "react";
import ReactDOM from "react-dom/client";
import ChatWidget from "./components/ChatWidget";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement,
);

root.render(
  <React.StrictMode>
    <ChatWidget url="http://localhost:3001" firebaseConfig={{}} user={{} as User}/>
  </React.StrictMode>,
);
