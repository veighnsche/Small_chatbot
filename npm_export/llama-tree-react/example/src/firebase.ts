import { getAuth } from "firebase/auth";
import { initializeApp } from 'firebase/app';
import { firebaseConfig } from "./firebaseConfig";

export let firebaseApp = initializeApp(firebaseConfig);
export let auth = getAuth(firebaseApp);