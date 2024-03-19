import GridLayout, { Layout } from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import classNames from "classnames";
import Styles from "./Components.module.scss";
import { useEffect, useMemo, useState } from "react";
import { useAppDispatch, useAppSelector } from "../store/app/hooks";
import {
  selectSelectedComponentId,
  setSelectedComponent,
  selectComponents,
  addComponent,
  updateComponentPosition,
  updateComponentSize,
} from "../store/slices/layoutSlice";
import { useDropZone } from "../context-providers/DropZoneContext";
import { RowDropZoneParams, RowDragEndEvent } from "ag-grid-community";
import { useComponents } from "../context-providers/ComponentContext";
import { v4 as uuidv4 } from "uuid";
import { ComponentListItem } from "./ComponentList";
import LayoutComponent from "./LayoutComponent";
import { selectEditing } from "../store/slices/appSlice";

interface ComponentLayout extends Layout {
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

interface Props {
  tabId: string;
}

function Components({ tabId }: Props) {
  const dispatch = useAppDispatch();
  const selectedComponentId = useAppSelector(selectSelectedComponentId);
  const layoutComponents = useAppSelector((state) =>
    selectComponents(state, tabId)
  );
  const { components } = useComponents();
  const editing = useAppSelector(selectEditing);
  const { componentGrid } = useDropZone(); // Use the context
  const [gridElement, setGridElement] = useState<HTMLElement>();
  const [cellSize, setCellSize] = useState(30);
  const [cellGap, setCellGap] = useState(5);

  // layout is an array of objects, see the demo for more complete usage
  // const [layout, setLayout] = useState<ComponentLayout[]>([]);

  const gridLayout = useMemo(() => {
    const layout: ComponentLayout[] = Object.values(layoutComponents ?? {}).map(
      (item) => {
        return {
          Component: components[item.type].component,
          i: item.id,
          w: item.size.width,
          h: item.size.height,
          x: item.position.x,
          y: item.position.y,
          minW: item.minSize.width,
          minH: item.minSize.height,
          properties: item.properties,
        };
      }
    );
    return layout.map((item) => ({
      ...item,
      static: !editing,
    }));
  }, [layoutComponents, editing]);

  const minWidth = useMemo(() => {
    let maxX = 0;
    gridLayout.forEach((item) => {
      const x = (item.x + item.w) * (cellSize + cellGap);
      maxX = Math.max(x, maxX);
    });
    return maxX;
  }, [gridLayout]);

  useEffect(() => {
    if (componentGrid && gridElement) {
      const dropZoneParms: RowDropZoneParams = {
        getContainer() {
          return gridElement;
        },
        onDragging(params) {
          // params.event
        },
        onDragStop({ node, event }: RowDragEndEvent<ComponentListItem>) {
          if (!node.data) {
            return;
          }
          const {
            dashboard: { defaultSize, minSize },
            type,
            properties,
          } = node.data;
          const { clientX, clientY } = event;
          const minWidth = Math.ceil(minSize.width / (cellSize + cellGap));
          const minHeight = Math.ceil(minSize.height / (cellSize + cellGap));
          const width = Math.max(
            minWidth,
            Math.round(defaultSize.width / (cellSize + cellGap))
          );
          const height = Math.max(
            minHeight,
            Math.round(defaultSize.height / (cellSize + cellGap))
          );
          const rect = gridElement.getBoundingClientRect();
          const x = Math.round((clientX - rect.left) / (cellSize + cellGap));
          const y = Math.round((clientY - rect.top) / (cellSize + cellGap));
          const props: Record<string, { value: unknown }> = {};
          Object.entries(properties).forEach(([name, prop]) => {
            props[name] = {
              value: prop.defaultValue,
            };
          });
          dispatch(
            addComponent({
              tabId,
              component: {
                id: uuidv4(),
                children: [],
                minSize: { width: minWidth, height: minHeight },
                size: { width, height },
                position: { x, y },
                properties: props,
                type,
              },
            })
          );
        },
      };
      componentGrid.addRowDropZone(dropZoneParms);
    }
  }, [gridElement, componentGrid]);

  return (
    <GridLayout
      style={{
        minHeight: "100%",
        minWidth,
      }}
      innerRef={(el) => {
        if (el) {
          setGridElement(el);
        }
      }}
      onResizeStop={(updatedLayout, oldItem, newItem) => {
        const { w, h, i } = newItem;
        dispatch(
          updateComponentSize({
            tabId,
            id: i,
            width: w,
            height: h,
          })
        );
        // setLayout(updatedLayout as ComponentLayout[]);
      }}
      onDragStop={(updatedLayout, oldItem, newItem) => {
        const { x, y, i } = newItem;
        dispatch(
          updateComponentPosition({
            tabId,
            id: i,
            x,
            y,
          })
        );
      }}
      className={classNames(Styles.layout, {
        [Styles.editable]: editing,
      })}
      layout={gridLayout}
      cols={20000}
      rowHeight={cellSize}
      width={(cellSize + cellGap) * 20000}
      margin={[5, 5]}
      autoSize
      compactType={null}
      preventCollision
      resizeHandles={["ne", "nw", "se", "sw", "s", "e", "w", "n"]}
      onDragStart={(layout, oldItem, newItem) => {
        dispatch(setSelectedComponent(newItem.i));
      }}
    >
      {gridLayout.map(({ i: id, Component, properties }) => {
        return (
          <div
            key={id}
            className={classNames(Styles.component, {
              [Styles.selected]: selectedComponentId === id,
            })}
          >
            <LayoutComponent Component={Component} properties={properties} />
          </div>
        );
      })}
    </GridLayout>
  );
}

export default Components;
