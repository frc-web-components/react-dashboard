import { ComponentConfig } from "../context-providers/ComponentConfigContext";
import { Accelerometer, BasicFmsInfo, Gyro } from "@frc-web-components/react";
import { threeAxisAccelerometer } from "./ThreeAxisAccelerometer";
import { camera } from "./Camera";
import { markdownViewer } from "./MarkdownViewer";
import { numberSlider } from "./NumberSlider";
import { booleanBox } from "./BooleanBox";
import { checkboxGroup } from "./CheckboxGroup";
import { robotCommand, robotSubsystem } from "./CommandBased";
import { booleanProp, numberProp, stringProp } from "./fromProps";
import { field, fieldPath, fieldRobot } from "./Field";
import {
  lineChart,
  lineChartAxis,
  lineChartData,
  lineChartLegend,
} from "./LineChart";
import {
  swerveDrivebase,
  differentialDrivebase,
  mecanumDrivebase,
} from "./Drivebases";
import { gauge } from "./Gauge";
import { icon } from "./Icon";
import { label, numberLabel } from "./Labels";
import { mechanism2d } from "./Mechanism2d";


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
  checkboxGroup,
  robotCommand,
  robotSubsystem,
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
  swerveDrivebase,
  differentialDrivebase,
  mecanumDrivebase,
  markdownViewer,
  numberSlider,
  lineChart,
  lineChartData,
  lineChartAxis,
  lineChartLegend,
  gauge,
  icon,
  label,
  numberLabel,
  mechanism2d,
};

export const componentList: ComponentConfig[] = Object.values(componentMap);
