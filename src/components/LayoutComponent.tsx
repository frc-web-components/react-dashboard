import { useEffect, useMemo } from "react";
import Styles from "./Components.module.scss";
import { useNt4 } from "@frc-web-components/react";
import useEntries from "./useEntries";

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

function LayoutComponent({ Component, properties }: Props) {
  const entryKeyMap = useMemo(() => {
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
  const entries = useEntries(entryKeyMap);

  const propValues = useMemo(() => {
    const values: Record<string, unknown> = {};
    Object.entries(properties).forEach(([name, prop]) => {
      values[name] = name in entries ? entries[name].value : prop.value;
    });
    return values;
  }, [properties, entries]);

  return <Component className={Styles["component-child"]} {...propValues} />;
}

export default LayoutComponent;
