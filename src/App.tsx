import settingsIcon from '/settings.svg';
import connectedIcon from '/connected.svg';
import disconnectedIcon from '/disconnected.svg';
import addIcon from '/add.svg';
import './App.css';
import 'flexlayout-react/style/dark.css';
import { BorderNode, IJsonModel, ITabSetRenderValues, Layout, Model, TabNode, TabSetNode } from 'flexlayout-react';
import { useEffect, useRef, useState } from 'react';
import Sources from './sources/Sources';
import { useNt4 } from '@frc-web-components/react';


// TODO: use https://github.com/react-grid-layout/react-grid-layout

const json: IJsonModel = {
  global: {
    // "borderMinSize": 100
  },
  "borders": [

    {
      "type": "border",
      "selected": -1,
      "size": 353.79999923706055,
      "location": "bottom",
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
                component: "button",
                name: "Components",
              },
            ]
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
            ]
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
            component: "button",
            enableFloat: true,
          },
          {
            type: "tab",
            name: "Autonomous",
            component: "button",
            enableFloat: true,
          },
        ]
      }
    ]
  }
};

const model = Model.fromJson(json);


function App() {

  const layoutRef = useRef<Layout>();
  const { nt4Provider } = useNt4();
  const [isNt4Connected, setIsNt4Connected] = useState(false);

  useEffect(() => {
    nt4Provider.addConnectionListener(connected => {
      setIsNt4Connected(connected);
    });
  }, [nt4Provider]);


  const factory = (node: TabNode) => {
    var component = node.getComponent();

    if (component === "button") {
      return <></>;
      // return <button>{node.getName()}</button>;
    }

    if (component === "sources") {
      return (
        <Sources />
      );
    }
  }

  return (
    <Layout
      ref={layoutRef as any}
      model={model}
      factory={factory}
      onRenderTabSet={(tabSetNode: TabSetNode | BorderNode, renderValues: ITabSetRenderValues) => {
        if (tabSetNode instanceof BorderNode) {
          const location = tabSetNode.getLocation();
          if (location.getName() === 'bottom') {
            // buttons on right side
            renderValues.buttons.push(<img src={settingsIcon} />)

            // buttons on left side
            renderValues.stickyButtons.push(
              <div style={{
                display: 'flex',
                alignItems: 'center',
                color: isNt4Connected ? 'green' : 'red',
                gap: '5px'
              }}>
                <img src={isNt4Connected ? connectedIcon : disconnectedIcon} />
                NetworkTables
              </div>
            )
          }
        } else if (!['tools', 'properties'].includes(tabSetNode.getId())) {
          renderValues.stickyButtons.push(
            <img src={addIcon}
              style={{
                cursor: 'pointer',
              }}
              onClick={() => {
                (layoutRef!.current!).addTabToTabSet(tabSetNode.getId(), {
                  component: "grid",
                  name: "Unnamed Tab",
                  enableFloat: true,

                });
              }}
            />
          );
        }
      }}
    />
  );
}

export default App
