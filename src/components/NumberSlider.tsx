import { NumberSlider } from "@frc-web-components/react";
import { ComponentConfig } from "../context-providers/ComponentConfigContext";

interface Props {
  value: number;
  min: number;
  max: number;
  blockIncrement: number;
  setValue: (value: number) => void;
  className: string;
}

function Slider({
  className,
  value,
  min,
  max,
  blockIncrement,
  setValue,
}: Props) {
  return (
    <NumberSlider
      className={className}
      value={value}
      min={min}
      max={max}
      blockIncrement={blockIncrement}
      onchange={(ev: any) => {
        setValue(ev.detail.value);
        console.log("CHANGE:", ev.detail.value);
      }}
    />
  );
}

export const numberSliderConfig: ComponentConfig = {
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
  component: Slider,
};
