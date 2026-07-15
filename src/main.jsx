// src/main.jsx
// ──────────────────────────────────────────────────────────────────
// Auth0Provider ko BrowserRouter ke baad wrap karna hai
// ──────────────────────────────────────────────────────────────────

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { store } from "./app/store";
import Auth0ProviderWithNavigate from "./auth/Auth0ProviderWithNavigate";
import App from "./App";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      {/* BrowserRouter pehle, phir Auth0Provider — navigate() ke liye zaroori */}
      <BrowserRouter>
        <Auth0ProviderWithNavigate>
          <App />
        </Auth0ProviderWithNavigate>
      </BrowserRouter>
    </Provider>
  </StrictMode>
);
