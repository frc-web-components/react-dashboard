import { ComponentProperty } from "../context-providers/ComponentConfigContext";
import { ComponentConfig } from "../context-providers/ComponentConfigContext";

// Define a mapping from your string literals to TypeScript types
type TypeMappings = {
  Number: number;
  String: string;
  Boolean: boolean;
  Object: Record<string, unknown>;
  "Number[]": number[];
  "String[]": string[];
  "Boolean[]": boolean[];
  "Object[]": Record<string, unknown>[];
  // add other type mappings as needed
};

// A helper type that will convert your props structure into a TypeScript type
export type FromProps<T extends Record<string, ComponentProperty>> = {
  [P in keyof T]: T[P] extends { type: infer U }
    ? U extends keyof TypeMappings
      ? TypeMappings[U]
      : never
    : never;
} & {
  className: string;
  setProperty: (property: string, value: unknown) => unknown;
};

export function createComponent<P extends Record<string, ComponentProperty>>(
  {
    dashboard,
    properties,
  }: { dashboard: ComponentConfig["dashboard"]; properties: P },
  component: React.ComponentType<FromProps<P>>
): ComponentConfig {
  return {
    dashboard,
    properties,
    component,
  };
}
