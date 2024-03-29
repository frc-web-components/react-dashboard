import { PayloadAction } from "@reduxjs/toolkit";
import { createAppSlice } from "../app/createAppSlice";

export interface Source {
  type?: string;
  value?: unknown;
  parent?: string;
  children: string[];
}

export interface SourceSlice {
  sources: {
    [providerName: string]: {
      [sourceKey: string]: Source;
    };
  };
}

const initialState: SourceSlice = {
  sources: {},
};

export const sourceSlice = createAppSlice({
  name: "source",
  initialState,
  reducers: (create) => ({
    setSource: create.reducer(
      (
        state,
        action: PayloadAction<{
          provider: string;
          key: string;
          value: unknown;
          type: string;
        }>
      ) => {
        // add source
        const { provider, type, key, value } = action.payload;
        const keyParts = key.split("/");
        if (!state.sources[provider]) {
          state.sources[provider] = {};
        }
        if (!state.sources[provider][key]) {
          state.sources[provider][key] = {
            children: [],
            type,
            value,
            parent:
              keyParts.length > 1 ? keyParts.slice(0, -1).join("/") : undefined,
          };
        } else {
          state.sources[provider][key].value = value;
        }
        // update ancestors
        for (let i = 1; i < keyParts.length - 1; i++) {
          const grandParent = i === 1 ? undefined:  keyParts.slice(0, i - 1).join("/");
          const parent = keyParts.slice(0, i).join("/");
          const child = keyParts.slice(0, i + 1).join("/");
          if (!state.sources[provider][parent]) {
            state.sources[provider][parent] = {
              parent: grandParent,
              children: [],
            };
          }
          const hasChild =
            state.sources[provider][parent].children.includes(child);
          if (!hasChild) {
            state.sources[provider][parent].children.push(child);
          }
        }
      }
    ),
    removeSource: create.reducer(
      (
        state,
        action: PayloadAction<{
          provider: string;
          key: string;
        }>
      ) => {
        const { provider, key } = action.payload;
        if (!state.sources[provider]?.[key]) {
          return;
        }
        if (state.sources[provider][key].children.length === 0) {
          delete state.sources[provider][key];
        } else { 
          state.sources[provider][key].value = undefined;
          state.sources[provider][key].type = undefined;
        }
        const keyParts = key.split('/');
        for (let i = keyParts.length - 1; i > 0; i--) {
          const parent = keyParts.slice(0, i).join('/');
          const child = keyParts.slice(0, i + 1).join('/');
          if (!state.sources[provider][child]) {
            const children = state.sources[provider][parent].children;
            children.splice(children.indexOf(child), 1);
          }
        }
      }
    )
  }),
});

export const { removeSource, setSource } = sourceSlice.actions;