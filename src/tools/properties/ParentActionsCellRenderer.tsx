import { CustomCellRendererProps } from "ag-grid-react";
import { PropertyContext, PropertyData } from "./Properties";
import { useAppDispatch, useAppSelector } from "../../store/app/hooks";
import styles from "./ParentActionCellRenderer.module.scss";
import removeIcon from "/remove.svg";
import addCircleIcon from "/add-circle.svg";
import { useMemo } from "react";
import {
  makeSelectSelectedComponent,
  makeSelectSelectedComponentChildren,
  selectComponent,
} from "../../store/selectors/layoutSelectors";
import { useComponentConfigs } from "../../context-providers/ComponentConfigContext";
import { addComponent } from "../../store/slices/layoutSlice";
import { v4 as uuidv4 } from "uuid";

export const ParentActionsCellRenderer = (
  props: CustomCellRendererProps<
    PropertyData,
    any,
    Record<string, PropertyContext>
  >
) => {
  const dispatch = useAppDispatch();
  const { data } = props;
  const selectSelectedComponentChildren = useMemo(
    makeSelectSelectedComponentChildren,
    []
  );
  const selectSelectedComponent = useMemo(makeSelectSelectedComponent, []);
  const selectedComponent = useAppSelector(selectSelectedComponent);
  const selectedComponentChildren = useAppSelector(
    selectSelectedComponentChildren
  );
  const component = useAppSelector((state) =>
    selectComponent(state, data?.componentId)
  );
  const isSelectedComponent = selectedComponent?.id === data?.componentId;
  const { components } = useComponentConfigs();
  const childCount = useMemo(() => {
    if (!component || !selectedComponentChildren) {
      return 0;
    }
    console.log('...');
    return selectedComponentChildren.filter((child) => {
      return child.type === component.type;
    }).length;
  }, [selectedComponentChildren, component]);
  console.log('selectedComponentChildren:', {selectedComponentChildren, childCount, component});

  return (
    <div
      style={{
        display: "flex",
        position: "relative",
        width: "100%",
        alignItems: "stretch",
        height: "100%",
      }}
    >
      {!isSelectedComponent && (
        <button
          className={styles["action-buttons"]}
          style={{
            fontSize: "20px",
            lineHeight: "20px",
          }}
          onClick={() => {
            if (!data || !component) {
              return;
            }
            const componentConfig = components[component.type];

            const props: Record<string, { value: unknown }> = {};
            Object.entries(componentConfig.properties).forEach(
              ([name, prop]) => {
                props[name] = {
                  value: prop.defaultValue,
                };
              }
            );
            dispatch(
              addComponent({
                tabId: "",
                component: {
                  id: uuidv4(),
                  children: [],
                  minSize: { width: 0, height: 0 },
                  size: { width: 0, height: 0 },
                  position: { x: 0, y: 0 },
                  properties: props,
                  type: component.type,
                  name:
                    childCount > 0
                      ? `${componentConfig.dashboard.name} ${childCount + 1}`
                      : componentConfig.dashboard.name,
                  parent: selectedComponent?.id,
                },
              })
            );
          }}
        >
          <img src={addCircleIcon} />
        </button>
      )}
      <button
        className={styles["action-buttons"]}
        style={{
          fontSize: "20px",
          lineHeight: "20px",
        }}
        onClick={() => {
          // if (typeof props.data?.index === "number") {
          //   props.context.addElementAfter(props.data.index);
          // }
        }}
      >
        <img src={removeIcon} />
      </button>
    </div>
  );
};
