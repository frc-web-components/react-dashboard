import MDEditor from "@uiw/react-md-editor";
import styles from "./MarkdownViewer.module.scss";
import { createComponent, markdownProp } from "./fromProps";

export const markdownViewer = createComponent(
  {
    dashboard: {
      name: "Markdown Viewer",
      description: "",
      defaultSize: { width: 200, height: 50 },
      minSize: { width: 50, height: 50 },
    },
    primaryProperty: 'markdown',
    acceptedSourceTypes: ['String'],
    properties: {
      markdown: markdownProp({ defaultValue: "## Hello there" }),
    },
  },
  ({ markdown }) => {
    return (
      <div className={`${styles["markdown-viewer"]}`} data-color-mode="dark">
        <MDEditor.Markdown
          source={markdown}
          style={{ background: "none" }}
        />
      </div>
    );
  }
);
