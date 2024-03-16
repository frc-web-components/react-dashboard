import { DashboardComponent } from "./ComponentContext";
import { BasicFmsInfo, Field, Gyro } from "@frc-web-components/react";

export const componentMap: Record<string, DashboardComponent> = {
  basicFmsInfo: {
    dashboard: {
      name: "Basic FMS Info",
      description: "",
      defaultSize: { width: 380, height: 100 },
      minSize: { width: 150, height: 90 },
    },
    properties: {},
    component: BasicFmsInfo,
  },
  field: {
    dashboard: {
      name: "Field",
      description: "",
      defaultSize: { width: 300, height: 150 },
      minSize: { width: 60, height: 60 },
    },
    properties: {},
    component: Field,
  },
  gyro: {
    dashboard: {
      name: "Gyro",
      description: "",
      defaultSize: { width: 200, height: 240 },
      minSize: { width: 120, height: 120 },
    },
    properties: {
      value: { type: 'Number', defaultValue: 0 },
      hideLabel: { type: 'Boolean', defaultValue:  false },
      precision: { type: 'Number', defaultValue: 2 },
      counterClockwise: { type: 'Boolean', defaultValue: false },
      fromRadians: { type: 'Boolean', defaultValue: false },
    },
    component: Gyro,
  }
};


export const componentList: DashboardComponent[] = Object.values(componentMap);
