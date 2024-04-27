import { ComponentConfig } from "../context-providers/ComponentConfigContext";
import {
  Accelerometer,
  BasicFmsInfo,
  Gyro,
  Swerve,
} from "@frc-web-components/react";
import { threeAxisAccelerometer } from "./ThreeAxisAccelerometer";
import { camera } from "./Camera";
import { markdownViewer } from "./MarkdownViewer";
import { numberSlider } from "./NumberSlider";
import { booleanBox } from "./BooleanBox";
import {
  booleanProp,
  numberArrayProp,
  numberProp,
  stringDropdownProp,
  stringProp,
} from "./fromProps";
import { field, fieldPath, fieldRobot } from "./Field";
import {
  lineChart,
  lineChartAxis,
  lineChartData,
  lineChartLegend,
} from "./LineChart";

export const componentMap: Record<string, ComponentConfig> = {
  threeAxisAccelerometer,
  accelerometer: {
    dashboard: {
      name: "Accelerometer",
      description: "",
      defaultSize: { width: 200, height: 60 },
      minSize: { width: 80, height: 60 },
    },
    properties: {
      value: numberProp(),
      max: numberProp({ defaultValue: 1 }),
      min: numberProp({ defaultValue: -1 }),
      center: numberProp(),
      precision: numberProp({ defaultValue: 2 }),
      hideText: booleanProp(),
      numTickMarks: numberProp({ defaultValue: 3 }),
      unit: stringProp({ defaultValue: "g" }),
    },
    component: Accelerometer,
  },
  basicFmsInfo: {
    dashboard: {
      name: "Basic FMS Info",
      description: "",
      defaultSize: { width: 380, height: 100 },
      minSize: { width: 150, height: 90 },
    },
    properties: {
      eventName: { type: "String", defaultValue: "" },
      matchNumber: { type: "Number", defaultValue: 0 },
      matchType: { type: "Number", defaultValue: 0 },
      fmsControlData: { type: "Number", defaultValue: 0 },
    },
    component: BasicFmsInfo,
  },
  booleanBox,
  camera,
  field,
  fieldPath,
  fieldRobot,
  gyro: {
    dashboard: {
      name: "Gyro",
      description: "",
      defaultSize: { width: 200, height: 240 },
      minSize: { width: 120, height: 120 },
    },
    properties: {
      value: numberProp(),
      hideLabel: booleanProp(),
      precision: numberProp({ defaultValue: 2, min: 0, precision: 0 }),
      counterClockwise: booleanProp(),
      fromRadians: booleanProp(),
    },
    component: Gyro,
  },

  swerveDrivebase: {
    dashboard: {
      name: "Swerve Drivebase",
      description: "",
      defaultSize: { width: 300, height: 300 },
      minSize: { width: 50, height: 50 },
    },
    properties: {
      moduleCount: numberProp({ defaultValue: 4 }),
      wheelLocations: numberArrayProp({
        defaultValue: [1, -1, 1, 1, -1, -1, -1, 1],
      }),
      measuredStates: numberArrayProp({
        defaultValue: [0, 0, 0, 0, 0, 0, 0, 0],
      }),
      desiredStates: numberArrayProp({
        defaultValue: [0, 0, 0, 0, 0, 0, 0, 0],
      }),
      robotRotation: numberProp(),
      maxSpeed: numberProp({ defaultValue: 1 }),
      rotationUnit: stringDropdownProp({
        defaultValue: "radians",
        options: ["radians", "degrees"],
      }),
      sizeLeftRight: numberProp({ defaultValue: 2 }),
      sizeFrontBack: numberProp({ defaultValue: 2 }),
    },
    component: Swerve,
  },
  markdownViewer,
  numberSlider,
  lineChart,
  lineChartData,
  lineChartAxis,
  lineChartLegend,
};

export const componentList: ComponentConfig[] = Object.values(componentMap);
