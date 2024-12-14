import { Swerve, Differential, Mecanum } from '@frc-web-components/react';
import {
  createComponent,
  numberArrayProp,
  numberProp,
  stringDropdownProp,
} from './fromProps';

export const swerveDrivebase = createComponent(
  {
    dashboard: {
      name: 'Swerve Drivebase',
      description: '',
      defaultSize: { width: 300, height: 300 },
      minSize: { width: 50, height: 50 },
    },
    defaultSource: {
      key: '/SmartDashboard/swerve',
      provider: 'NT',
    },
    acceptedSourceTypes: ['Swerve'],
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
        defaultValue: 'radians',
        options: ['radians', 'degrees'],
      }),
      sizeLeftRight: numberProp({ defaultValue: 2 }),
      sizeFrontBack: numberProp({ defaultValue: 2 }),
    },
  },
  (props) => {
    return <Swerve {...props} />;
  },
);

export const differentialDrivebase = createComponent(
  {
    dashboard: {
      name: 'Differential Drivebase',
      description: '',
      defaultSize: { width: 300, height: 200 },
      minSize: { width: 100, height: 100 },
    },
    acceptedSourceTypes: ['DifferentialDrive'],
    properties: {
      leftMotorSpeed: numberProp(),
      rightMotorSpeed: numberProp(),
    },
  },
  (props) => {
    return (
      <div
        style={{
          paddingRight: '15px',
          boxSizing: 'border-box',
          width: '100%',
          height: '100%',
        }}
      >
        <Differential {...props} style={{ width: '100%', height: '100%' }} />
      </div>
    );
  },
);

export const mecanumDrivebase = createComponent(
  {
    dashboard: {
      name: 'Mecanum Drivebase',
      description: '',
      defaultSize: { width: 330, height: 240 },
      minSize: { width: 100, height: 100 },
    },
    acceptedSourceTypes: ['MecanumDrive'],
    properties: {
      frontLeftMotorSpeed: numberProp(),
      frontRightMotorSpeed: numberProp(),
      rearLeftMotorSpeed: numberProp(),
      rearRightMotorSpeed: numberProp(),
    },
  },
  (props) => {
    return (
      <div
        style={{
          paddingRight: '15px',
          boxSizing: 'border-box',
          width: '100%',
          height: '100%',
        }}
      >
        <Mecanum {...props} style={{ width: '100%', height: '100%' }} />
      </div>
    );
  },
);
