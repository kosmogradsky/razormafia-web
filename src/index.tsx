import * as React from "react";
import { render } from "react-dom";
import { initializeApp } from "firebase/app";
import { Main } from "./Main";

const firebaseConfig = {
  apiKey: "AIzaSyDdR94Zo4JrhUPxLj_ylbVcZmlq2C_EDDE",
  authDomain: "razormafia-e1ac2.firebaseapp.com",
  projectId: "razormafia-e1ac2",
  storageBucket: "razormafia-e1ac2.appspot.com",
  messagingSenderId: "175496110600",
  appId: "1:175496110600:web:cbef365eab5a18f71027bd"
};

initializeApp(firebaseConfig);

const app = document.createElement('div');

document.body.appendChild(app);

render(<Main />, app);
