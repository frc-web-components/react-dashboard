import { Layout } from "../store/slices/layoutSlice";

const layout: Layout = {
  selectedComponentId: "97427c9b-2d00-4494-a06c-7637ca39a238",
  flexLayout: {
    global: {
      borderSize: 350,
    },
    borders: [
      {
        type: "border",
        location: "left",
        children: [
          {
            type: "tab",
            id: "settingsTab",
            name: "Settings",
            component: "settings",
            enableClose: false,
            enableDrag: false,
            icon: "/settings.svg",
          },
          {
            type: "tab",
            id: "editorTab",
            name: "Editor",
            component: "editor",
            enableClose: false,
            enableDrag: false,
            icon: "/edit.svg",
            enableRenderOnDemand: true,
          },
        ],
      },
    ],
    layout: {
      type: "row",
      id: "layout",
      children: [
        {
          type: "tabset",
          id: "2b8907fc-ae03-4ff5-b8c0-f9b92bb47e36",
          weight: 50,
          children: [
            {
              type: "tab",
              id: "43239588-9f7d-4135-b5fc-cd9095eb9006",
              name: "TeleOperated",
              component: "components",
            },
            {
              type: "tab",
              id: "90658caf-713b-49ac-82d8-69572b9f5270",
              name: "Autonomous",
              component: "components",
            },
          ],
          active: true,
        },
      ],
    },
  },
  components: {
    "7978eeef-ffc8-4ad2-beda-236f32cd28ac": {
      id: "7978eeef-ffc8-4ad2-beda-236f32cd28ac",
      children: [],
      minSize: {
        width: 1,
        height: 1,
      },
      size: {
        width: 2,
        height: 1,
      },
      position: {
        x: 0,
        y: 0,
      },
      properties: {
        options: {
          value: [],
        },
        selected: {
          value: "",
        },
        default: {
          value: "",
        },
        active: {
          value: "",
        },
        label: {
          value: "Auto Choices",
        },
      },
      type: "sendableChooser",
      name: "Sendable Chooser",
    },
    "97427c9b-2d00-4494-a06c-7637ca39a238": {
      id: "97427c9b-2d00-4494-a06c-7637ca39a238",
      children: [],
      source: {
        key: "/SmartDashboard/swerve",
        provider: "NT",
      },
      minSize: {
        width: 1,
        height: 1,
      },
      size: {
        width: 2,
        height: 2,
      },
      position: {
        x: 2,
        y: 1,
      },
      properties: {
        moduleCount: {
          value: 4,
        },
        wheelLocations: {
          value: [1, -1, 1, 1, -1, -1, -1, 1],
        },
        measuredStates: {
          value: [0, 0, 0, 0, 0, 0, 0, 0],
        },
        desiredStates: {
          value: [0, 0, 0, 0, 0, 0, 0, 0],
        },
        robotRotation: {
          value: 0,
        },
        maxSpeed: {
          value: 1,
        },
        rotationUnit: {
          value: "radians",
        },
        sizeLeftRight: {
          value: 2,
        },
        sizeFrontBack: {
          value: 2,
        },
      },
      type: "swerveDrivebase",
      name: "Swerve Drivebase",
    },
  },
  tabs: {
    "43239588-9f7d-4135-b5fc-cd9095eb9006": {
      componentIds: [
        "7978eeef-ffc8-4ad2-beda-236f32cd28ac",
        "97427c9b-2d00-4494-a06c-7637ca39a238",
      ],
    },
  },
  gridSize: 128,
  gridGap: 2,
};

export default layout;