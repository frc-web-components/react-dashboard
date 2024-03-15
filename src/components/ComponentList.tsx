import { ColDef } from "ag-grid-community";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-balham.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { AgGridReact } from "ag-grid-react";
import { useState } from "react";
import { useDropZone } from "../context-providers/DropZoneContext";
import { Gyro, BasicFmsInfo, Field } from "@frc-web-components/react";
import { DashboardComponent } from "./interfaces";

// export interface ComponentData {
//   name: string;
//   description: string;
//   component: React.ComponentType<any>;
// }

const defaultColumnDefs: ColDef[] = [
  {
    field: "dashboard.name",
    headerName: 'Name',
    editable: false,
    sortable: true,
    rowDrag: true,
  },
  {
    field: "dashboard.description",
    headerName: 'Description',
    sortable: false,
  },
];

const componentList: DashboardComponent[] = [
  {
    dashboard: {
      name: "Basic FMS Info",
      description: "",
      defaultSize: { width: 380, height: 100 },
      minSize: { width: 150, height: 90 },
    },
    properties: {},
    component: BasicFmsInfo,
  },
  {
    dashboard: {
      name: "Field",
      description: "",
      defaultSize: { width: 300, height: 150 },
      minSize: { width: 60, height: 60 },
    },
    properties: {},
    component: Field,
  },
  {
    dashboard: {
      name: "Gyro",
      description: "",
      defaultSize: { width: 200, height: 240 },
      minSize: { width: 120, height: 120 },
    },
    properties: {},
    component: Gyro,
  },
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
          <AgGridReact<DashboardComponent>
            onGridReady={(params) => setComponentGrid(params.api)}
            rowData={rowData}
            columnDefs={columnDefs}
            rowDragManaged={true}
            suppressMoveWhenRowDragging={true}
            getRowId={(params) => {
              return params.data.dashboard.name;
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default ComponentList;
