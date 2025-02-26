import '@frc-web-components/fwc/components/toggle-group';
import type { Args, Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import { styleMap } from 'lit/directives/style-map.js';

const defaultArgs: Record<string, any> = {
  options: ['On', 'Off'],
  value: '',
  direction: 'vertical',
  theme: 'light',
  'background-color': '#fff',
  '--frc-button-background-color': 'rgb(230, 230, 230)',
  '--frc-button-text-color': 'black',
  '--frc-button-toggled-background-color': 'black',
  '--frc-button-toggled-text-color': 'white',
};

/**
 * To use this component import the module:
 *
 * ```javascript
 * import "@frc-web-components/fwc/components/toggle-group";
 *
 * // or to import all components:
 * import "@frc-web-components/fwc/components";
 * ```
 *
 * And then add the component to your html:
 *
 * ```html
 * <frc-toggle-group options='["On", "Off"]' value="Off"></frc-toggle-group>
 * ```
 *
 * Or use the component in React:
 *
 * ```jsx
 * import { ToggleGroup } from "@frc-web-components/react";
 * ```
 *
 * And then add the component in your jsx:
 *
 * ```jsx
 * <ToggleGroup options={["On", "Off"]} value="Off" />
 * ```
 */
const meta: Meta = {
  title: 'FRC/Toggle Group',
  tags: ['autodocs'],
  component: 'frc-toggle-group',
  args: defaultArgs,
  argTypes: {
    options: {
      control: 'object',
      table: {
        category: 'Properties',
        defaultValue: { summary: ['On', 'Off'] },
      },
    },
    value: {
      table: {
        category: 'Properties',
        defaultValue: { summary: '' },
      },
    },
    direction: {
      table: {
        category: 'Properties',
        defaultValue: 'vertical',
      },
      options: ['vertical', 'horizontal'],
      control: 'select',
    },
    theme: {
      control: 'radio',
      options: ['light', 'dark', 'custom'],
      table: {
        category: 'Styles',
        defaultValue: 'light',
      },
    },
    'background-color': {
      table: {
        category: 'Styles',
        defaultValue: '#fff',
      },
    },
    '--frc-button-background-color': {
      table: {
        category: 'Styles',
        defaultValue: { summary: 'rgb(230, 230, 230)' },
      },
    },
    '--frc-button-text-color': {
      table: {
        category: 'Styles',
        defaultValue: { summary: 'black' },
      },
    },
    '--frc-button-toggled-background-color': {
      table: {
        category: 'Styles',
        defaultValue: { summary: 'black' },
      },
    },
    '--frc-button-toggled-text-color': {
      table: {
        category: 'Styles',
        defaultValue: { summary: 'white' },
      },
    },
  },
  decorators: [
    (story, props) => {
      const isDarkTheme = props.args.theme === 'dark';
      const themeColor = isDarkTheme ? 'hsl(214, 35%, 21%)' : '#fff';
      const customColor = props.args['background-color'];
      return html` <div
        style=${styleMap({
          padding: '20px 10px',
          marginBottom: '5px',
          background: props.args.theme === 'custom' ? customColor : themeColor,
        })}
      >
        ${story()}
      </div>`;
    },
  ],
  // https://storybook.js.org/blog/storybook-addons-for-css/
  // https://storybook.js.org/blog/how-to-add-a-theme-switcher-to-storybook/
  // https://storybook.js.org/docs/react/writing-docs/autodocs
};
export default meta;

type Story = StoryObj;

function getStyles(args: Args) {
  if (args.theme === 'custom') {
    return html`
      <style>
        .custom {
          --frc-button-background-color: ${args[
            '--frc-button-background-color'
          ]};
          --frc-button-text-color: ${args['--frc-button-text-color']};
          --frc-button-toggled-background-color: ${args[
            '--frc-button-toggled-background-color'
          ]};
          --frc-button-toggled-text-color: ${args[
            '--frc-button-toggled-text-color'
          ]};
        }
      </style>
    `;
  }

  if (args.theme === 'dark') {
    return html`
      <style>
        .dark {
          --frc-button-background-color: rgba(255, 255, 255, 0.1);
          --frc-button-text-color: white;
          --frc-button-toggled-background-color: rgba(240, 240, 240);
          --frc-button-toggled-text-color: black;
        }
      </style>
    `;
  }

  return html`
    <style>
      .light {
        --frc-button-background-color: rgb(230, 230, 230);
        --frc-button-text-color: black;
        --frc-button-toggled-background-color: black;
        --frc-button-toggled-text-color: white;
      }
    </style>
  `;
}

function createToggleGroupStory(optionalArgs: Record<string, any> = {}): Story {
  const storyArgs = {
    ...defaultArgs,
    ...optionalArgs,
  };
  return {
    args: storyArgs,
    render: (args) => html`
      ${getStyles(args)}
      <frc-toggle-group
        class=${args.theme}
        options=${JSON.stringify(args.options)}
        value=${args.value}
        direction=${args.direction}
      ></frc-toggle-group>
    `,
  };
}

export const LightTheme = createToggleGroupStory({
  theme: 'light',
});

export const DarkTheme = createToggleGroupStory({
  theme: 'dark',
});
