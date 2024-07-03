import { createComponent, stringDropdownProp, stringProp } from "./fromProps";

export const layoutComponent = createComponent(
  {
    dashboard: {
      name: "Layout Component",
      description: "",
      defaultSize: { width: 100, height: 100 },
      minSize: { width: 20, height: 20 },
    },
    acceptedSourceTypes: ["Boolean"],

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
    return (
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
        <p style={{ margin: 2 }}>I am a layout</p>
        <p style={{ margin: 2 }}>I am another bit of text</p>
        {label}
      </div>
    );
  }
);
