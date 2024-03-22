import { CustomCellRendererProps } from "ag-grid-react";
import { PropertyData } from "./Properties";
import styles from './ColorCellRenderer.module.scss';

export const ColorCellRenderer = (
  props: CustomCellRendererProps<PropertyData>
) => {
  
  return (
    <div className={styles['color-cell']}>
      <input
        type="color"
        value={props.value}
        onChange={(ev) => {
          props.setValue?.(ev.target.value);
        }}
      />
    </div>
  );
};
