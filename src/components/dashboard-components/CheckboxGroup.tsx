import { CheckboxGroup } from "@frc-web-components/react";
import {
  booleanProp,
  createComponent,
  stringArrayProp,
  stringDropdownProp,
  stringProp,
} from "./fromProps";

export const checkboxGroup = createComponent(
  {
    dashboard: {
      name: "Checkbox Group",
      description: "",
      defaultSize: { width: 65, height: 100 },
      minSize: { width: 20, height: 20 },
    },
    acceptedSourceTypes: ['String[]'],
    primaryProperty: 'selected',
    properties: {
      disabled: booleanProp(),
      label: stringProp(),
      options: stringArrayProp({ defaultValue: ["1", "2", "3"] }),
      selected: stringArrayProp(),
      direction: stringDropdownProp({
        defaultValue: "vertical",
        options: ["vertical", "horizontal"],
      }),
    },
  },
  ({ setProperty, children, ...props }) => {
    return (
      <CheckboxGroup
        {...(props as any)}
        onchange={(ev: CustomEvent) => {
          setProperty('selected', ev.detail.selected);
        }}
      />
    );
  }
);
