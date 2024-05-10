import {
  IJsonModel,
  IJsonRowNode,
  IJsonTabSetNode,
  IJsonTabNode,
} from "flexlayout-react";
import { v4 as uuidv4 } from "uuid";

export const sourceTabJson: IJsonTabNode = {
  type: "tab",
  enableClose: false,
  enableDrag: false,
  enableFloat: false,
  enableRename: false,
  component: "sources",
  name: "Sources",
  id: "sources",
};

export const componentListTabJson: IJsonTabNode = {
  type: "tab",
  enableClose: false,
  enableDrag: false,
  enableFloat: false,
  enableRename: false,
  component: "componentList",
  name: "Components",
  id: "componentList",
};

export const propertiesTabJson: IJsonTabNode = {
  type: "tab",
  enableClose: false,
  enableDrag: false,
  enableFloat: false,
  enableRename: false,
  component: "properties",
  id: "mainProperties",
  name: "Properties",
};

export const toolsTabsetJson: IJsonTabSetNode = {
  width: 300,
  id: "tools",
  enableMaximize: false,
  type: "tabset",
  weight: 50,
  enableDrag: false,
  children: [sourceTabJson, componentListTabJson],
};

export const propertiesTabsetJson: IJsonTabSetNode = {
  enableMaximize: false,
  type: "tabset",
  weight: 50,
  id: "properties",
  enableDrag: false,
  children: [propertiesTabJson],
};

export const editorLayoutJson: IJsonRowNode = {
  width: 400,
  type: "row",
  id: "editor",
  children: [toolsTabsetJson, propertiesTabsetJson],
};

export const layoutJson: IJsonModel = {
  global: {},
  borders: [
    {
      type: "border",
      selected: -1,
      location: "bottom",
      children: [],
    },
    {
      type: "border",
      selected: -1,
      location: "left",

      children: [],
    },
  ],
  layout: {
    type: "row",
    weight: 100,
    id: "layout",
    children: [
      editorLayoutJson,
      {
        type: "tabset",
        weight: 50,
        id: uuidv4(),
        children: [
          {
            type: "tab",
            name: "TeleOperated",
            component: "components",
            enableFloat: true,
            id: uuidv4(),
          },
          {
            type: "tab",
            name: "Autonomous",
            component: "components",
            enableFloat: true,
            id: uuidv4(),
          },
        ],
      },
    ],
  },
};
