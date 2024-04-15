import settingsIcon from "/settings.svg";
import connectedIcon from "/connected.svg";
import disconnectedIcon from "/disconnected.svg";
import addIcon from "/add.svg";
import "./App.css";
import "flexlayout-react/style/dark.css";
import {
  Actions,
  BorderNode,
  DockLocation,
  IJsonTabNode,
  ITabSetRenderValues,
  Layout,
  Model,
  TabNode,
  TabSetNode,
} from "flexlayout-react";
import { useEffect, useMemo, useRef, useState } from "react";
import Sources from "./tools/sources/Sources";
import { useNt4 } from "@frc-web-components/react";
import Tab from "./tab/Tab";
import { DashboardThemes, darkTheme } from "@frc-web-components/fwc/themes";
import Properties from "./tools/properties/Properties";
import ComponentPicker from "./tools/ComponentPicker";
import {
  componentListTabJson,
  layoutJson as defaultLayoutJson,
  propertiesTabJson,
  sourceTabJson,
} from "./layout";
import { useAppSelector } from "./store/app/hooks";
import { makeSelectSelectedComponent } from "./store/selectors/layoutSelectors";
import { useComponentConfigs } from "./context-providers/ComponentConfigContext";
import EditButton from "./sidebar/EditButton";
import { selectEditing } from "./store/slices/appSlice";
import { v4 as uuidv4 } from "uuid";

const themes = new DashboardThemes();
themes.addThemeRules("dark", darkTheme);

function App() {
  const layoutRef = useRef<Layout>();
  const { nt4Provider } = useNt4();
  const [isNt4Connected, setIsNt4Connected] = useState(false);
  const selectSelectedComponent = useMemo(makeSelectSelectedComponent, []);
  const selectedComponent = useAppSelector(selectSelectedComponent);
  const { components } = useComponentConfigs();
  const editing = useAppSelector(selectEditing);
  const [layoutJson] = useState(defaultLayoutJson);
  const modelRef = useRef<Model>();

  useEffect(() => {
    modelRef.current = Model.fromJson(layoutJson);
  }, [layoutJson]);

  useEffect(() => {
    nt4Provider.addConnectionListener((connected) => {
      setIsNt4Connected(connected);
    });
  }, [nt4Provider]);

  useEffect(() => {
    const model = modelRef.current!;
    if (!editing) {
      model.doAction(Actions.deleteTab("sources"));
      model.doAction(Actions.deleteTab("componentList"));
      model.doAction(Actions.deleteTab("mainProperties"));
    } else {
      const sourcesTab = model.getNodeById("sources");
      if (!sourcesTab) {
        const node = model.doAction(
          Actions.addNode(sourceTabJson, "layout", DockLocation.LEFT, 0)
        );

        const tabset = node?.getParent() as TabSetNode | undefined;
        if (tabset) {
          model.doAction(
            Actions.updateNodeAttributes(tabset.getId(), {
              enableMaximize: false,
            })
          );
          model.doAction(
            Actions.addNode(
              componentListTabJson,
              tabset.getId(),
              DockLocation.CENTER,
              1
            )
          );
          const propertiesTabset = model
            .doAction(
              Actions.addNode(
                propertiesTabJson,
                tabset.getId(),
                DockLocation.BOTTOM,
                1
              )
            )
            ?.getParent();
          if (propertiesTabset) {
            model.doAction(
              Actions.updateNodeAttributes(propertiesTabset.getId(), {
                enableMaximize: false,
              })
            );
          }
        }
      }
    }
  }, [editing]);

  useEffect(() => {
    const model = modelRef.current!;
    let propertiesTabName = "Properties";
    if (selectedComponent && components) {
      propertiesTabName =
        components[selectedComponent.type].dashboard.name ?? "Properties";
    }
    const node = model.getNodeById("mainProperties") as TabNode;
    const propertiesTabSet = node.getParent() as TabSetNode;
    if (!node) {
      return;
    }
    if (node.getType?.() === "tab") {
      node
        .getModel()
        .doAction(Actions.renameTab(node.getId(), propertiesTabName));
    }

    const children = selectedComponent
      ? components[selectedComponent.type].children ?? []
      : [];
    const tabData = children.map((child) => {
      return {
        name: child.propertyTabName ?? components[child.type].dashboard.name,
        id: `${child.type}Properties`,
      };
    });

    propertiesTabSet.getChildren().forEach((childTab) => {
      const id = childTab.getId();
      const childPropertyTab = tabData.find((data) => data.id === id);
      if (id === "mainProperties" || childPropertyTab) {
        return;
      }
      model.doAction(Actions.deleteTab(childTab.getId()));
    });

    if (selectedComponent && components) {
      // Actions.
      // propertiesTabSet.getChildren().

      tabData.forEach((data) => {
        const tabJson: IJsonTabNode = {
          type: "tab",
          enableClose: false,
          enableDrag: false,
          enableFloat: false,
          enableRename: false,
          component: "properties",
          id: data.id,
          name: data.name,
        };
        const node = model.getNodeById(data.id) as TabNode;

        if (!node) {
          layoutRef.current?.addTabToTabSet(propertiesTabSet.getId(), tabJson);
        }

        model.doAction(Actions.selectTab("mainProperties"));
      });
    }
  }, [selectedComponent]);

  const factory = (node: TabNode) => {
    var component = node.getComponent();

    if (component === "components") {
      return <Tab tabId={node.getId()} />;
    }

    if (component === "sources") {
      return <Sources />;
    }

    if (component === "properties") {
      return <Properties />;
    }

    if (component === "componentList") {
      return <ComponentPicker />;
    }
  };

  return (
    <Layout
      ref={layoutRef as any}
      model={modelRef.current ?? Model.fromJson(layoutJson)}
      factory={factory}
      onRenderTabSet={(
        tabSetNode: TabSetNode | BorderNode,
        renderValues: ITabSetRenderValues
      ) => {
        const hasTools = tabSetNode.getChildren().some((node) => {
          return ["sources", "componentList", "mainProperties"].includes(
            node.getId()
          );
        });

        if (tabSetNode instanceof BorderNode) {
          const location = tabSetNode.getLocation();

          if (location.getName() === "left") {
            // buttons on bottom side
            renderValues.stickyButtons.push(
              <img
                style={{
                  transform: "rotate(90deg)",
                  margin: "0 5px",
                  cursor: "pointer",
                }}
                src={settingsIcon}
              />
            );

            renderValues.stickyButtons.push(<EditButton />);
          }

          if (location.getName() === "bottom") {
            // buttons on left side
            renderValues.stickyButtons.push(
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
        } else if (!hasTools) {
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
