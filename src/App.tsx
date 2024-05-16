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
import { useNt4 } from "@frc-web-components/react";
import { DashboardThemes, darkTheme } from "@frc-web-components/fwc/themes";
import { layoutJson as defaultLayoutJson } from "./layout";
import SimpleDialog from "./tools/properties/SimpleDialog";
import Editor from "./tools/Editor";
import Tab from "./tab/Tab";
import { useAppDispatch } from "./store/app/hooks";
import { setEditing, toggleEditing } from "./store/slices/appSlice";

const themes = new DashboardThemes();
themes.addThemeRules("dark", darkTheme);

function App() {
  const layoutRef = useRef<Layout>();
  const { nt4Provider } = useNt4();
  const [isNt4Connected, setIsNt4Connected] = useState(false);
  const [layoutJson] = useState(defaultLayoutJson);
  const modelRef = useRef<Model>();
  const [isSettingsDialogOpen, setIsSettingsDialogOpen] = useState(false);
  const dispatch = useAppDispatch();


  useEffect(() => {
    modelRef.current = Model.fromJson(layoutJson);
  }, [layoutJson]);

  useEffect(() => {
    nt4Provider.addConnectionListener((connected) => {
      setIsNt4Connected(connected);
    });
  }, [nt4Provider]);

  const factory = (node: TabNode) => {
    var component = node.getComponent();

    if (component === "components") {
      return <Tab tabId={node.getId()} />;
    }

    if (component === "editor") {
      return <Editor />;
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
          if (action.type === Actions.SELECT_TAB && tabNode === 'editorTab') {
            const visible = !model.getNodeById('editorTab')?.isVisible();
            dispatch(setEditing(visible));
          } else if (action.type === Actions.SELECT_TAB && tabNode === 'settingsTab') {
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
                  <img
                    src={isNt4Connected ? connectedIcon : disconnectedIcon}
                  />
                  NetworkTables
                </div>
              );
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
