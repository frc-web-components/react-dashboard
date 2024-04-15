import camelCase from "lodash.camelcase";
import { memoizeWithArgs } from "proxy-memoize";
import { RootState } from "../app/store";
import { SourceInfo } from "../../context-providers/SourceProviderContext";

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
      const value = propertySource ? sourceValues[propertySource.provider][propertySource.key] : undefined;
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
            const value = sourceValues[matchingSource.provider][matchingSource.key];
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
