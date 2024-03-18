import { GridApi } from "ag-grid-community";
import React, { createContext, useContext, ReactNode, useState } from "react";
import { SourceData } from "../sources/Sources";

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
    type: string,
    [props: string]: unknown
  }
}

export interface DashboardComponent {
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
  };
  properties: Record<string, ComponentProperty>;
  component: React.ComponentType<any>;
}

// Interface for the context value
interface ComponentContextType {
  addComponent: (id: string, component: DashboardComponent) => unknown;
  addComponents: (components: Record<string, DashboardComponent>) => unknown;
  components: Record<string, DashboardComponent>;
  hasComponent: (id: string) => boolean;
}

// Create the context with a default value
const ComponentContext = createContext<ComponentContextType | undefined>(
  undefined
);

// Create a provider component
interface ProviderProps {
  children: ReactNode;
  components?: Record<string, DashboardComponent>
}

export const ComponentProvider: React.FC<ProviderProps> = ({
  children,
  components: initialComponents = {}
}) => {
  const [components, setComponents] = useState<Record<string, DashboardComponent>>(initialComponents);

  const hasComponent = (id: string) => {
    return id in components;
  };

  const addComponent = (id: string, component: DashboardComponent) => {
    setComponents(currentComponents => ({
      ...currentComponents,
      [id]: component
    }));
  };
  
  const addComponents = (newComponents: Record<string, DashboardComponent>) => {
    setComponents(currentComponents => ({
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
    <ComponentContext.Provider value={value}>
      {children}
    </ComponentContext.Provider>
  );
};

// Hook for consuming the context in components
export const useComponents = (): ComponentContextType => {
  const context = useContext(ComponentContext);
  if (context === undefined) {
    throw new Error("useComponents must be used within a ComponentProvider");
  }
  return context;
};
