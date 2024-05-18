import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { Provider } from "react-redux";
import { store } from "./store/app/store";
import { DropZoneProvider } from "./context-providers/DropZoneContext.tsx";
import { ComponentConfigProvider } from "./context-providers/ComponentConfigContext.tsx";
import { componentMap } from "./components";
import { SourceProviderProvider } from "./context-providers/SourceProviderContext.tsx";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Provider store={store}>
        <SourceProviderProvider>
          <DropZoneProvider>
            <ComponentConfigProvider components={componentMap}>
              <App />
            </ComponentConfigProvider>
          </DropZoneProvider>
        </SourceProviderProvider>
      </Provider>
    </ThemeProvider>
  </React.StrictMode>
);
