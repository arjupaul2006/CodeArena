import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import UserContext from "./context/UserContext.jsx";
import SettingsContext from "./context/SettingsContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <UserContext>
      <SettingsContext>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </SettingsContext>
    </UserContext>
  </StrictMode>,
);
