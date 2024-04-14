import { GridApi } from "ag-grid-community";
import React, {
  createContext,
  useContext,
  ReactNode,
  useState,
  useMemo,
} from "react";
import { SourceData } from "../tools/sources/Sources";
import { ComponentConfig } from "./ComponentConfigContext";
import { SourceInfo } from "./SourceProviderContext";
import { useAppSelector } from "../store/app/hooks";
import { selectComponent } from "../store/selectors/layoutSelectors";
import {
  SourceTree,
  selectSourceTree,
} from "../store/selectors/sourceSelectors";

// Interface for the context value
interface ComponentContextType {
  propertySourceInfos?: Record<string, SourceInfo>;
  componentId: string;
}

// Create the context with a default value
const ComponentContext = createContext<ComponentContextType | undefined>(
  undefined
);

// Create a provider component
interface ProviderProps {
  children: ReactNode;
  propertySourceInfos?: Record<string, SourceInfo>;
  componentId: string;
}

export const ComponentProvider: React.FC<ProviderProps> = ({
  children,
  propertySourceInfos,
  componentId,
}) => {
  // The value that will be given to the context consumers
  const value = {
    propertySourceInfos,
    componentId,
  };

  return (
    <ComponentContext.Provider value={value}>
      {children}
    </ComponentContext.Provider>
  );
};

// Hook for consuming the context in components
export const useComponent = (): ComponentContextType => {
  const context = useContext(ComponentContext);
  if (context === undefined) {
    throw new Error("useComponent must be used within a ComponentProvider");
  }
  return context;
};

export const useParentSourceTree = (): SourceTree | undefined => {
  const context = useContext(ComponentContext);
  if (context === undefined) {
    throw new Error("useComponent must be used within a ComponentProvider");
  }
  const { componentId } = context;
  const component = useAppSelector((state) =>
    selectComponent(state, componentId)
  );
  return useAppSelector((state) =>
    selectSourceTree(state, component.source?.provider, component.source?.key)
  );
};

function treeToJson(tree: SourceTree): Record<string, unknown> | unknown {
  if (Object.keys(tree.childrenSources).length === 0) {
    return tree.value;
  }

  const json: Record<string, unknown> = {};
  Object.values(tree.childrenSources).forEach((child) => {
    json[child.name] = treeToJson(child);
  });
}

export const useParentSourceJson = ():
  | Record<string, unknown>
  | undefined
  | unknown => {
  const sourceTree = useParentSourceTree();

  return useMemo(() => {
    if (!sourceTree) {
      return undefined;
    }
    return treeToJson(sourceTree);
  }, [sourceTree]);
};
