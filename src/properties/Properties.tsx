import { ColDef, GridApi, RowDropZoneParams } from "ag-grid-community";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-balham.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { AgGridReact, CustomCellRendererProps } from "ag-grid-react";
import { useEffect, useMemo, useState } from "react";
import { useDropZone } from "../context-providers/DropZoneContext";

interface SourceData {
  key: string;
  provider: string;
}

export interface PropertyData {
  name: string;
  source?: {
    key: string;
    provider: string;
  };
  defaultValue: unknown;
  id: string;
}

const SourceCellRenderer = (
  props: CustomCellRendererProps<PropertyData, SourceData>
) => {
  const { sourceGrid } = useDropZone(); // Use the context
  const [element, setElement] = useState<HTMLElement>();
  const [dropZone, setDropZone] = useState<RowDropZoneParams>();
  
  useEffect(() => {
    if (sourceGrid && element) {
      if (dropZone) {
        sourceGrid.removeRowDropZone(dropZone);
      }
      const dropZoneParams: RowDropZoneParams = {
        getContainer() {
            return element;
        },
        onDragStop(params) {
          
          props.setValue?.({
            provider: 'NT',
            key: params.node.data.id
          });
            console.log('param data:', params.node.data.id, props.setValue);
        },
      };
      sourceGrid.addRowDropZone(dropZoneParams);
      setDropZone(dropZoneParams);
    }
    return () => {
      if (dropZone && sourceGrid) {
        sourceGrid.removeRowDropZone(dropZone);
      }
    };
  }, [sourceGrid, element]);

  return (
    <div ref={el => {
      if (el) {
        setElement(el);
      }
    }}
      style={{ height: '100%', display: 'flex', gap: '3px'}}
    >
      {props.value && (
        <>
          <div>{props.value.provider}:</div>
          <div>{props.value.key}</div>
        </>
      )}
    </div>
  );
};


const defaultColumnDefs: ColDef[] = [
  {
    field: "name",
    editable: false,
  },
  // Using dot notation to access nested property
  {
    field: "defaultValue",
    editable: true,
    sortable: false,
    cellEditorSelector: (params) => {
      const value = params.data.defaultValue;
      if (typeof value === "number") {
        return {
          component: "agNumberCellEditor",
        };
      } else if (typeof value === "string") {
        return {
          component: "agTextCellEditor",
        };
      } else if (typeof value === "boolean") {
        return {
          component: "agCheckboxCellEditor",
        };
      } else {
        return {
          component: "adsfs",
        };
      }
    },
    cellRendererSelector: (params) => {
      const value = params.data.defaultValue;
      if (typeof value === "number") {
        return {
          component: "agNumberCellRenderer",
        };
      } else if (typeof value === "string") {
        return {
          component: "agTextCellRenderer",
        };
      } else if (typeof value === "boolean") {
        return {
          component: "agCheckboxCellRenderer",
        };
      }
    },
  },
  {
    field: "source",
    editable: true,
    sortable: false,
    cellRenderer: SourceCellRenderer,
  },
  // Show default header name
];

const gyroProperties: PropertyData[] = [
  { name: "value", defaultValue: 0, id: "1" },
  { name: "hideLabel", defaultValue: false, id: "2" },
  { name: "precision", defaultValue: 2, id: "3" },
  { name: "counterClockwise", defaultValue: false, id: "4" },
  { name: "fromRadians", defaultValue: false, id: "5" },
];

function Properties() {
  const [columnDefs] = useState<ColDef[]>(defaultColumnDefs);
  const [gridApi, setGridApi] = useState<GridApi>();
  const [rowData, setRowData] = useState(gyroProperties);
  // const { setPropertiesDropZone, sourceGrid } = useDropZone(); // Use the context

  return (
    <div style={{ height: "100%", width: "100%" }}>
      <div style={{ height: "100%", boxSizing: "border-box" }}>
        <div
          style={{ height: "100%", width: "100%" }}
          className={"ag-theme-balham-dark"}
        >
          <AgGridReact<PropertyData>
            onGridReady={(params) => setGridApi(params.api)}
            rowData={rowData}
            columnDefs={columnDefs}
            rowDragManaged={true}
            suppressMoveWhenRowDragging={true}
            suppressRowDrag={true}
            getRowId={(params) => {
              return params.data.id;
            }}
            animateRows={false}

          />
        </div>
      </div>
    </div>
  );
}

export default Properties;
