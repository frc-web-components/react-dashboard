import { useCallback, useEffect, useMemo, useState } from "react";
import Styles from "./Tab.module.scss";
import useEntryListener from "./useEntryListener";
import { useNt4 } from "@frc-web-components/react";
import { selectComponentPropertyValues as selectComponentPropertyData } from "../store/selectors/componentSelectors";
import { useAppSelector } from "../store/app/hooks";
import {
  SourceInfo,
  useSourceProvider,
} from "../context-providers/SourceProviderContext";

interface Props {
  componentId: string;
  Component: React.ComponentType<any>;
  componentSource?: {
    provider: string;
    key: string;
  };
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

function TabComponent({
  Component,
  properties,
  componentSource,
  componentId,
}: Props) {
  const componentPropertyData = useAppSelector((state) =>
    selectComponentPropertyData(state, componentId)
  );
  const { setSourceValue } = useSourceProvider();

  const { propertyValues, propertySourceInfos } = useMemo(() => {
    if (!componentPropertyData) {
      return {};
    }
    const values: Record<string, unknown> = {};
    const sourceInfos: Record<string, SourceInfo> = {};
    Object.entries(componentPropertyData).forEach(
      ([name, { value, sourceInfo }]) => {
        values[name] = value;
        sourceInfos[name] = sourceInfo;
      }
    );
    return {
      propertyValues: values,
      propertySourceInfos: sourceInfos,
    };
  }, [componentPropertyData]);

  console.log("componentPropertyValues:", componentPropertyData);

  // const [defaultPropValues, setDefaultPropValues] = useState(
  //   Object.fromEntries(
  //     Object.entries(properties).map(([propName, prop]) => {
  //       return [propName, prop.value];
  //     })
  //   )
  // );

  // const [values, setValues] = useState(defaultPropValues);

  // const { nt4Provider } = useNt4();

  // const updateNtValue = useCallback((key: string, newValue: unknown) => {
  //   nt4Provider.userUpdate(key, newValue);
  // }, []);

  // // update values if defaults change
  // useEffect(() => {
  //   const newDefaultValues = Object.fromEntries(
  //     Object.entries(properties).map(([propName, prop]) => {
  //       return [propName, prop.value];
  //     })
  //   );
  //   const updatedValues: Record<string, unknown> = {};
  //   Object.entries(newDefaultValues).forEach(([name, value]) => {
  //     if (value !== defaultPropValues[name]) {
  //       updatedValues[name] = value;
  //     }
  //   });
  //   if (Object.values(updatedValues).length === 0) {
  //     return;
  //   }
  //   setValues((current) => ({
  //     ...current,
  //     ...updatedValues,
  //   }));
  //   setDefaultPropValues(newDefaultValues);
  // }, [properties]);

  // const keyListener = useCallback((prop: string, _: string, value: unknown) => {
  //   setValues((current) => ({
  //     ...current,
  //     [prop]: value,
  //   }));
  // }, []);

  // useEntryListener(properties, keyListener);

  // const setProperty = useMemo(() => {
  //   const setter = (prop: string, value: unknown) => {
  //     setValues((current) => ({
  //       ...current,
  //       [prop]: value,
  //     }));
  //     const { source } = properties[prop];
  //     if (source) {
  //       updateNtValue(source.key, value);
  //     }
  //   };
  //   return setter;
  // }, [properties]);

  const newSetProperty = useCallback(
    (prop: string, value: unknown) => {
      if (propertySourceInfos) {
        setSourceValue(value, propertySourceInfos[prop]);
      }
    },
    [propertySourceInfos]
  );

  return (
    <Component
      className={Styles["component-child"]}
      {...propertyValues}
      setProperty={newSetProperty}
    />
  );
}

export default TabComponent;
