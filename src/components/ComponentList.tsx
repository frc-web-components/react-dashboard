import { ColDef, GridApi, RowDropZoneParams } from "ag-grid-community";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-balham.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { AgGridReact, CustomCellRendererProps } from "ag-grid-react";
import { useEffect, useMemo, useState } from "react";
import { useDropZone } from "../context-providers/DropZoneContext";

export interface ComponentData {
  name: string;
  description: string;
}

const defaultColumnDefs: ColDef[] = [
  {
    field: "name",
    editable: false,
    sortable: true,
    rowDrag: true,
  },
  {
    field: "description",
    sortable: false,
  }
];

const componentList: ComponentData[] = [
  { name: "Basic FMS Info", description: "" },
  { name: "Field", description: "" },
  { name: "Gyro", description: "" },
];

function ComponentList() {
  const [columnDefs] = useState<ColDef[]>(defaultColumnDefs);
  const [rowData] = useState(componentList);
  const { setComponentGrid } = useDropZone(); // Use the context
  // const { setPropertiesDropZone, sourceGrid } = useDropZone(); // Use the context

  return (
    <div style={{ height: "100%", width: "100%" }}>
      <div style={{ height: "100%", boxSizing: "border-box" }}>
        <div
          style={{ height: "100%", width: "100%" }}
          className={"ag-theme-balham-dark"}
        >
          <AgGridReact<ComponentData>
            onGridReady={(params) => setComponentGrid(params.api)}
            rowData={rowData}
            columnDefs={columnDefs}
            rowDragManaged={true}
            suppressMoveWhenRowDragging={true}
            getRowId={(params) => {
              return params.data.name;
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default ComponentList;
