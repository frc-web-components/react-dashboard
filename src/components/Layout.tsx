import "flexlayout-react/style/dark.css";
import {
  Action,
  Actions,
  Layout as FlexLayout,
  Model,
  TabNode,
} from "flexlayout-react";
import { DashboardThemes, darkTheme } from "@frc-web-components/fwc/themes";
import Editor from "./tools/editor/Editor";
import Settings from "./tools/Settings";
import { appLayoutJson } from "./app-layout";
import DashboardLayout from "./DashboardLayout";
import { setEditing } from "../store/slices/appSlice";
import { useAppDispatch } from "../store/app/hooks";

const themes = new DashboardThemes();
themes.addThemeRules("dark", darkTheme);
themes.setTheme(document.body, "dark");

const model = Model.fromJson(appLayoutJson);

function Layout() {
  const dispatch = useAppDispatch();

  const factory = (node: TabNode) => {
    var component = node.getComponent();

    if (component === "dashboard") {
      return <DashboardLayout />;
    }

    if (component === "editor") {
      return <Editor />;
    }

    if (component === "settings") {
      return <Settings />;
    }
  };

  return (
    <FlexLayout
      model={model}
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
          const visible = !model.getNodeById("settingsTab")?.isVisible();
          dispatch(setEditing(visible));
        }
        return action;
      }}
    />
  );
}

export default Layout;
