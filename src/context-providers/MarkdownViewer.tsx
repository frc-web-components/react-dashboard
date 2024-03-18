import React from "react";
import MDEditor from "@uiw/react-md-editor";
import styles from './MarkdownViewer.module.scss';

interface Props {
  markdown: string;
}

function MarkdownViewer({ markdown = '' }: Props) {
  const [value, setValue] = React.useState("**Hello world!!!**");
  return (
    <div className={styles['markdown-viewer']} data-color-mode="dark">
      {/* <MDEditor
        value={value}
        onChange={(value) => {
            setValue(value ?? '');
        }}
      /> */}
      <MDEditor.Markdown
        source={markdown}
        style={{ whiteSpace: "pre-wrap", background: "none" }}
      />
    </div>
  );
}

export default MarkdownViewer;
