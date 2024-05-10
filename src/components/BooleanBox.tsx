import { BooleanBox } from "@frc-web-components/react";
import {
  booleanProp,
  colorProp,
  createComponent,
  stringProp,
} from "./fromProps";

export const booleanBox = createComponent(
  {
    dashboard: {
      name: "Boolean Box",
      description: "",
      defaultSize: { width: 100, height: 100 },
      minSize: { width: 20, height: 20 },
    },
    acceptedSourceTypes: ['Boolean'],
    primaryProperty: 'value',
    properties: {
      value: booleanProp(),
      trueColor: colorProp({ defaultValue: "#00ff00" }),
      falseColor: colorProp({ defaultValue: "#ff0000" }),
      label: stringProp(),
    },
  },
  ({ children, setProperty, ...props }) => {
    return <BooleanBox {...props} />;
  }
);
