import StrictEventEmitter from "strict-event-emitter-types";
import { EventEmitter } from "events";
import { ComponentConfig } from "./context-providers/ComponentConfigContext";
import { store } from "./store/app/store";
import { Layout, setLayout, initialLayoutState } from "./store/slices/layoutSlice";

interface DashboardEvents {
  addComponentsEvent: (components: Record<string, ComponentConfig>) => void;
  setLayoutEvent: (layout: Layout) => void;
}

export type DashboardEventEmitter = StrictEventEmitter<
  EventEmitter,
  DashboardEvents
>;

export default class Dashboard extends (EventEmitter as unknown as new () => DashboardEventEmitter) {
  #components: Record<string, ComponentConfig> = {};

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
}
