import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import * as React from "react";
import { auth } from "../firebase";

export const GoogleLoginButton = () => {
  return (
    <div>
      <button
        onClick={async () => {
          const provider = new GoogleAuthProvider()
          try {
            await signInWithPopup(auth, provider)
          } catch (error) {
            console.error(error)
          }
        }}
      >
        Login with Google
      </button>
    </div>
  )
}