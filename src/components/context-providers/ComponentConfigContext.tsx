import React, { createContext, useContext, ReactNode, useState, useEffect } from "react";
import Dashboard from "@/dashboard";

export interface ComponentProperty {
  type:
    | "Number"
    | "String"
    | "Boolean"
    | "Object"
    | "Number[]"
    | "String[]"
    | "Boolean[]"
    | "Object[]";
  defaultValue: unknown;
  input?: {
    type: string;
    [props: string]: unknown;
  };
  tooltip?: string;
}

export interface ChildComponentConfig {
  type: string;
  propertyTabName?: string;
}

export interface ComponentConfig {
  dashboard: {
    name: string;
    description: string;
    defaultSize: {
      width: number;
      height: number;
    };
    minSize: {
      width: number;
      height: number;
    };
    topLevel?: boolean;
    children?: {
      type: string;
      name: string;
      properties?: Record<string, unknown>;
    }[];
  };
  defaultSource?: {
    key: string;
    provider: string;
  };
  acceptedSourceTypes?: string[];
  primaryProperty?: string;
  properties: Record<string, ComponentProperty>;
  component: React.ComponentType<any>;
  children?: ChildComponentConfig[];
}

// Interface for the context value
interface ComponentConfigContextType {
  addComponent: (id: string, component: ComponentConfig) => unknown;
  addComponents: (components: Record<string, ComponentConfig>) => unknown;
  components: Record<string, ComponentConfig>;
  hasComponent: (id: string) => boolean;
}

// Create the context with a default value
const ComponentConfigContext = createContext<
  ComponentConfigContextType | undefined
>(undefined);

// Create a provider component
interface ProviderProps {
  children: ReactNode;
  dashboard: Dashboard;
}

export const ComponentConfigProvider: React.FC<ProviderProps> = ({
  children,
  dashboard,
}) => {
  const [components, setComponents] =
    useState<Record<string, ComponentConfig>>(dashboard.getComponents());

  useEffect(() => {
    dashboard.on('addComponentsEvent', () => {
      setComponents(dashboard.getComponents());
    });
  }, [dashboard]);

  const hasComponent = (id: string) => {
    return id in components;
  };

  const addComponent = (id: string, component: ComponentConfig) => {
    setComponents((currentComponents) => ({
      ...currentComponents,
      [id]: component,
    }));
  };

  const addComponents = (newComponents: Record<string, ComponentConfig>) => {
    setComponents((currentComponents) => ({
      ...currentComponents,
      ...newComponents,
    }));
  };

  // The value that will be given to the context consumers
  const value = {
    hasComponent,
    components: { ...components },
    addComponent,
    addComponents,
  };

  return (
    <ComponentConfigContext.Provider value={value}>
      {children}
    </ComponentConfigContext.Provider>
  );
};

// Hook for consuming the context in components
export const useComponentConfigs = (): ComponentConfigContextType => {
  const context = useContext(ComponentConfigContext);
  if (context === undefined) {
    throw new Error("useComponents must be used within a ComponentProvider");
  }
  return context;
};