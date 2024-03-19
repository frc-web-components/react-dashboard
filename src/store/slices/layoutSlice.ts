import type { PayloadAction } from "@reduxjs/toolkit";
import { createAppSlice } from "../app/createAppSlice";

export interface Component {
  id: string;
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
  position: { x: number; y: number };
  size: { width: number; height: number };
  minSize: { width: number; height: number };
  children: string[];
}

export interface LayoutSliceState {
  selectedComponentId?: string;
  components: Record<string, Record<string, Component>>;
}

const initialState: LayoutSliceState = {
  selectedComponentId: undefined,
  components: {},
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
      (state, action: PayloadAction<string>) => {
        state.selectedComponentId = action.payload;
      }
    ),
    addComponent: create.reducer((state, action: PayloadAction<{ component: Component, tabId: string }>) => {
      const { component, tabId } = action.payload;
      if (!state.components[tabId]) {
        state.components[tabId] = {};
      }
      state.components[tabId][component.id] = component;
    }),
    updateComponentSize: create.reducer(
      (
        state,
        action: PayloadAction<{ tabId: string, id: string; width: number; height: number }>
      ) => {
        const { tabId, id, width, height } = action.payload;
        state.components[tabId][id].size = { width, height };
      }
    ),
    updateComponentPosition: create.reducer(
      (state, action: PayloadAction<{ tabId: string, id: string; x: number; y: number }>) => {
        const { tabId, id, x, y } = action.payload;
        state.components[tabId][id].position = { x, y };
      }
    ),
    updateComponentProperty: create.reducer(
      (
        state,
        action: PayloadAction<{
          tabId: string;
          componentId: string;
          propertyName: string;
          propertyValue: unknown;
        }>
      ) => {
        const { tabId, componentId, propertyName, propertyValue } = action.payload;
        state.components[tabId][componentId].properties[propertyName].value =
          propertyValue;
      }
    ),
    updateComponentSource: create.reducer(
      (
        state,
        action: PayloadAction<{
          tabId: string;
          componentId: string;
          propertyName: string;
          source?: {
            provider: string;
            key: string;
          }
        }>
      ) => {
        const { tabId, componentId, propertyName, source } = action.payload;
        state.components[tabId][componentId].properties[propertyName].source = source;
      }
    ),
  }),
  // You can define your selectors here. These selectors receive the slice
  // state as their first argument.
  selectors: {
    selectSelectedComponentId: (layout) => layout.selectedComponentId,
    selectSelectedComponent: (layout) => {
      if (!layout.selectedComponentId) {
        return undefined;
      }
      for (let components of Object.values(layout.components)) {
        const component = components[layout.selectedComponentId];
        if (component) {
          return component;
        }
      }
      return undefined;
    },
    selectComponents: (layout, tabId: string) => layout.components[tabId],
  },
});

// Action creators are generated for each case reducer function.
export const {
  setSelectedComponent,
  addComponent,
  updateComponentPosition,
  updateComponentSize,
  updateComponentProperty,
  updateComponentSource,
} = layoutSlice.actions;

// Selectors returned by `slice.selectors` take the root state as their first argument.
export const {
  selectSelectedComponent,
  selectSelectedComponentId,
  selectComponents,
} = layoutSlice.selectors;

// We can also write thunks by hand, which may contain both sync and async logic.
// Here's an example of conditionally dispatching actions based on current state.
// export const incrementIfOdd =
//   (amount: number): AppThunk =>
//   (dispatch, getState) => {
//     const currentValue = selectCount(getState());

//     if (currentValue % 2 === 1 || currentValue % 2 === -1) {
//       dispatch(incrementByAmount(amount));
//     }
//   };
