import { NetworkAlerts } from "@frc-web-components/react";
import {
  booleanProp,
  colorProp,
  createComponent,
  stringArrayProp,
  stringDropdownProp,
  stringProp,
} from "./fromProps";

export const networkAlerts = createComponent(
  {
    dashboard: {
      name: "Network Alerts",
      description: "",
      defaultSize: { width: 300, height: 200 },
      minSize: { width: 100, height: 50 },
    },
    properties: {

      errors: stringArrayProp(),
      warnings: stringArrayProp(),
      infos: stringArrayProp(),
      level: stringDropdownProp({ defaultValue: 'info', options: ['error', 'warning', 'info']}),
      hideTitle: booleanProp(),
    },
  },
  ({ children, setProperty, ...props }) => {
    return <NetworkAlerts {...props as any} />;
  }
);
