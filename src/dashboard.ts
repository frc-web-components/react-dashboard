import StrictEventEmitter from "strict-event-emitter-types";
import { EventEmitter } from "events";
import { ComponentConfig } from "./context-providers/ComponentConfigContext";
import { store } from "./store/app/store";
import {
  Layout,
  setLayout,
  initialLayoutState,
} from "./store/slices/layoutSlice";

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
}
