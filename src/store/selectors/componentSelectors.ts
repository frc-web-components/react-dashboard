import { createSelector } from "@reduxjs/toolkit";
import { selectComponent } from "./layoutSelectors";
import { selectProviderSources } from "./sourceSelectors";

import camelCase from 'lodash.camelcase';
import { memoize, memoizeWithArgs } from "proxy-memoize";
import { RootState } from "../app/store";


export const selectComponentPropertyValues = memoizeWithArgs((state: RootState, componentId: string) => {
    const component = state.layout.components[componentId];
    const sources = state.source.sources;
    if (!component) {
        return undefined;
    }
    const parentSource = component.source ? sources[component.source.provider]?.[component.source.key] : undefined;
    const propertyValues: Record<string, unknown> = {};
    Object.entries(component.properties).forEach(([name, property]) => {
        const defaultValue = property.value;
        const sourceValue = property.source ? sources[property.source.provider]?.[property.source.key] : undefined;
        if (sourceValue) {
            propertyValues[name] = sourceValue.value;
        } else if (parentSource) {
            if (parentSource.children.length > 0) {
                const matchingSource = parentSource.children.map(sourceId => sources[parentSource.provider][sourceId]).find(source => {
                    return name === camelCase(source.name);
                });
                propertyValues[name] = matchingSource ? matchingSource.value : defaultValue;
            } else if (parentSource.propertyType === 'Object' && name in (parentSource.value as any)) {
                propertyValues[name] = (parentSource.value as any)[name];
            } else {
                propertyValues[name] = defaultValue;
            }
        } else {
            propertyValues[name] = defaultValue;
        }
    });
    return propertyValues;
});

// const selectComponentPropertyValues = createSelector(
//     [selectComponent, selectProviderSources],
//     (a, b) => {

//     }
// )


