import React from "react";
import ReactDOM from "react-dom/client";
import App from "./components/App.tsx";
import { Provider } from "react-redux";
import { store } from "./store/app/store";
import { DropZoneProvider } from "./components/context-providers/DropZoneContext.tsx";
import {
  ComponentConfig,
  ComponentConfigProvider,
} from "@context-providers/ComponentConfigContext.tsx";
import { componentMap } from "./components/dashboard-components/index.ts";
import { SourceProviderProvider } from "./components/context-providers/SourceProviderContext.tsx";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Dashboard from "./dashboard.ts";
import { DashboardProvider } from "@context-providers/DashboardContext.tsx";
import "./index.module.scss";
import { Layout } from "./store/slices/layoutSlice.ts";
import ShuffleboardLayout from "./plugins/robot-layout.ts";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

const dashboard = new Dashboard();
dashboard.addComponents(componentMap);

const robotLayout = new ShuffleboardLayout(dashboard);

setTimeout(() => {
  dashboard.addElementToTab('hi', {
    type: 'basicFmsInfo',
    position: { x: 1, y: 1 },
    size: { width: 3, height: 1 }
  });
}, 2000);

export function mountDashboard(element: HTMLElement) {
  ReactDOM.createRoot(element).render(
    <React.StrictMode>
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <Provider store={store}>
          <SourceProviderProvider>
            <DropZoneProvider>
              <ComponentConfigProvider dashboard={dashboard}>
                <DashboardProvider dashboard={dashboard}>
                  <App />
                </DashboardProvider>
              </ComponentConfigProvider>
            </DropZoneProvider>
          </SourceProviderProvider>
        </Provider>
      </ThemeProvider>
    </React.StrictMode>
  );
}

export function addComponents(components: Record<string, ComponentConfig>) {
  dashboard.addComponents(components);
}

export function getDashboard() {
  return dashboard;
}

let assetBasePath = "";

export function setAssetBasePath(path: string) {
  assetBasePath = path;
}

export function getAssetBasePath() {
  return assetBasePath;
}

export function getAssetUrl(relativePath: string): string {
  return `${assetBasePath.replace(/\/$/, "")}/${relativePath.replace(
    /^\//,
    ""
  )}`;
}

export function addExample(name: string, layout: Layout) {
  dashboard.addExample(name, layout);
}

export {
  createComponent,
  booleanProp,
  colorProp,
  markdownProp,
  numberArrayProp,
  numberProp,
  stringArrayProp,
  stringDropdownProp,
  stringProp,
} from "./components/dashboard-components/fromProps.ts";

mountDashboard(document.getElementById("root")!);
