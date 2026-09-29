import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyBz5d-KAeEMdSOSuDbQHc8Qb3pnKcSA_HA",
  authDomain: "expense-tracker-26638.firebaseapp.com",
  databaseURL: "https://expense-tracker-26638-default-rtdb.firebaseio.com",
  projectId: "expense-tracker-26638",
  storageBucket: "expense-tracker-26638.firebasestorage.app",
  messagingSenderId: "1091619723202",
  appId: "1:1091619723202:web:5f36c0df97348897b6685b",
  measurementId: "G-BZ37MFKRT8",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getDatabase(app);
