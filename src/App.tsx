import settingsIcon from "/settings.svg";
import connectedIcon from "/connected.svg";
import disconnectedIcon from "/disconnected.svg";
import addIcon from "/add.svg";
import "./App.css";
import "flexlayout-react/style/dark.css";
import {
  BorderNode,
  ITabSetRenderValues,
  Layout,
  Model,
  TabNode,
  TabSetNode,
} from "flexlayout-react";
import { useEffect, useRef, useState } from "react";
import Sources from "./sources/Sources";
import { useNt4 } from "@frc-web-components/react";
import Components from "./components/Components";
import { DashboardThemes, darkTheme } from "@frc-web-components/fwc/themes";
import Properties from "./properties/Properties";
import ComponentList from "./components/ComponentList";
import { layoutJson } from "./layout";

const themes = new DashboardThemes();
themes.addThemeRules("dark", darkTheme);

const model = Model.fromJson(layoutJson);

function App() {
  const layoutRef = useRef<Layout>();
  const { nt4Provider } = useNt4();
  const [isNt4Connected, setIsNt4Connected] = useState(false);

  useEffect(() => {
    nt4Provider.addConnectionListener((connected) => {
      setIsNt4Connected(connected);
    });
  }, [nt4Provider]);

  const factory = (node: TabNode) => {
    var component = node.getComponent();

    if (component === "components") {
      return <Components />;
    }

    if (component === "sources") {
      return <Sources />;
    }

    if (component === "properties") {
      return <Properties />;
    }

    if (component === 'componentList') {
      return <ComponentList />;
    }
  };

  return (
    <Layout
      ref={layoutRef as any}
      model={model}
      factory={factory}
      onRenderTabSet={(
        tabSetNode: TabSetNode | BorderNode,
        renderValues: ITabSetRenderValues
      ) => {
        if (tabSetNode instanceof BorderNode) {
          const location = tabSetNode.getLocation();
          if (location.getName() === "bottom") {
            // buttons on right side
            renderValues.stickyButtons.push(<img src={settingsIcon} />);

            // buttons on left side
            renderValues.buttons.push(
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  color: isNt4Connected ? "green" : "red",
                  gap: "5px",
                }}
              >
                <img src={isNt4Connected ? connectedIcon : disconnectedIcon} />
                NetworkTables
              </div>
            );
          }
        } else if (!["tools", "properties"].includes(tabSetNode.getId())) {
          renderValues.stickyButtons.push(
            <img
              src={addIcon}
              style={{
                cursor: "pointer",
              }}
              onClick={() => {
                layoutRef!.current!.addTabToTabSet(tabSetNode.getId(), {
                  component: "components",
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

export default App;
