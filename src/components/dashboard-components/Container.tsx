import { createComponent } from "./fromProps";

export const container = createComponent(
  {
    dashboard: {
      name: "Layout Container",
      description: "",
      defaultSize: { width: 300, height: 200 },
      minSize: { width: 20, height: 20 },
    },

    properties: {},
  },
  () => {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          border: "2px solid red",
        }}
      >
        I am a container
      </div>
    );
  }
);
