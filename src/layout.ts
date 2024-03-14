import { IJsonModel } from "flexlayout-react";

export const layoutJson: IJsonModel = {
  global: {},
  borders: [
    {
      type: "border",
      selected: -1,
      size: 353.79999923706055,
      location: "bottom",
      children: [],
    },
  ],
  layout: {
    type: "row",
    weight: 100,
    children: [
      {
        width: 400,
        type: "row",
        children: [
          {
            width: 300,
            id: "tools",
            enableMaximize: false,
            type: "tabset",
            weight: 50,
            enableDrag: false,
            children: [
              {
                type: "tab",
                enableClose: false,
                enableDrag: false,
                enableFloat: false,
                enableRename: false,
                component: "sources",
                name: "Sources",
              },
              {
                type: "tab",
                enableClose: false,
                enableDrag: false,
                enableFloat: false,
                enableRename: false,
                component: "componentList",
                name: "Components",
              },
            ],
          },
          {
            enableMaximize: false,
            type: "tabset",
            weight: 50,
            id: "properties",
            enableDrag: false,
            children: [
              {
                type: "tab",
                enableClose: false,
                enableDrag: false,
                enableFloat: false,
                enableRename: false,
                component: "properties",
                name: "Properties",
              },
            ],
          },
        ],
      },
      {
        type: "tabset",
        weight: 50,
        children: [
          {
            type: "tab",
            name: "TeleOperated",
            component: "components",
            enableFloat: true,
          },
          {
            type: "tab",
            name: "Autonomous",
            component: "components",
            enableFloat: true,
          },
        ],
      },
    ],
  },
};
