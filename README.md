# React FWC Dashboard

## Developing

### Installing

This project uses the pnpm package manager. Please install pnpm first before proceeding: https://pnpm.io/installation

If using vscode the following extensions are recommended:

- [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode): Code formatting
- [CSS Modules](https://marketplace.visualstudio.com/items?itemName=clinyong.vscode-css-modules): Used for autocompleting css modules

To install run in the root directory:
https://github.com/frc-web-components/react-dashboard.gitk

```bash
pnpm install
```

### Running

To run the project locally run in the root directory:

```bash
pnpm dev
```

https://github.com/frc-web-components/react-dashboard.gitk

## Usage

- Adding, Selecting, and Removing Elements

## App Layout

When you first open the app, you will see the following panels:
![screen-layout-1](./docs/img/layout01.png)
![screen-layout-2](./docs/img/layout02.png)

### Adding, Selecting, and Removing Elements

Elements can be added to the dashboard by dragging them from the `Components` tabl on the sidebar to the dashboard:

![add-component](./docs/img/addComponent.gif)

To select an element, click on it in the dashboard. Its properties will appear in the `Properties` panel in the sidebar.

![selection](./docs/img/selection.png)

Elements can be placed and resized anywhere in the Dashboard Layout Panel.

![resize](./docs/img/resize.gif)

To delete a component, either press Delete on your keyboard, right click on the component and select "Remove", or click the red `X` in its `Properties` panel.

![remove](./docs/img/remove.gif)
