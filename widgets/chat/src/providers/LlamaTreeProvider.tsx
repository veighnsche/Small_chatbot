import { FirebaseOptions, initializeApp } from "firebase/app";
import { User } from "firebase/auth";
import { doc, getFirestore } from "firebase/firestore";
import { ReactNode } from "react";
import { Provider as ReduxProvider } from "react-redux";
import { configureLlamaStore } from "../stores/llamaStore";
import { configureWretch } from "../utils/fetch";

interface LlamaTreeProps {
  children: ReactNode;
  url: string;
  firebaseConfig: FirebaseOptions;
  user: User;
}

export function LlamaTreeProvider({
  children,
  url,
  firebaseConfig,
  user,
}: LlamaTreeProps) {
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);

  const userDocRef = doc(db, "assistantChat", user.uid);
  const wretch = configureWretch({ url, user });
  const llamaStore = configureLlamaStore({ wretch, userDocRef, user });

  return (
    <ReduxProvider store={llamaStore}>
      {children}
    </ReduxProvider>
  );
}
