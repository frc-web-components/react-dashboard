import { DashboardComponent } from "./ComponentContext";
import {
  Accelerometer,
  BasicFmsInfo,
  Field,
  Gyro,
} from "@frc-web-components/react";
import MarkdownViewer from "./MarkdownViewer";

export const componentMap: Record<string, DashboardComponent> = {
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
      value: { type: "Number", defaultValue: 0 },
      hideLabel: { type: "Boolean", defaultValue: false },
      precision: { type: "Number", defaultValue: 2 },
      counterClockwise: { type: "Boolean", defaultValue: false },
      fromRadians: { type: "Boolean", defaultValue: false },
    },
    component: Gyro,
  },
  accelerometer: {
    dashboard: {
      name: "Accelerometer",
      description: "",
      defaultSize: { width: 200, height: 60 },
      minSize: { width: 80, height: 60 },
    },
    properties: {
      value: { type: "Number", defaultValue: 0 },
      max: { type: "Number", defaultValue: 1 },
      min: { type: "Number", defaultValue: -1 },
      center: { type: "Number", defaultValue: 0 },
      precision: { type: "Number", defaultValue: 2 },
      hideText: { type: "Boolean", defaultValue: false },
      numTickMarks: {
        type: "Number",
        defaultValue: 3,
      },
      unit: { type: "String", defaultValue: "g" },
    },
    component: Accelerometer,
  },
  markdownViewer: {
    dashboard: {
      name: "Markdown Viewer",
      description: "",
      defaultSize: { width: 300, height: 300 },
      minSize: { width: 50, height: 50 },
    },
    properties: {
      markdown: { type: "String", defaultValue: "" },
    },
    component: MarkdownViewer
  },
};

export const componentList: DashboardComponent[] = Object.values(componentMap);
