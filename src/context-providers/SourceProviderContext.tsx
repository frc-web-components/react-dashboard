import React, {
  createContext,
  useContext,
  ReactNode,
  useCallback,
} from "react";
import { NT4Provider } from "../store/sources/nt4";
import { store } from "../store/app/store";
import {
  selectSource,
  selectSourceValue,
} from "../store/selectors/sourceSelectors";
import SourceProvider from "../store/sources/nt4/source-provider";

export type SourceInfo =
  | {
      type: "source";
      source: {
        provider: string;
        key: string;
      };
    }
  | {
      type: "sourceProperty";
      source: {
        provider: string;
        key: string;
        property: string;
      };
    }
  | {
      type: "defaultValue";
    };

// Interface for the context value
interface SourceProviderContextType {
  providers: Record<string, SourceProvider>;
  setSourceValue: (value: unknown, sourceInfo: SourceInfo) => unknown;
}

// Create the context with a default value
const SourceProviderContext = createContext<
  SourceProviderContextType | undefined
>(undefined);

// Create a provider component
interface ProviderProps {
  children: ReactNode;
}

const providers: Record<string, SourceProvider> = {
  NT: new NT4Provider(store),
};

export const SourceProviderProvider: React.FC<ProviderProps> = ({
  children,
}) => {
  const setSourceValue = useCallback(
    (value: unknown, sourceInfo: SourceInfo) => {
      if (sourceInfo.type === "source") {
        const source = selectSource(
          store.getState(),
          sourceInfo.source.provider,
          sourceInfo.source.key
        )!;
        const provider = providers[sourceInfo.source.provider];
        if (provider) {
          provider.componentUpdate(sourceInfo.source.key, value, source.type!);
        }
      } else if (sourceInfo.type === "sourceProperty") {
        const source = selectSource(
          store.getState(),
          sourceInfo.source.provider,
          sourceInfo.source.key
        )!;
        const sourceValue = selectSourceValue(
          store.getState(),
          sourceInfo.source.provider,
          sourceInfo.source.key
        );
        const provider = providers[sourceInfo.source.provider];
        if (provider) {
          const property = sourceInfo.source.property;
          const newValue = {
            ...(sourceValue as any),
            [property]: value,
          };
          provider.componentUpdate(
            sourceInfo.source.key,
            newValue,
            source.type!
          );
        }
      }
    },
    [providers]
  );

  // The value that will be given to the context consumers
  const value = {
    providers,
    setSourceValue,
  };

  return (
    <SourceProviderContext.Provider value={value}>
      {children}
    </SourceProviderContext.Provider>
  );
};

// Hook for consuming the context in components
export const useSourceProvider = (): SourceProviderContextType => {
  const context = useContext(SourceProviderContext);
  if (context === undefined) {
    throw new Error(
      "useSourceProvider must be used within a SourceProviderProvider"
    );
  }
  return context;
};
