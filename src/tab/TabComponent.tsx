import { useCallback, useMemo } from "react";
import Styles from "./Tab.module.scss";
import { makeSelectComponentPropertyValues } from "../store/selectors/componentSelectors";
import { useAppSelector } from "../store/app/hooks";
import {
  SourceInfo,
  useSourceProvider,
} from "../context-providers/SourceProviderContext";
import { ComponentProvider } from "../context-providers/ComponentContext";

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

function TabComponent({
  Component,
  properties,
  componentSource,
  componentId,
}: Props) {
  const selectComponentPropertyData = useMemo(makeSelectComponentPropertyValues, []);
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

  const newSetProperty = useCallback(
    (prop: string, value: unknown) => {
      if (propertySourceInfos) {
        setSourceValue(value, propertySourceInfos[prop]);
      }
    },
    [propertySourceInfos]
  );

  return (
    <ComponentProvider componentId={componentId} propertySourceInfos={propertySourceInfos}>
      <Component
        className={Styles["component-child"]}
        {...propertyValues}
        setProperty={newSetProperty}
      />
    </ComponentProvider>
  );
}

export default TabComponent;
