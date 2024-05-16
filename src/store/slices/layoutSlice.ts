import type { PayloadAction } from "@reduxjs/toolkit";
import { createAppSlice } from "../app/createAppSlice";

export interface Component {
  id: string;
  type: string;
  name: string;
  source?: {
    provider: string;
    key: string;
  };
  properties: {
    [propertName: string]: {
      value: unknown;
      source?: {
        provider: string;
        key: string;
      };
    };
  };
  position: { x: number; y: number };
  size: { width: number; height: number };
  minSize: { width: number; height: number };
  parent?: string;
  children: string[];
}

export interface LayoutSliceState {
  selectedComponentId?: string;
  components: {
    [componentId: string]: Component;
  };
  tabs: {
    [tabId: string]: {
      componentIds: string[];
    };
  };
  // components: Record<string, Record<string, Component>>;
}

const initialState: LayoutSliceState = {
  selectedComponentId: undefined,
  components: {},
  tabs: {},
};

// If you are not using async thunks you can use the standalone `createSlice`.
export const layoutSlice = createAppSlice({
  name: "layout",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: (create) => ({
    // Use the `PayloadAction` type to declare the contents of `action.payload`
    setSelectedComponent: create.reducer(
      (state, action: PayloadAction<string | undefined>) => {
        state.selectedComponentId = action.payload;
      }
    ),
    addComponent: create.reducer(
      (
        state,
        action: PayloadAction<{ component: Component; tabId: string }>
      ) => {
        const { component, tabId } = action.payload;
        const parentComponent = component.parent
          ? state.components[component.parent]
          : undefined;
        if (component.parent && !parentComponent) {
          return;
        }
        parentComponent?.children.push(component.id);

        state.components[component.id] = component;
        if (!state.tabs[tabId]) {
          state.tabs[tabId] = {
            componentIds: [],
          };
        }
        state.tabs[tabId].componentIds.push(component.id);
      }
    ),
    removeComponent: create.reducer(
      (state, action: PayloadAction<{ componentId: string }>) => {
        const { componentId } = action.payload;
        const component = state.components[componentId];

        let tabId = Object.keys(state.tabs).find((id) => {
          return state.tabs[id].componentIds.includes(componentId);
        });

        const componentIds = new Set(
          tabId ? state.tabs[tabId].componentIds : []
        );

        if (componentId === state.selectedComponentId) {
          state.selectedComponentId = undefined;
        }
        if (component) {
          if (component.parent) {
            const children = state.components[component.parent].children;
            children.splice(children.indexOf(componentId), 1);
          }
          component.children.forEach((child) => {
            delete state.components[child];
            componentIds.delete(child);

            if (state.selectedComponentId === child) {
              state.selectedComponentId = undefined;
            }
          });
          componentIds.delete(componentId);
          delete state.components[componentId];
        }
        if (tabId) {
          state.tabs[tabId].componentIds = [...componentIds];
        }
      }
    ),
    clearTab: create.reducer(
      (state, action: PayloadAction<{ tabId: string }>) => {
        const { tabId } = action.payload;
        const tab = state.tabs[tabId];
        if (!tab) {
          return;
        }
        tab.componentIds.forEach(componentId => {
          delete state.components[componentId];
        });
        tab.componentIds = [];
        state.selectedComponentId = undefined;
      }
    ),
    setComponentName: create.reducer(
      (state, action: PayloadAction<{ componentId: string; name: string }>) => {
        const { componentId, name } = action.payload;
        state.components[componentId].name = name;
      }
    ),

    updateComponentType: create.reducer(
      (
        state,
        action: PayloadAction<{
          componentId: string;
          type: string;
          properties: {
            [propertName: string]: {
              value: unknown;
              source?: {
                provider: string;
                key: string;
              };
            };
          };
          name: string;
        }>
      ) => {
        const { componentId, type, properties, name } = action.payload;
        if (!state.components[componentId]) {
          return;
        }
        state.components[componentId].type = type;
        state.components[componentId].properties = properties;
        state.components[componentId].name = name;
      }
    ),
    updateComponentSize: create.reducer(
      (
        state,
        action: PayloadAction<{ id: string; width: number; height: number }>
      ) => {
        const { id, width, height } = action.payload;
        state.components[id].size = { width, height };
      }
    ),
    updateComponentPosition: create.reducer(
      (state, action: PayloadAction<{ id: string; x: number; y: number }>) => {
        const { id, x, y } = action.payload;
        state.components[id].position = { x, y };
      }
    ),
    updateComponentProperty: create.reducer(
      (
        state,
        action: PayloadAction<{
          componentId: string;
          propertyName: string;
          propertyValue: unknown;
        }>
      ) => {
        const { componentId, propertyName, propertyValue } = action.payload;
        state.components[componentId].properties[propertyName].value =
          propertyValue;
      }
    ),
    updateComponentPropertySource: create.reducer(
      (
        state,
        action: PayloadAction<{
          componentId: string;
          propertyName: string;
          source?: {
            provider: string;
            key: string;
          };
        }>
      ) => {
        const { componentId, propertyName, source } = action.payload;
        state.components[componentId].properties[propertyName].source = source;
      }
    ),
    updateComponentSource: create.reducer(
      (
        state,
        action: PayloadAction<{
          componentId: string;
          source?: {
            provider: string;
            key: string;
          };
        }>
      ) => {
        const { componentId, source } = action.payload;
        state.components[componentId].source = source;
      }
    ),
  }),
});

// Action creators are generated for each case reducer function.
export const {
  setSelectedComponent,
  addComponent,
  removeComponent,
  clearTab,
  updateComponentPosition,
  updateComponentSize,
  updateComponentProperty,
  updateComponentPropertySource,
  updateComponentSource,
  updateComponentType,
  setComponentName,
} = layoutSlice.actions;
