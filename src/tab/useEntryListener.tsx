import { useMemo } from "react";
import useKeyListeners from "./useKeyListeners";

export function useEntryListener(properties: {
  [name: string]: {
    value: unknown;
    source?: {
      provider: string;
      key: string;
    };
  };
}, listener: (prop: string, key: string, newValue: unknown) => unknown) {
  const map = useMemo(() => {
    const keyMap: Record<
      string,
      {
        key: string;
        defaultValue: unknown;
      }
    > = {};
    Object.entries(properties).forEach(([prop, { source, value }]) => {
      if (!source) {
        return;
      }
      keyMap[prop] = {
        key: source.key,
        defaultValue: value,
      };
    });
    return keyMap;
  }, [properties]);

  const propKeys = useMemo(() => {
    return Object.fromEntries(
      Object.entries(map).map(([prop, { key }]) => {
        return [prop, key];
      })
    );
  }, [map]);

  useKeyListeners(propKeys, listener, true);
}

export default useEntryListener;
