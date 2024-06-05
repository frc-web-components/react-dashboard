import "flexlayout-react/style/dark.css";
import {
  BorderNode,
  ITabSetRenderValues,
  Layout as FlexLayout,
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
import { setEditing } from "./store/slices/appSlice";
import Settings from "./tools/Settings";
import AddIcon from "@mui/icons-material/Add";
import { setFlexLayout } from "./store/slices/layoutSlice";
import { selectFlexLayout } from "./store/selectors/layoutSelectors";

const themes = new DashboardThemes();
themes.addThemeRules("dark", darkTheme);
themes.setTheme(document.body, "dark");

function Layout() {
  const layoutRef = useRef<FlexLayout>();
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
    <FlexLayout
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
          const visible = !model.getNodeById("settingsTab")?.isVisible();
          dispatch(setEditing(visible));
        }
        dispatch(setFlexLayout(model.toJson() as any));
        return action;
      }}
      onRenderTabSet={(
        tabSetNode: TabSetNode | BorderNode,
        renderValues: ITabSetRenderValues
      ) => {
        const isBorder = tabSetNode instanceof BorderNode;
        if (!isBorder) {
          renderValues.stickyButtons.push(
            <AddIcon
              onClick={() => {
                layoutRef!.current!.addTabToTabSet(tabSetNode.getId(), {
                  component: "components",
                  name: "Unnamed Tab",
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

export default Layout;
