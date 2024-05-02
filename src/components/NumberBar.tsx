import { NumberBar } from "@frc-web-components/react";
import {
  booleanProp,
  createComponent,
  numberProp,
  stringProp,
} from "./fromProps";

export const numberBar = createComponent(
  {
    dashboard: {
      name: "Number Bar",
      description: "",
      defaultSize: { width: 200, height: 60 },
      minSize: { width: 80, height: 60 },
    },
    primaryProperty: 'value',
    properties: {
      value: numberProp(),
      max: numberProp({ defaultValue: 1 }),
      min: numberProp({ defaultValue: -1 }),
      center: numberProp(),
      precision: numberProp({ defaultValue: 2, min: 0 }),
      hideText: booleanProp(),
      numTickMarks: numberProp({ defaultValue: 3 }),
      unit: stringProp(),
    },
  },
  ({ children, setProperty, ...props }) => {
    return <NumberBar {...props} />;
  }
);
