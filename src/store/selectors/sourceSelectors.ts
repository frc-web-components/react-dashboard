import { RootState } from "../app/store";
import { createSelector } from "@reduxjs/toolkit";
import { memoize, memoizeWithArgs } from "proxy-memoize";
import { Source } from "../slices/sourceSlice";

const selectProviderSources = (state: RootState, provider: string) =>
  state.source.sources[provider];

const selectSource = (state: RootState, provider: string, key: string) =>
  state.source.sources[provider]?.[key];

const selectSourceTree = createSelector(
  [selectProviderSources, selectSource],
  (sources, source) => {
    if (!sources || !source) {
      return undefined;
    }

    const getTree = (sources: { [sourceKey: string]: Source }, source: Source) => {
      
    };
  }
);
