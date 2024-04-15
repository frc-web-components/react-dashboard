import { RootState } from "../app/store";
import { createSelector } from "@reduxjs/toolkit";

export const selectSelectedComponentId = (state: RootState) =>
  state.layout.selectedComponentId;
export const selectComponents = (state: RootState) => state.layout.components;

export const selectTab = (state: RootState, tabId: string) =>
  state.layout.tabs[tabId];

export const selectComponent = (state: RootState, componentId: string) => state.layout.components[componentId];

export function makeSelectTabComponents() {
  return createSelector(
    [selectTab, selectComponents],
    (tab, components) => {
      return tab?.componentIds.map((id) => components[id]);
    }
  );
}

export function makeSelectSelectedComponent() {
  return createSelector(
    [selectSelectedComponentId, selectComponents],
    (selectedComponentId, components) => {
      if (!selectedComponentId) {
        return undefined;
      }
      return components[selectedComponentId];
    }
  );
}
