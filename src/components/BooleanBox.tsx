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
    acceptedSourceTypes: ["Boolean"],
    primaryProperty: "value",
    properties: {
      value: booleanProp(),
      trueColor: colorProp({ defaultValue: "green" }),
      falseColor: colorProp({ defaultValue: "red" }),
      label: stringProp(),
    },
  },
  ({ className, falseColor, label, trueColor, value, setProperty }) => {
    return (
      <div
        className={className}
        style={{
          background: value ? trueColor : falseColor,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        onClick={() => {
          setProperty('value', !value);
        }}
      >
        {label}
      </div>
    );
  }
);
