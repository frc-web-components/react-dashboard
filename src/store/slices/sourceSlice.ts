import { PayloadAction } from "@reduxjs/toolkit";
import { createAppSlice } from "../app/createAppSlice";

export type PropertyType =
  | "Number"
  | "String"
  | "Boolean"
  | "Object"
  | "Number[]"
  | "String[]"
  | "Boolean[]"
  | "Object[]";

export interface Source {
  provider: string;
  key: string;
  type?: string;
  propertyType?: PropertyType;
  parent?: string;
  children: string[];
  name: string;
}

export interface SourceMetadata {
  displayType?: string;
}

export interface SourceSlice {
  sources: {
    [providerName: string]: {
      [sourceKey: string]: Source;
    };
  };
  sourceValues: {
    [providerName: string]: {
      [sourceKey: string]: unknown;
    };
  };
  metadata: {
    [providerName: string]: {
      [sourceKey: string]: SourceMetadata;
    };
  };
}

const initialState: SourceSlice = {
  sources: {},
  sourceValues: {},
  metadata: {},
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
          propertyType: PropertyType;
        }>
      ) => {
        // add source
        const { provider, type, propertyType, key, value } = action.payload;
        const keyParts = key.split("/");
        if (!state.sources[provider]) {
          state.sources[provider] = {};
        }
        if (!state.sources[provider][key]) {
          state.sources[provider][key] = {
            provider,
            key,
            name: keyParts[keyParts.length - 1],
            children: [],
            type,
            propertyType,
            parent:
              keyParts.length > 1 ? keyParts.slice(0, -1).join("/") : undefined,
          };
        } else {
          state.sources[provider][key].propertyType = propertyType;
        }
        if (!state.sourceValues[provider]) {
          state.sourceValues[provider] = {};
        }
        if (typeof value !== "undefined") {
          state.sourceValues[provider][key] = value;
        }

        // update ancestors
        for (let i = 1; i < keyParts.length; i++) {
          const grandParent =
            i === 1 ? undefined : keyParts.slice(0, i - 1).join("/");
          const parent = keyParts.slice(0, i).join("/");
          const child = keyParts.slice(0, i + 1).join("/");
          if (!state.sources[provider][parent]) {
            state.sources[provider][parent] = {
              provider,
              name: keyParts[i - 1],
              key: parent,
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
    setSources: create.reducer(
      (
        state,
        action: PayloadAction<
          {
            provider: string;
            key: string;
            value: unknown;
            type: string;
            propertyType: PropertyType;
          }[]
        >
      ) => {
        // add source
        action.payload.forEach((actionPayload) => {
          const { provider, type, propertyType, key, value } = actionPayload;
          const keyParts = key.split("/");
          if (!state.sources[provider]) {
            state.sources[provider] = {};
          }
          if (!state.sources[provider][key]) {
            state.sources[provider][key] = {
              provider,
              key,
              name: keyParts[keyParts.length - 1],
              children: [],
              type,
              propertyType,
              parent:
                keyParts.length > 1
                  ? keyParts.slice(0, -1).join("/")
                  : undefined,
            };
          } else {
            state.sources[provider][key].propertyType = propertyType;
          }
          if (!state.sourceValues[provider]) {
            state.sourceValues[provider] = {};
          }
          if (typeof value !== "undefined") {
            state.sourceValues[provider][key] = value;
          }

          // update ancestors
          for (let i = 1; i < keyParts.length; i++) {
            const grandParent =
              i === 1 ? undefined : keyParts.slice(0, i - 1).join("/");
            const parent = keyParts.slice(0, i).join("/");
            const child = keyParts.slice(0, i + 1).join("/");
            if (!state.sources[provider][parent]) {
              state.sources[provider][parent] = {
                provider,
                name: keyParts[i - 1],
                key: parent,
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
        });
      }
    ),
    setSourceDisplayTypes: create.reducer(
      (
        state,
        action: PayloadAction<
          {
            provider: string;
            key: string;
            type: string;
          }[]
        >
      ) => {
        action.payload.forEach(({ key, provider, type }) => {
          if (!state.metadata[provider]) {
            state.metadata[provider] = {};
          }
          if (!state.metadata[provider][key]) {
            state.metadata[provider][key] = {};
          }
          state.metadata[provider][key].displayType = type;
        });
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
          state.sources[provider][key].type = undefined;
        }
        delete state.sourceValues[provider][key];
        const keyParts = key.split("/");
        for (let i = keyParts.length - 1; i > 0; i--) {
          const parent = keyParts.slice(0, i).join("/");
          const child = keyParts.slice(0, i + 1).join("/");
          if (!state.sources[provider][child]) {
            const children = state.sources[provider][parent].children;
            children.splice(children.indexOf(child), 1);
          }
        }
      }
    ),
  }),
});

export const { removeSource, setSource, setSources, setSourceDisplayTypes } =
  sourceSlice.actions;
