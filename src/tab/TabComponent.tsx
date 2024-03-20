import { useCallback, useEffect, useMemo, useState } from "react";
import Styles from "./Tab.module.scss";
import useEntryListener from "./useEntryListener";
import { useNt4 } from "@frc-web-components/react";

interface Props {
  Component: React.ComponentType<any>;
  properties: {
    [name: string]: {
      value: unknown;
      source?: {
        provider: string;
        key: string;
      };
    };
  };
}

function capitalize(value: string) {
  if (value.length === 0) {
    return value;
  }
  return value[0].toUpperCase() + value.substring(1);
}

function TabComponent({ Component, properties }: Props) {

  const [defaultPropValues, setDefaultPropValues] = useState(
    Object.fromEntries(
      Object.entries(properties).map(([propName, prop]) => {
        return [propName, prop.value];
      })
    )
  );

  const [values, setValues] = useState(defaultPropValues);

  const { nt4Provider } = useNt4();

  const updateNtValue = useCallback((key: string, newValue: unknown) => {
    nt4Provider.userUpdate(key, newValue);
  }, []);


  // update values if defaults change
  useEffect(() => {
    const newDefaultValues = Object.fromEntries(
      Object.entries(properties).map(([propName, prop]) => {
        return [propName, prop.value];
      })
    );
    const updatedValues: Record<string, unknown> = {};
    Object.entries(newDefaultValues).forEach(([name, value]) => {
      if (value !== defaultPropValues[name]) {
        updatedValues[name] = value;
      }
    });
    if (Object.values(updatedValues).length === 0) {
      return;
    }
    setValues(current => ({
      ...current,
      ...updatedValues,
    }));
    setDefaultPropValues(newDefaultValues);
  }, [properties]);

  const keyListener = useCallback((prop: string, _: string, value: unknown) => {
    setValues(current => ({
      ...current,
      [prop]: value
    }));
  }, []);

  useEntryListener(properties, keyListener);
  
  const propSetters = useMemo(() => {
    const setters: Record<string, (value: unknown) => unknown> = {};
    Object.entries(properties).forEach(([prop, { source }]) => {
      setters[`set${capitalize(prop)}`] = (value: unknown) => {
        setValues(current => ({
          ...current,
          [prop]: value
        }));
        if (source) {
          updateNtValue(source.key, value);
        }
      };
    });
    return setters;
  }, [properties]);

  return <Component className={Styles["component-child"]} {...values} {...propSetters} />;
}

export default TabComponent;
