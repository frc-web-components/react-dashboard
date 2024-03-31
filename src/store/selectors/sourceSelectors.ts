import { RootState } from "../app/store";
import { createSelector } from "@reduxjs/toolkit";
// import { memoize, memoizeWithArgs } from "proxy-memoize";
import { Source } from "../slices/sourceSlice";

export const selectSources = (state: RootState) => state.source.sources;

export const selectProviderSources = (state: RootState, provider: string) =>
  state.source.sources[provider];

export const selectSource = (state: RootState, provider: string, key: string) =>
  state.source.sources[provider]?.[key];


export interface SourceTree extends Source {
  childrenSources: SourceTree[];
}

export const selectSourceTree = createSelector(
  [selectProviderSources, selectSource],
  (sources, source) => {
    if (!sources || !source) {
      return undefined;
    }

    const getTree = (sourceKey: string): SourceTree => {
      const source = sources[sourceKey];
      return {
        ...source,
        childrenSources: source.children.map(getTree)
      }
    };

    return getTree('');
  }
);
