import { useCallback, useState } from "react";
import _ from "lodash";
import { createComponent, stringDropdownProp, stringProp } from "./fromProps";
import { Responsive, WidthProvider } from "react-grid-layout";
const ResponsiveReactGridLayout = WidthProvider(Responsive);

function generateLayout() {
  return _.map(_.range(0, 25), function (_item, i) {
    const y = Math.ceil(Math.random() * 4) + 1;
    return {
      x: Math.round(Math.random() * 5) * 2,
      y: Math.floor(i / 6) * y,
      w: 2,
      h: y,
      i: i.toString(),
      static: Math.random() < 0.05,
    };
  });
}
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
    const [layoutConfig, setLayoutConfig] = useState([
      { x: 0, y: 0, w: 20, h: 20, static: false },
    ]);
    const onDrop = useCallback((_layout, layoutItem, _event) => {
      alert(
        `Dropped element props:\n${JSON.stringify(
          layoutItem,
          ["x", "y", "w", "h"],
          2
        )}`
      );
      // setLayoutConfig here
    }, []);

    const generateDOM = useCallback(() => {
      return _.map(layoutConfig, function (l, i) {
        return (
          <div key={i} className={l.static ? "static" : ""}>
            {l.static ? (
              <span
                className="text"
                title="This item is static and cannot be removed or resized."
              >
                Static - {i}
              </span>
            ) : (
              <span className="text">{i}</span>
            )}
          </div>
        );
      });
    }, [layoutConfig]);

    return (
      <ResponsiveReactGridLayout
        style={{
          height: "100%",
          width: "100%",
          border: "3px solid red",
        }}
        // {...this.props}
        layouts={{ lg: generateLayout() }}
        // onLayoutChange={this.onLayoutChange}
        onDrop={onDrop}
        preventCollision={false}
        isDroppable={true}
      >
        <div
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
          {generateDOM()}
        </div>
      </ResponsiveReactGridLayout>
    );
  }
);
