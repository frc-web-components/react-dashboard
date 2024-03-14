import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { NT4Provider } from "@frc-web-components/react";
import { Provider } from "react-redux";
import { store } from "./store/app/store";
import { DropZoneProvider } from "./context-providers/DropZoneContext.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <DropZoneProvider>
        <NT4Provider address="localhost">
          <App />
        </NT4Provider>
      </DropZoneProvider>
    </Provider>
  </React.StrictMode>
);
