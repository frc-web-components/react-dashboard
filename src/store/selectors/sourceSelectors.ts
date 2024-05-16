import { RootState, store } from "../app/store";
import { createSelector } from "@reduxjs/toolkit";
import { Source, SourceMetadata } from "../slices/sourceSlice";
import { useCallback, useEffect, useRef, useState } from "react";

export const selectSources = (state: RootState) => state.source.sources;

export const selectProviderSources = (state: RootState, provider?: string) =>
  typeof provider === "undefined" ? undefined : state.source.sources[provider];

export const selectProviderMetadata = (state: RootState, provider?: string) =>
  typeof provider === "undefined" ? undefined : state.source.metadata[provider];

export const selectSourcetMetadata = (
  state: RootState,
  provider?: string,
  key?: string
) =>
  typeof provider === "undefined" || typeof key === "undefined"
    ? undefined
    : state.source.metadata[provider]?.[key];

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
  metadata?: SourceMetadata;
}

export function useSourceTree(provider?: string, key?: string) {
  const prevSources = useRef<Record<string, Source>>({});
  const prevValues = useRef<Record<string, unknown>>({});

  const [tree, setTree] = useState<SourceTree>();

  const getTree = useCallback((sourceKey: string): SourceTree => {
    const source = prevSources.current[sourceKey];
    const value = prevValues.current[sourceKey];
    const childrenSources: Record<string, SourceTree> = {};
    source.children.forEach((key) => {
      const childSource = prevSources.current[key];
      childrenSources[childSource.name] = getTree(key);
    });
    return {
      ...source,
      value,
      childrenSources,
    };
  }, []);

  useEffect(() => {
    const unsubscribe = store.subscribe(() => {
      const sourceState = store.getState().source;
      const newValues = provider
        ? sourceState.sourceValues[provider] ?? {}
        : {};
      const newSources = provider ? sourceState.sources[provider] ?? {} : {};
      const newKeys = Object.keys(newSources).filter(
        (k) => k === key || k.startsWith(key + "/")
      );

      const prevKeys = new Set(Object.keys(prevSources.current));

      let hasChanged = false;
      for (const newKey of newKeys) {
        prevKeys.delete(newKey);
        if (
          newValues[newKey] !== prevValues.current[newKey] ||
          newSources[newKey] !== prevSources.current[newKey]
        ) {
          hasChanged = true;
          break;
        }
      }

      if (prevKeys.size > 0) {
        hasChanged = true;
      }

      if (hasChanged) {
        const sources: Record<string, Source> = {};
        const values: Record<string, unknown> = {};
        newKeys.forEach((newKey) => {
          sources[newKey] = newSources[newKey];
          values[newKey] = newValues[newKey];
        });
        prevSources.current = sources;
        prevValues.current = values;

        setTree(key ? getTree(key) : undefined);
      }
    });
    return unsubscribe;
  }, [provider, key]);

  return tree;
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
    [selectProviderSources, selectSource, selectProviderMetadata],
    (sources, source, metadata) => {
      if (!sources || !source) {
        return undefined;
      }

      const getTree = (sourceKey: string): SourceTreePreview => {
        const source = sources[sourceKey];
        const childrenSources: Record<string, SourceTreePreview> = {};
        source.children.forEach((key) => {
          const childSource = sources[key];
          childrenSources[childSource.name] = getTree(key);
        });
        return {
          ...source,
          metadata: metadata?.[sourceKey],
          childrenSources,
        };
      };

      return getTree(source.key);
    }
  );
}
