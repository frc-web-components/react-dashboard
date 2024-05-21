import { useCallback, useMemo } from "react";
import Styles from "./Tab.module.scss";
import { useComponentPropertyValues } from "../store/selectors/componentSelectors";
import { useAppDispatch, useAppSelector } from "../store/app/hooks";
import {
  SourceInfo,
  useSourceProvider,
} from "../context-providers/SourceProviderContext";
import { ComponentProvider } from "../context-providers/ComponentContext";
import { useComponentConfigs } from "../context-providers/ComponentConfigContext";
import { memoizeWithArgs } from "proxy-memoize";
import { RootState } from "../store/app/store";
import { setComponentTemporaryValue } from "../store/slices/layoutSlice";

export function makeSelectChildren() {
  return memoizeWithArgs((state: RootState, componentId: string) => {
    const children = state.layout.components[componentId]?.children;
    if (!children) {
      return [];
    }
    return children.map((id) => ({
      id,
      type: state.layout.components[id]?.type,
    }));
  });
}

interface Props {
  componentId: string;
  Component: React.ComponentType<any>;
}

function TabComponent({ Component, componentId }: Props) {
  const dispatch = useAppDispatch();
  const selectChildren = useMemo(makeSelectChildren, []);
  const componentPropertyData = useComponentPropertyValues(componentId);

  const { setSourceValue } = useSourceProvider();
  const { components } = useComponentConfigs();
  const childComponents = useAppSelector((state) =>
    selectChildren(state, componentId)
  );

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
        if (propertySourceInfos[prop].type === "defaultValue") {
          console.log("Set prop:", {
            prop,
            value,
            info: propertySourceInfos[prop],
          });
          dispatch(
            setComponentTemporaryValue({
              id: componentId,
              property: prop,
              value,
            })
          );
        } else {
          setSourceValue(value, propertySourceInfos[prop]);
        }
      }
    },
    [propertySourceInfos]
  );

  return (
    <ComponentProvider
      componentId={componentId}
      propertySources={propertySourceInfos}
    >
      <Component
        className={Styles["component-child"]}
        {...propertyValues}
        setProperty={newSetProperty}
      >
        {childComponents.map((child) => {
          return (
            <TabComponent
              key={child.id}
              componentId={child.id}
              Component={components[child.type].component}
            />
          );
        })}
      </Component>
    </ComponentProvider>
  );
}

export default TabComponent;
