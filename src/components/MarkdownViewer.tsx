import MDEditor from "@uiw/react-md-editor";
import styles from './MarkdownViewer.module.scss';
import { ComponentConfig } from "../context-providers/ComponentConfigContext";

interface Props {
  markdown: string;
}

function MarkdownViewer({ markdown = '' }: Props) {
  return (
    <div className={styles['markdown-viewer']} data-color-mode="dark">
      <MDEditor.Markdown
        source={markdown}
        style={{ whiteSpace: "pre-wrap", background: "none" }}
      />
    </div>
  );
}

export const markdownViewerConfig: ComponentConfig = {
  dashboard: {
    name: "Markdown Viewer",
    description: "",
    defaultSize: { width: 200, height: 50 },
    minSize: { width: 50, height: 50 },
  },
  properties: {
    markdown: {
      type: "String",
      defaultValue: "## Hello there",
      input: {
        type: "Markdown",
      },
    },
  },
  component: MarkdownViewer,
}
