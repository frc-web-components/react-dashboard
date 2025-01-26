import { Layout } from '../store/slices/layoutSlice';

const layout: Layout = {
  flexLayout: {
    global: { splitterSize: 3, splitterExtra: 6, borderSize: 350 },
    borders: [],
    layout: {
      type: 'row',
      id: 'layout',
      children: [
        {
          type: 'tabset',
          id: '90abf9c8-22b7-4e66-90de-0d75f6516078',
          weight: 50,
          children: [
            {
              type: 'tab',
              id: 'b95ba66f-1e10-41e5-915b-0a561f212043',
              name: 'TeleOperated',
              component: 'components',
            },
            {
              type: 'tab',
              id: 'a8a32092-a26b-4ff2-b572-1ed32d1f5c7b',
              name: 'Autonomous',
              component: 'components',
            },
          ],
          active: true,
        },
      ],
    },
  },
  components: {
    'c43c9efd-cd18-4c39-85bf-440134c2ecb9': {
      id: 'c43c9efd-cd18-4c39-85bf-440134c2ecb9',
      children: [],
      source: { key: '/SmartDashboard/swerve', provider: 'NT' },
      minSize: { width: 4, height: 4 },
      size: { width: 5, height: 5 },
      position: { x: 1, y: 1 },
      properties: {
        measuredStates: { value: [0, 0, 0, 0, 0, 0, 0, 0] },
        desiredStates: { value: [0, 0, 0, 0, 0, 0, 0, 0] },
        robotRotation: { value: 0 },
        maxSpeed: { value: 1 },
        rotationUnit: { value: 'radians' },
        sizeLeftRight: { value: 2 },
        sizeFrontBack: { value: 2 },
      },
      type: 'swerveDrivebase',
      name: 'Swerve Drivebase',
    },
  },
  tabs: {
    'b95ba66f-1e10-41e5-915b-0a561f212043': {
      componentIds: ['c43c9efd-cd18-4c39-85bf-440134c2ecb9'],
    },
  },
  gridSize: 50,
  gridGap: 5,
  gridPadding: 5,
};

export default layout;
