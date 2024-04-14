import { RootState } from "../app/store";
import { createSelector } from "@reduxjs/toolkit";
import { memoize, memoizeWithArgs } from "proxy-memoize";
import { PropertyType, Source } from "../slices/sourceSlice";

export const selectSources = (state: RootState) => state.source.sources;

export const selectProviderSources = (state: RootState, provider?: string) =>
  typeof provider === "undefined" ? undefined : state.source.sources[provider];

export const selectSource = (
  state: RootState,
  provider?: string,
  key?: string
) =>
  typeof provider === "undefined" || typeof key === "undefined"
    ? undefined
    : state.source.sources[provider]?.[key];

export interface SourceTree extends Source {
  childrenSources: Record<string, SourceTree>;
}

export interface SourceTreePreview {
  provider: string;
  key: string;
  type?: string;
  propertyType?: PropertyType;
  name: string,
  children: Record<string, SourceTreePreview>
};

export const selectSourceTree = createSelector(
  [selectProviderSources, selectSource],
  (sources, source) => {
    if (!sources || !source) {
      return undefined;
    }

    const getTree = (sourceKey: string): SourceTree => {
      const source = sources[sourceKey];
      const childrenSources: Record<string, SourceTree> = {};
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

export const selectSourceTreePreview = memoizeWithArgs(
  (state: RootState, provider: string, key: string) => {
    const sources = state.source.sources?.[provider];
    const source = sources?.[key];

    if (!sources || !source) {
      return undefined;
    }

    const getTree = (sourceKey: string): SourceTreePreview => {
      const source = sources[sourceKey];
      const children: Record<string, SourceTreePreview> = {};
      source.children.forEach((key) => {
        const childSource = sources[key];
        children[childSource.name] = getTree(key);
      });
      return {
        provider,
        key: sourceKey,
        type: source.type,
        propertyType: source.propertyType,
        name: source.name,
        children,
      };
    };

    return getTree(source.key);

  }
);
