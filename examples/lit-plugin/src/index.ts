import {
  addComponents,
  createWebComponent,
  numberProp,
} from '@frc-web-components/app';
import MyElement from './my-element';

export const myLitElement = createWebComponent(
  {
    dashboard: {
      name: 'My Lit Element',
      description: '',
      defaultSize: { width: 100, height: 100 },
      minSize: { width: 20, height: 20 },
    },
    acceptedSourceTypes: ['Number'],
    primaryProperty: 'count',
    properties: {
      count: numberProp(),
    },
  },
  'my-lit-element',
  MyElement,
);

addComponents({
  myLitElement,
});
