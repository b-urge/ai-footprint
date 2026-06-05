import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Options } from "./Options";
import "../popup/popup.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Options />
  </StrictMode>
);
