import { RootState } from "../app/store";
import { createSelector } from "@reduxjs/toolkit";
import { Source } from "../slices/sourceSlice";

export const selectSources = (state: RootState) => state.source.sources;

export const selectProviderSources = (state: RootState, provider?: string) =>
  typeof provider === "undefined" ? undefined : state.source.sources[provider];

export const selectProviderSourceValues = (
  state: RootState,
  provider?: string
) =>
  typeof provider === "undefined"
    ? undefined
    : state.source.sourceValues[provider];

export const selectSource = (
  state: RootState,
  provider?: string,
  key?: string
) =>
  typeof provider === "undefined" || typeof key === "undefined"
    ? undefined
    : state.source.sources[provider]?.[key];

export const selectSourceValue = (
  state: RootState,
  provider?: string,
  key?: string
) =>
  typeof provider === "undefined" || typeof key === "undefined"
    ? undefined
    : state.source.sourceValues[provider]?.[key];

export interface SourceTree extends Source {
  value: unknown;
  childrenSources: Record<string, SourceTree>;
}

export interface SourceTreePreview extends Source {
  childrenSources: Record<string, SourceTreePreview>;
}

export function makeSelectSourceTree() {
  return createSelector(
    [selectProviderSources, selectProviderSourceValues, selectSource],
    (sources, sourceValues, source) => {
      if (!sources || !source) {
        return undefined;
      }

      const getTree = (sourceKey: string): SourceTree => {
        const source = sources[sourceKey];
        const value = sourceValues?.[sourceKey];
        const childrenSources: Record<string, SourceTree> = {};
        source.children.forEach((key) => {
          const childSource = sources[key];
          childrenSources[childSource.name] = getTree(key);
        });
        return {
          ...source,
          value,
          childrenSources,
        };
      };

      return getTree(source.key);
    }
  );
}

export function makeSelectSourceTreePreview() {
  return createSelector(
    [selectProviderSources, selectSource],
    (sources, source) => {
      if (!sources || !source) {
        return undefined;
      }

      console.log('!?!?!?');

      const getTree = (sourceKey: string): SourceTreePreview => {
        const source = sources[sourceKey];
        const childrenSources: Record<string, SourceTreePreview> = {};
        source.children.forEach((key) => {
          const childSource = sources[key];
          childrenSources[childSource.name] = getTree(key);
        });
        return {
          ...source,
          childrenSources,
        };
      };

      return getTree(source.key);
    }
  );
}
