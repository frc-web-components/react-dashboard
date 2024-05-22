import StrictEventEmitter from "strict-event-emitter-types";
import { EventEmitter } from "events";
import { ComponentConfig } from "./context-providers/ComponentConfigContext";

interface DashboardEvents {
  addComponentsEvent: (components: Record<string, ComponentConfig>) => void;
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
}
