import { useState, useCallback, useMemo } from "react";
import useKeyListeners from "./useKeyListeners";
import { useNt4 } from "@frc-web-components/react";

export function useEntries(
  map: Record<
    string,
    {
      key: string;
      defaultValue: unknown;
    }
  >
): Record<
  string,
  {
    value: unknown;
    setValue: (newValue: unknown) => void;
  }
> {
  const { nt4Provider } = useNt4();

  // maps props to values
  const [values, setValues] = useState<Record<string, unknown>>(
    Object.fromEntries(
      Object.entries(map).map(([prop, { defaultValue }]) => {
        return [prop, defaultValue];
      })
    )
  );

  const updateNtValue = useCallback((key: string, newValue: unknown) => {
    nt4Provider.userUpdate(key, newValue);
  }, []);

  const propKeys = useMemo(() => {
    return Object.fromEntries(
      Object.entries(map).map(([prop, { key }]) => {
        return [prop, key];
      })
    );
  }, [map]);

  const setValuesCallback = useCallback((prop: string, _: string, newValue: unknown) => {
    setValues((currentValues) => {
      return {
        ...currentValues,
        [prop]: newValue === undefined ? map[prop].defaultValue : newValue,
      };
    });
  }, [map]);

  useKeyListeners(
    propKeys,
    setValuesCallback,
    true
  );

  return useMemo(() => {
    const entries: Record<
      string,
      { value: unknown; setValue: (newValue: unknown) => void }
    > = {};
    Object.entries(map).forEach(([prop, { key }]) => {
      entries[prop] = {
        value: values[prop],
        setValue: (newValue: unknown) => {
          updateNtValue(key, newValue);
        }
      };
    });
    return entries;
  }, [map, values]);

}

export default useEntries;
