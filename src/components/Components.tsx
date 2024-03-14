import GridLayout from "react-grid-layout";
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
import { RowDropZoneParams } from "ag-grid-community";

function Components() {
  const dispatch = useAppDispatch();
  const selectedComponentId = useAppSelector(selectSelectedComponentId);
  const [editing, setEditing] = useState(true);
  const { componentGrid } = useDropZone(); // Use the context
  const [gridElement, setGridElement] = useState<HTMLElement>();

  useEffect(() => {
    if (componentGrid && gridElement) {
      const dropZoneParms: RowDropZoneParams = {
        getContainer() {
            return gridElement;
        },
        onDragging(params) {
            // params.event
        },
      };
      componentGrid.addRowDropZone(dropZoneParms);
    }
  }, [gridElement, componentGrid]);

  // layout is an array of objects, see the demo for more complete usage
  const [layout, setLayout] = useState([
    { i: "a", x: 0, y: 0, w: 1, h: 2, Component: Gyro },
    {
      i: "b",
      x: 1,
      y: 0,
      w: 3,
      h: 2,
      minW: 2,
      maxW: 4,
      Component: BasicFmsInfo,
    },
    { i: "c", x: 4, y: 0, w: 1, h: 2, bleh: 3, Component: Field },
  ]);

  const gridLayout = useMemo(() => {
    return layout.map((item) => ({
      ...item,
      static: !editing,
    }));
  }, [layout, editing]);

  return (
    <GridLayout
      innerRef={(el) => {
        if (el) {
          setGridElement(el);
        }
      }}
      className={classNames(Styles.layout, Styles.editable)}
      layout={gridLayout}
      cols={12}
      rowHeight={30}
      width={1200}
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
