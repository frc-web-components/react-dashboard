import {
  AgGridReact,
  CustomCellEditorProps,
  CustomCellRendererProps,
} from "ag-grid-react";
import { PropertyData } from "./Properties";
import styles from "./NumberArrayEditor.module.scss";
import { ColDef } from "ag-grid-community";
import { useMemo } from "react";
import SimpleDialog from "./SimpleDialog";

export interface NumberValue {
  index: number;
  value: number;
}

export const NumberRenderer = (
  props: CustomCellRendererProps<NumberValue, number>
) => {
  return (
    <div
      style={{
        display: "flex",
        position: "relative",
        width: "100%",
        alignItems: "stretch",
        height: "100%",
      }}
    >
      <span
        style={{
          display: "inline-block",
          marginRight: "6px",
        }}
      >
        [{props.data?.index}]
      </span>
      <input
        style={{
          flex: "1",
          minWidth: 0,
          border: "none",
        }}
        type="number"
        value={props.value ?? 0}
      />
      <button className={styles["action-buttons"]}>+</button>
      <button className={styles["action-buttons"]}>-</button>
    </div>
  );
};

const colDefs: ColDef[] = [
  {
    field: "value",
    rowDrag: true,
    editable: false,
    cellRenderer: NumberRenderer,
    resizable: false,
    flex: 1,
  },
];

export const NumberArrayEditor = (
  props: CustomCellEditorProps<PropertyData, number[]>
) => {
  const numberArray: NumberValue[] = useMemo(() => {
    if (!props.value) {
      return [];
    }
    return props.value.map((value, index) => {
      return {
        index,
        value,
      };
    });
  }, [props.value]);

  return (
    <>
      <SimpleDialog title="Array Editor">
        <div
          style={{
            height: "200px",
            width: "100%",
            display: "flex",
            flexDirection: "column",
          }}
          className={styles["number-array-editor"]}
        >
          <div
            style={{ flex: "1", width: "100%" }}
            className={"ag-theme-balham-dark"}
          >
            <AgGridReact<NumberValue>
              columnDefs={colDefs}
              rowData={numberArray}
              headerHeight={0}
            />
          </div>
        </div>
      </SimpleDialog>
    </>
  );
};
