import { useCallback } from "react";
import { createComponent, stringDropdownProp, stringProp } from "./fromProps";
import ReactGridLayout from "react-grid-layout";

import { useDroppable } from "@dnd-kit/core";

export const layoutComponent = createComponent(
  {
    dashboard: {
      name: "Layout Component",
      description: "",
      defaultSize: { width: 100, height: 100 },
      minSize: { width: 20, height: 20 },
    },

    properties: {
      align: stringDropdownProp({
        defaultValue: "start",
        options: ["start", "center", "end"],
      }),
      justify: stringDropdownProp({
        defaultValue: "start",
        options: ["start", "center", "end"],
      }),
      childrenLayout: stringDropdownProp({
        defaultValue: "row",
        options: ["row", "column"],
      }),
      label: stringProp(),
    },
  },
  ({ align, justify, childrenLayout, label }) => {
    const onDrop = useCallback(() => {
      alert("got a drop event");
    }, []);

    const { isOver, setNodeRef } = useDroppable({
      id: "droppable",
    });

    return (
      <div ref={setNodeRef}>
        <ReactGridLayout
          style={{
            height: "100%",
            width: "100%",
            border: isOver ? "3px solid green" : "3px solid red",
          }}
          onDrop={onDrop}
          preventCollision={false}
          layout={[
            { i: "a", x: 0, y: 0, w: 1, h: 2, static: true },
            { i: "b", x: 1, y: 0, w: 3, h: 2, minW: 2, maxW: 4 },
            { i: "c", x: 4, y: 0, w: 1, h: 2 },
          ]}
        >
          <div
            key="a"
            style={{
              display: "flex",
              flexDirection:
                childrenLayout == "row"
                  ? "row"
                  : childrenLayout == "column"
                  ? "column"
                  : undefined,
              alignItems: align,
              justifyContent: justify,
              width: "100%",
              height: "100%",
              padding: "5px",
            }}
          >
            Here is some text that should show up?
          </div>
        </ReactGridLayout>
      </div>
    );
  }
);
