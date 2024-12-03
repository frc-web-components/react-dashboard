import { FooElement } from '@frc-web-components/svelte';
import { createComponent as createReactComponent } from '@lit/react';
import React from 'react';
import { createComponent, stringProp } from './fromProps';

export const MyFoo = createReactComponent({
  tagName: 'my-foo',
  elementClass: FooElement,
  react: React,
});

export const myFoo = createComponent(
  {
    dashboard: {
      name: 'My Foo',
      description: '',
      defaultSize: { width: 100, height: 100 },
      minSize: { width: 20, height: 20 },
    },
    acceptedSourceTypes: ['String'],
    primaryProperty: 'name',
    properties: {
      name: stringProp(),
    },
  },
  (props) => {
    return <MyFoo {...props} />;
  },
);
