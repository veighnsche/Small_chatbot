import * as React from "react";
import { useEffect } from "react";
import { useLlamaTree } from "../../../src";
import { auth } from "../firebase";
import { GoogleLoginButton } from "./GoogleLoginButton";
import { OpenChatButton } from "./OpenChatButton";
import { SendMessageButton } from "./SendMessageButton";

export function ControlContainer() {
  const { setUser } = useLlamaTree();

  useEffect(() => {
    const sub = auth.onAuthStateChanged((user) => {
      if (!user) {
        return;
      }
      setUser(user);
    });

    return () => {
      sub();
    };
  }, []);

  return (
    <div>
      <GoogleLoginButton/>
      <OpenChatButton/>
      <SendMessageButton/>
    </div>
  );
}