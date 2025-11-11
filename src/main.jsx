import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";

// ✅ Use only one createRoot() call
const root = createRoot(document.getElementById("root"));

// ✅ Wrap in StrictMode (recommended for React 18)
root.render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);
