import { ReactNode } from "react";
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
  children: ReactNode;
};

export function createComponent<P extends Record<string, ComponentProperty>>(
  {
    dashboard,
    children,
    defaultSource,
    primaryProperty,
    properties,
    acceptedSourceTypes,
  }: {
    dashboard: ComponentConfig["dashboard"];
    children?: ComponentConfig["children"];
    defaultSource?: ComponentConfig["defaultSource"];
    primaryProperty?: string;
    properties: P;
    acceptedSourceTypes?: string[];
  },
  component: React.ComponentType<FromProps<P>>
): ComponentConfig {
  return {
    dashboard,
    children,
    defaultSource,
    primaryProperty,
    properties,
    acceptedSourceTypes,
    component,
  };
}

export function numberProp(prop?: {
  defaultValue?: number;
  min?: number;
  max?: number;
  step?: number;
  precision?: number;
}): {
  type: "Number";
  defaultValue: number;
  input: {
    type: "Number";
    min?: number;
    max?: number;
    step?: number;
    precision?: number;
  };
} {
  return {
    type: "Number",
    defaultValue: prop?.defaultValue ?? 0,
    input: {
      type: "Number",
      min: prop?.min,
      max: prop?.max,
      step: prop?.step,
      precision: prop?.precision,
    },
  };
}

export function stringProp(prop?: { defaultValue?: string }): {
  type: "String";
  defaultValue: string;
} {
  return {
    type: "String",
    defaultValue: prop?.defaultValue ?? "",
  };
}

export function stringDropdownProp(prop?: {
  defaultValue?: string;
  options?: string[] | ((propValues: Record<string, any>) => string[]);
  allowCustomValues?: boolean;
}): {
  type: "String";
  defaultValue: string;
  input: {
    type: "StringDropdown";
    options: string[] | ((propValues: Record<string, any>) => string[]);
    allowCustomValues: boolean;
  };
} {
  return {
    type: "String",
    defaultValue: prop?.defaultValue ?? "",
    input: {
      type: "StringDropdown",
      options: prop?.options ?? [],
      allowCustomValues: prop?.allowCustomValues ?? false,
    },
  };
}

export function colorProp(prop?: { defaultValue?: string }): {
  type: "String";
  defaultValue: string;
  input: {
    type: "Color";
  };
} {
  return {
    type: "String",
    defaultValue: prop?.defaultValue ?? "",
    input: {
      type: "Color",
    },
  };
}

export function markdownProp(prop?: { defaultValue?: string }): {
  type: "String";
  defaultValue: string;
  input: {
    type: "Markdown";
  };
} {
  return {
    type: "String",
    defaultValue: prop?.defaultValue ?? "",
    input: {
      type: "Markdown",
    },
  };
}

export function booleanProp(prop?: { defaultValue?: boolean }): {
  type: "Boolean";
  defaultValue: boolean;
} {
  return {
    type: "Boolean",
    defaultValue: prop?.defaultValue ?? false,
  };
}

export function numberArrayProp(prop?: { defaultValue?: number[] }): {
  type: "Number[]";
  defaultValue: number[];
} {
  return {
    type: "Number[]",
    defaultValue: prop?.defaultValue ?? [],
  };
}

export function stringArrayProp(prop?: { defaultValue?: string[] }): {
  type: "String[]";
  defaultValue: string[];
} {
  return {
    type: "String[]",
    defaultValue: prop?.defaultValue ?? [],
  };
}
