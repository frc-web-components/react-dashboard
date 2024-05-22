import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { Provider } from "react-redux";
import { store } from "./store/app/store";
import { DropZoneProvider } from "./context-providers/DropZoneContext.tsx";
import { ComponentConfig, ComponentConfigProvider } from "./context-providers/ComponentConfigContext.tsx";
import { componentMap } from "./components";
import { SourceProviderProvider } from "./context-providers/SourceProviderContext.tsx";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Dashboard from "./dashboard.ts";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

const dashboard = new Dashboard();
dashboard.addComponents(componentMap);

export function mountDashboard(element: HTMLElement) {

  ReactDOM.createRoot(element).render(
    <React.StrictMode>
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <Provider store={store}>
          <SourceProviderProvider>
            <DropZoneProvider>
              <ComponentConfigProvider dashboard={dashboard}>
                <App />
              </ComponentConfigProvider>
            </DropZoneProvider>
          </SourceProviderProvider>
        </Provider>
      </ThemeProvider>
    </React.StrictMode>
  );
}

export function addComponents(components:  Record<string, ComponentConfig>) {
  dashboard.addComponents(components);
}

export function getDashboard() {
  return dashboard;
}

mountDashboard(document.getElementById("root")!);
