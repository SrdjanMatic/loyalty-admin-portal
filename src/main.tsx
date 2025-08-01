import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "./store/store.ts";
import App from "./App.tsx";
import { ReactKeycloakProvider } from "@react-keycloak/web";
import { keycloak } from "./keycloak/keycloak.ts";

const eventLogger = (event: string, error?: unknown) => {
  if (event === "onAuthSuccess") {
    localStorage.setItem("token", keycloak.token || "");
  }
  if (event === "onAuthRefreshSuccess") {
    localStorage.setItem("token", keycloak.token || "");
  }
  if (event === "onAuthLogout") {
    localStorage.removeItem("token");
  }
};

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <ReactKeycloakProvider authClient={keycloak} onEvent={eventLogger}>
    <Provider store={store}>
      <App />
    </Provider>
  </ReactKeycloakProvider>
);
