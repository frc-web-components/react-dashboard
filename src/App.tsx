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
  Action,
  Actions,
} from "flexlayout-react";
import { useEffect, useRef, useState } from "react";
import { DashboardThemes, darkTheme } from "@frc-web-components/fwc/themes";
import { layoutJson as defaultLayoutJson } from "./layout";
import SimpleDialog from "./tools/properties/SimpleDialog";
import Editor from "./tools/Editor";
import Tab from "./tab/Tab";
import { useAppDispatch, useAppSelector } from "./store/app/hooks";
import { selectConnectionStatus } from "./store/selectors/sourceSelectors";
import { setEditing } from "./store/slices/appSlice";
import Settings from "./tools/Settings";

const themes = new DashboardThemes();
themes.addThemeRules("dark", darkTheme);
themes.setTheme(document.body, 'dark');

function App() {
  const layoutRef = useRef<Layout>();
  const connectionStatuses = useAppSelector(selectConnectionStatus);
  const [layoutJson] = useState(defaultLayoutJson);
  const modelRef = useRef<Model>();
  const [isSettingsDialogOpen, setIsSettingsDialogOpen] = useState(false);
  const dispatch = useAppDispatch();

  useEffect(() => {
    modelRef.current = Model.fromJson(layoutJson);
  }, [layoutJson]);

  const factory = (node: TabNode) => {
    var component = node.getComponent();

    if (component === "components") {
      return <Tab tabId={node.getId()} />;
    }

    if (component === "editor") {
      return <Editor />;
    }

    if (component === "settings") {
      return <Settings />;
    }
  };

  return (
    <>
      <SimpleDialog
        title="Settings"
        isOpen={isSettingsDialogOpen}
        onClose={() => {
          setIsSettingsDialogOpen(false);
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              display: "flex",
              gap: "10px",
              alignItems: "center",
            }}
          >
            <div
              style={{
                width: "60px",
                color: "white",
              }}
            >
              Team/IP
            </div>
            <input
              style={{
                background: "#222",
                border: "1px solid #555",
                color: "white",
                padding: "5px",
                borderRadius: "2px",
              }}
              type="text"
              list="addresses"
              value={"localhost"}
            />
            <datalist id="addresses">
              <option>localhost</option>
            </datalist>
            {/* <CreatableSelect
              className="react-select-container"
              classNamePrefix="react-select"
              value={{ value: "127.0.0.1", label: "127.0.0.1" }}
              options={[{ value: "127.0.0.1", label: "127.0.0.1" }]}
            /> */}
          </div>
        </div>
      </SimpleDialog>
      <Layout
        ref={layoutRef as any}
        model={modelRef.current ?? Model.fromJson(layoutJson)}
        factory={factory}
        onModelChange={(model, action: Action) => {
          const tabNode = action.data?.tabNode;
          if (action.type === Actions.SELECT_TAB && tabNode === "editorTab") {
            const visible = !model.getNodeById("editorTab")?.isVisible();
            dispatch(setEditing(visible));
          } else if (
            action.type === Actions.SELECT_TAB &&
            tabNode === "settingsTab"
          ) {
            dispatch(setEditing(false));
          }
          return action;
        }}
        onRenderTabSet={(
          tabSetNode: TabSetNode | BorderNode,
          renderValues: ITabSetRenderValues
        ) => {
          if (tabSetNode instanceof BorderNode) {
            const location = tabSetNode.getLocation();

            if (location.getName() === "bottom") {
              Object.values(connectionStatuses).forEach((status) => {
                // buttons on left side
                renderValues.stickyButtons.push(
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      color: status.connected ? "green" : "red",
                      gap: "5px",
                    }}
                  >
                    <img
                      src={status.connected ? connectedIcon : disconnectedIcon}
                    />
                    {status.label}
                  </div>
                );
              });
            }
          } else {
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
    </>
  );
}

export default App;
