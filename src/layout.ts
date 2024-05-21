import { IJsonModel } from "flexlayout-react";
import { v4 as uuidv4 } from "uuid";
import editIcon from "/edit.svg";
import settingsIcon from '/settings.svg';

export const layoutJson: IJsonModel = {
  global: {
    borderSize: 350,
  },
  borders: [
    {
      type: "border",
      selected: -1,
      location: "bottom",
      children: [],
    },
    {
      type: "border",
      selected: 1,
      location: "left",
      children: [
        {
          type: "tab",
          name: "Settings",
          component: "settings",
          enableFloat: false,
          enableClose: false,
          enableDrag: false,
          id: 'settingsTab',
          icon: settingsIcon,
        },
        {
          enableRenderOnDemand: true,
          type: "tab",
          name: "Editor",
          component: "editor",
          enableFloat: false,
          enableClose: false,
          enableDrag: false,
          id: 'editorTab',
          icon: editIcon,
          // closeType: ICloseType.Visible,
        },
      ],
    },
  ],
  layout: {
    type: "row",
    weight: 100,
    id: "layout",
    children: [
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
