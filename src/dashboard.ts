import StrictEventEmitter from "strict-event-emitter-types";
import { EventEmitter } from "events";
import { ComponentConfig } from "@context-providers/ComponentConfigContext";
import { store } from "@store/app/store";
import {
  Layout,
  setLayout,
  initialLayoutState,
  addTab,
  addComponent,
} from "@store/slices/layoutSlice";
import exampleLayout from "./example-layouts/example";
import { v4 as uuidv4 } from "uuid";
import { IJsonRowNode, IJsonTabNode, IJsonTabSetNode } from "flexlayout-react";

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
    this.emit("exampleAdd");
  }

  getExamples() {
    return [...this.#exampleDashboards];
  }

  addTab(name: string) {
    store.dispatch(addTab(name));
  }

  #findTabByName(name: string, node: IJsonRowNode | IJsonTabSetNode): IJsonTabNode | undefined {
    if (node.type === 'tabset') {
      return node.children.find(childTab => childTab.name === name);
    }
    for (const child of node.children) {
      const tab = this.#findTabByName(name, child);
      if (tab) {
        return tab;
      }
    }
    return undefined;
  }

  getTab(name: string): IJsonTabNode | undefined {
    const { flexLayout } = store.getState().layout;
    return this.#findTabByName(name, flexLayout.layout);
  }

  addElementToTab(
    tabName: string,
    element: {
      type: string;
      name?: string;
      size: { width: number; height: number };
      position: { x: number; y: number };
      source?: {
        provider: string;
        key: string;
      };
      properties?: {
        [propertName: string]: {
          value: unknown;
          source?: {
            provider: string;
            key: string;
          };
        };
      };
    }
  ) {
    const { type, name, properties, size, position } = element;
    const componentConfig = this.#components[type];
    const tab = this.getTab(tabName);
    if (!componentConfig || !tab) {
      return;
    }
    const elementId = uuidv4();
    const props = properties ?? {};
    Object.entries(componentConfig.properties).forEach(([name, prop]) => {
      props[name] = {
        value: prop.defaultValue,
      };
    });

    const { gridSize } = store.getState().layout;
    const minWidth = Math.ceil(
      componentConfig.dashboard.minSize.width / gridSize
    );
    const minHeight = Math.ceil(
      componentConfig.dashboard.minSize.height / gridSize
    );

    store.dispatch(
      addComponent({
        tabId: tab.id!,
        component: {
          id: elementId,
          children: [],
          source: element.source ?? componentConfig.defaultSource,
          minSize: { width: minWidth, height: minHeight },
          size,
          position,
          properties: props,
          type,
          name: name ?? componentConfig.dashboard.name,
        },
      })
    );
  }
}
