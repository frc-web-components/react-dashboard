import { ThreeAxisAccelerometer } from "@frc-web-components/react";
import {
  booleanProp,
  createComponent,
  numberProp,
  stringProp,
} from "./fromProps";

export const threeAxisAccelerometer = createComponent(
  {
    dashboard: {
      name: "3-Axis Accelerometer",
      description: "",
      defaultSize: { width: 200, height: 130 },
      minSize: { width: 80, height: 130 },
    },
    properties: {
      x: numberProp(),
      y: numberProp(),
      z: numberProp(),
      max: numberProp({ defaultValue: 1 }),
      min: numberProp({ defaultValue: -1 }),
      center: numberProp(),
      precision: numberProp({ defaultValue: 2 }),
      hideText: booleanProp(),
      numTickMarks: numberProp({ defaultValue: 3 }),
      unit: stringProp({ defaultValue: "g" }),
    },
  },
  ({ children, setProperty, ...props }) => {
    return <ThreeAxisAccelerometer {...props} />;
  }
);
