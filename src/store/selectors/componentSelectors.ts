import camelCase from "lodash.camelcase";
import { memoizeWithArgs } from "proxy-memoize";
import { RootState, store } from "../app/store";
import { SourceInfo } from "../../context-providers/SourceProviderContext";
import { useCallback, useEffect, useRef } from "react";
import { Source } from "../slices/sourceSlice";
import { Component } from "../slices/layoutSlice";

export function useComponentPropertyValues(componentId: string) {
  const prevComponent = useRef<Component>();
  const prevSources = useRef<Record<string, Source>>({});
  const prevValues = useRef<Record<string, unknown>>({});
  const prevParentSource = useRef<Source>();
  const prevParentValue = useRef<unknown>();

  const hasChanged = useCallback(() => {
    const sourceState = store.getState().source;
    const layoutState = store.getState().layout;

    const component = layoutState.components[componentId];

    if (component !== prevComponent.current) {
      return true;
    }

    const sources = sourceState.sources;
    const sourceValues = sourceState.sourceValues;

    const parentSource = component.source
      ? sources[component.source.provider]?.[component.source.key]
      : undefined;
    const parentSourceValue = component.source
      ? sourceValues[component.source.provider]?.[component.source.key]
      : undefined;

    if (
      parentSource !== prevParentSource.current ||
      parentSourceValue !== prevParentValue.current
    ) {
      return true;
    }
  }, [componentId]);

  useEffect(() => {
    const unsubscribe = store.subscribe(() => {
      const sourceState = store.getState().source;
      const layoutState = store.getState().layout;

      const component = layoutState.components[componentId];
      const sources = sourceState.sources;
      const sourceValues = sourceState.sourceValues;

      const parentSource = component.source
        ? sources[component.source.provider]?.[component.source.key]
        : undefined;
      const parentSourceValue = component.source
        ? sourceValues[component.source.provider]?.[component.source.key]
        : undefined;

      for (const [name, property] of Object.entries(component.properties)) {
        const propertySource = property.source
          ? sources[property.source.provider]?.[property.source.key]
          : undefined;
        const value = propertySource
          ? sourceValues[propertySource.provider][propertySource.key]
          : undefined;

        
      }
    });
    return unsubscribe;
  }, [componentId]);
}

export function makeSelectComponentPropertyValues() {
  return memoizeWithArgs((state: RootState, componentId: string) => {
    const component = state.layout.components[componentId];
    const sources = state.source.sources;
    const sourceValues = state.source.sourceValues;
    if (!component) {
      return undefined;
    }
    const parentSource = component.source
      ? sources[component.source.provider]?.[component.source.key]
      : undefined;
    const parentSourceValue = component.source
      ? sourceValues[component.source.provider]?.[component.source.key]
      : undefined;
    const propertyValues: Record<
      string,
      {
        value: unknown;
        sourceInfo: SourceInfo;
      }
    > = {};
    Object.entries(component.properties).forEach(([name, property]) => {
      const defaultValue = property.value;
      const propertySource = property.source
        ? sources[property.source.provider]?.[property.source.key]
        : undefined;
      const value = propertySource
        ? sourceValues[propertySource.provider][propertySource.key]
        : undefined;
      if (propertySource) {
        propertyValues[name] = {
          value,
          sourceInfo: {
            type: "source",
            source: {
              key: property.source!.key,
              provider: property.source!.provider,
            },
          },
        };
      } else if (parentSource) {
        if (parentSource.children.length > 0) {
          const matchingSource = parentSource.children
            .map((sourceId) => sources[parentSource.provider][sourceId])
            .find((source) => {
              return name === camelCase(source.name);
            });
          if (matchingSource) {
            const value =
              sourceValues[matchingSource.provider][matchingSource.key];
            propertyValues[name] = {
              value,
              sourceInfo: {
                type: "source",
                source: {
                  provider: matchingSource.provider,
                  key: matchingSource.key,
                },
              },
            };
          } else {
            propertyValues[name] = {
              value: defaultValue,
              sourceInfo: {
                type: "defaultValue",
              },
            };
          }
        } else if (
          parentSource.propertyType === "Object" &&
          name in (parentSourceValue as any)
        ) {
          propertyValues[name] = {
            value: (parentSourceValue as any)[name],
            sourceInfo: {
              type: "sourceProperty",
              source: {
                provider: parentSource.provider,
                key: parentSource.key,
                property: name,
              },
            },
          };
        } else {
          propertyValues[name] = {
            value: defaultValue,
            sourceInfo: {
              type: "defaultValue",
            },
          };
        }
      } else {
        propertyValues[name] = {
          value: defaultValue,
          sourceInfo: {
            type: "defaultValue",
          },
        };
      }
    });
    return propertyValues;
  });
}
