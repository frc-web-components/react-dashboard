import { NumberSlider } from "@frc-web-components/react";
import { createComponent } from "./fromProps";

export const numberSlider = createComponent(
  {
    dashboard: {
      name: "Number Slider",
      description: "",
      defaultSize: { width: 200, height: 60 },
      minSize: { width: 80, height: 30 },
    },
    properties: {
      value: { type: "Number", defaultValue: 0 },
      min: { type: "Number", defaultValue: -1 },
      max: { type: "Number", defaultValue: 1 },
      blockIncrement: {
        type: "Number",
        defaultValue: 0.05,
      },
    },
  },
  ({ blockIncrement, value, min, max, className, setProperty }) => {
    return (
      <NumberSlider
        className={className}
        value={value}
        min={min}
        max={max}
        blockIncrement={blockIncrement}
        onchange={(ev: any) => {
          setProperty('value', ev.detail.value);
        }}
      />
    );
  }
);

