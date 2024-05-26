import WifiIcon from "@mui/icons-material/Wifi";
import WifiOffIcon from "@mui/icons-material/WifiOff";
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
import { useRef } from "react";
import { DashboardThemes, darkTheme } from "@frc-web-components/fwc/themes";
import Editor from "./tools/Editor";
import Tab from "./tab/Tab";
import { useAppDispatch, useAppSelector } from "./store/app/hooks";
import { selectConnectionStatus } from "./store/selectors/sourceSelectors";
import { setEditing } from "./store/slices/appSlice";
import Settings from "./tools/Settings";
import AddIcon from "@mui/icons-material/Add";
import { setFlexLayout } from "./store/slices/layoutSlice";
import { selectFlexLayout } from "./store/selectors/layoutSelectors";

const themes = new DashboardThemes();
themes.addThemeRules("dark", darkTheme);
themes.setTheme(document.body, "dark");

function App() {
  const layoutRef = useRef<Layout>();
  const connectionStatuses = useAppSelector(selectConnectionStatus);
  const layoutJson = useAppSelector(selectFlexLayout);
  const dispatch = useAppDispatch();

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
    <Layout
      ref={layoutRef as any}
      model={Model.fromJson(layoutJson)}
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
        dispatch(setFlexLayout(model.toJson() as any));
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
                  {status.connected ? <WifiIcon /> : <WifiOffIcon />}
                  {status.label}
                </div>
              );
            });
          }
        } else {
          renderValues.stickyButtons.push(
            <AddIcon
              onClick={() => {
                layoutRef!.current!.addTabToTabSet(tabSetNode.getId(), {
                  component: "components",
                  name: "Unnamed Tab",
                  enableFloat: true,
                });
              }}
              fontSize="small"
              style={{
                cursor: "pointer",
              }}
            />
          );
        }
      }}
    />
  );
}

export default App;
