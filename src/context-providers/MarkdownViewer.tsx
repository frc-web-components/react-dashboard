import MDEditor from "@uiw/react-md-editor";
import styles from './MarkdownViewer.module.scss';

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

export default MarkdownViewer;
