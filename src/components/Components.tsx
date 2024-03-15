import GridLayout, { Layout } from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import classNames from "classnames";
import Styles from "./Components.module.scss";
import { useEffect, useMemo, useState } from "react";
import { Gyro, BasicFmsInfo, Field } from "@frc-web-components/react";
import { useAppDispatch, useAppSelector } from "../store/app/hooks";
import {
  selectSelectedComponentId,
  setSelectedComponent,
} from "../store/slices/layoutSlice";
import { useDropZone } from "../context-providers/DropZoneContext";
import { RowDropZoneParams, RowDragEndEvent } from "ag-grid-community";
import { DashboardComponent } from "./interfaces";
import { v4 as uuidv4 } from "uuid";

interface ComponentLayout extends Layout {
  Component: React.ComponentType<any>;
}

function Components() {
  const dispatch = useAppDispatch();
  const selectedComponentId = useAppSelector(selectSelectedComponentId);
  const [editing, setEditing] = useState(true);
  const { componentGrid } = useDropZone(); // Use the context
  const [gridElement, setGridElement] = useState<HTMLElement>();
  const [cellSize, setCellSize] = useState(30);
  const [cellGap, setCellGap] = useState(5);

  // layout is an array of objects, see the demo for more complete usage
  const [layout, setLayout] = useState<ComponentLayout[]>([]);

  const gridLayout = useMemo(() => {
    return layout.map((item) => ({
      ...item,
      static: !editing,
    }));
  }, [layout, editing]);

  const minWidth = useMemo(() => {
    let maxX = 0;
    layout.forEach((item) => {
      const x = (item.x + item.w) * (cellSize + cellGap);
      maxX = Math.max(x, maxX);
    });
    const width = gridElement?.parentElement?.scrollWidth ?? 0;
    console.log("width:", maxX);
    return maxX;
  }, [layout]);

  useEffect(() => {
    if (componentGrid && gridElement) {
      const dropZoneParms: RowDropZoneParams = {
        getContainer() {
          return gridElement;
        },
        onDragging(params) {
          // params.event
        },
        onDragStop({ node, event }: RowDragEndEvent<DashboardComponent>) {
          if (!node.data) {
            return;
          }
          const {
            dashboard: { name: componentName, defaultSize, minSize },
            component,
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
          console.log("event:", { event, rect });

          setLayout((currentLayout) => {
            return [
              ...currentLayout,
              {
                i: uuidv4(),
                x,
                y,
                w: width,
                h: height,
                minW: minWidth,
                minH: minHeight,
                Component: component,
              },
            ];
          });
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
        setLayout((currentLayout) => {
          const { h, w, x, y, i } = newItem;
          const currentItemIndex = currentLayout.findIndex(
            (item) => item.i === i
          );
          const updatedItem = {
            ...currentLayout[currentItemIndex],
            h,
            w,
            x,
            y,
          };
          currentLayout[currentItemIndex] = updatedItem;
          return [...currentLayout];
        });
        console.log("updatedLayout:", updatedLayout);
        // setLayout(updatedLayout as ComponentLayout[]);
      }}
      onDragStop={(updatedLayout, oldItem, newItem) => {
        setLayout((currentLayout) => {
          const { h, w, x, y, i } = newItem;
          const currentItemIndex = currentLayout.findIndex(
            (item) => item.i === i
          );
          const updatedItem = {
            ...currentLayout[currentItemIndex],
            h,
            w,
            x,
            y,
          };
          currentLayout[currentItemIndex] = updatedItem;
          return [...currentLayout];
        });
        console.log("updatedLayout:", updatedLayout);
        // setLayout(updatedLayout as ComponentLayout[]);
      }}
      className={classNames(Styles.layout, Styles.editable)}
      layout={gridLayout}
      cols={20000}
      rowHeight={cellSize}
      width={(cellSize + cellGap) * 20000}
      containerPadding={[0, 0]}
      margin={[5, 5]}
      autoSize
      compactType={null}
      preventCollision
      resizeHandles={["ne", "nw", "se", "sw", "s", "e", "w", "n"]}
      onDragStart={(layout, oldItem, newItem) => {
        dispatch(setSelectedComponent(newItem.i));
      }}
    >
      {layout.map(({ i: id, Component }) => {
        return (
          <div
            key={id}
            className={classNames(Styles.component, {
              [Styles.selected]: selectedComponentId === id,
            })}
          >
            <Component className={Styles["component-child"]} />
          </div>
        );
      })}
    </GridLayout>
  );
}

export default Components;
