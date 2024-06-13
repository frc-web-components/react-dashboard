import StrictEventEmitter from "strict-event-emitter-types";
import { EventEmitter } from "events";
import { ComponentConfig } from "./components/context-providers/ComponentConfigContext";
import { store } from "./store/app/store";
import {
  Layout,
  setLayout,
  initialLayoutState,
} from "./store/slices/layoutSlice";
import exampleLayout from "./example-layouts/example";

interface DashboardEvents {
  addComponentsEvent: (components: Record<string, ComponentConfig>) => void;
  setLayoutEvent: (layout: Layout) => void;
  newDashboardMenuClickEvent: () => void;
  newWindowMenuClickEvent: () => void;
  openDashboardMenuClickEvent: () => void;
  saveDashboardMenuClickEvent: () => void;
  saveDashboardAsMenuClickEvent: () => void;
  pluginsMenuClickEvent: () => void;
  closeWindowMenuClickEvent: () => void;
  quitMenuClickEvent: () => void;
  closeWindowClickEvent: () => void;
  minimizeWindowClickEvent: () => void;
  maximizeWindowClickEvent: () => void;
  setLoadedPluginsEvent: (plugins: Plugin[]) => void;
  pluginDialogRemoveEvent: (location: string) => void;
  pluginDialogLoadPluginEvent: () => void;
  dashboardTitleChange: (title: string) => void;
  exampleAdd: () => void;
}

export type DashboardEventEmitter = StrictEventEmitter<
  EventEmitter,
  DashboardEvents
>;

export interface Plugin {
  name: string;
  description: string;
  version: string;
  location: string;
}
export default class Dashboard extends (EventEmitter as unknown as new () => DashboardEventEmitter) {
  #components: Record<string, ComponentConfig> = {};
  #loadedPlugins: Plugin[] = [];
  #title = "Untitled Dashboard";
  #exampleDashboards: {
    name: string;
    layout: Layout;
  }[] = [
    { name: "Example", layout: exampleLayout },
    { name: "Example 2", layout: exampleLayout },
  ];

  setTitle(title: string) {
    this.#title = title;
    this.emit("dashboardTitleChange", title);
  }

  getTitle() {
    return this.#title;
  }

  addComponents(components: Record<string, ComponentConfig>) {
    this.#components = {
      ...this.#components,
      ...components,
    };
    this.emit("addComponentsEvent", components);
  }

  getComponents() {
    return this.#components;
  }

  getLayout(): Layout {
    const layout = { ...store.getState().layout };
    delete layout.selectedComponentId;
    return layout;
  }

  setLayout(layout: Layout) {
    store.dispatch(setLayout(layout));
  }

  resetLayout() {
    this.setLayout(initialLayoutState);
  }

  setLoadedPlugins(plugins: Plugin[]) {
    this.#loadedPlugins = plugins;
    this.emit("setLoadedPluginsEvent", plugins);
  }

  getLoadedPlugins() {
    return this.#loadedPlugins;
  }

  addExample(name: string, layout: Layout) {
    this.#exampleDashboards.push({ name, layout });
    this.emit('exampleAdd');
  }

  getExamples() {
    return [...this.#exampleDashboards];
  }
}
