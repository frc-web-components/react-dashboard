import { ColDef, GridApi, ValueGetterParams } from "ag-grid-community";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-balham.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import collapseIcon from "/collapse.svg";
import expandIcon from "/expand.svg";
import { AgGridReact, CustomCellRendererProps } from "ag-grid-react";
import { useEffect, useMemo, useState } from "react";
import { useJson } from "@frc-web-components/react";
import { useDropZone } from "../../context-providers/DropZoneContext";

export interface SourceData {
  name: string;
  value: unknown;
  parent: boolean;
  expanded: boolean;
  id: string;
  level: number;
}

function Sources() {
  const json = useJson("", {}, false);
  const [expandedSources, setExpandedSources] = useState<string[]>([]);
  const { setSourceGrid } = useDropZone(); // Use the context

  const NameCellRenderer = (
    props: CustomCellRendererProps<SourceData, number>
  ) => {
    const level = props.data?.level ?? 0;
    if (!props.data?.parent) {
      return (
        <span style={{ paddingLeft: Math.max(level * 13, 5) }}>
          {props.data?.name}
        </span>
      );
    }
    return (
      <div
        style={{
          cursor: "pointer",
          zIndex: 100,
          paddingLeft: level * 8,
          display: "flex",
          gap: 0,
          alignItems: "center",
        }}
        onClick={() => {
          setExpandedSources((prev) => {
            const prevSet = new Set(prev);
            if (props.data?.expanded) {
              prevSet.delete(props.data.id);
            } else if (props.data) {
              prevSet.add(props.data.id);
            }
            return [...prevSet];
          });
        }}
      >
        <img src={props.data.expanded ? collapseIcon : expandIcon} />
        <span
          style={{
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {props.data?.name}
        </span>
      </div>
    );
  };

  const [columnDefs] = useState<ColDef[]>([
    {
      field: "name",
      cellRenderer: NameCellRenderer,
      editable: false,
      valueGetter: (params: ValueGetterParams) =>
        params.data.expanded ? "-" : "+",
      rowDrag: true,
      sortable: false,
    },
    // Using dot notation to access nested property
    {
      field: "value",
      editable: true,
      sortable: false,
      cellEditorSelector: (params) => {
        const value = params.data.value;
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
        const value = params.data.value;
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
    // Show default header name
  ]);

  const nt4Data = useMemo(() => {
    const data: SourceData[] = [];

    const addData = (
      name: string,
      value: unknown,
      parentId: string,
      level: number
    ) => {
      const id = [parentId, name].join("/");
      const parent = typeof value === "object" && !(value instanceof Array);
      const expanded = expandedSources.includes(id);
      const sourceData: SourceData = {
        name,
        value: !parent ? value : undefined,
        id,
        expanded,
        parent,
        level,
      };
      data.push(sourceData);

      if (parent && expanded) {
        Object.entries(value as any).forEach(([name, value]) => {
          addData(name, value, id, level + 1);
        });
      }
    };

    if (json) {
      Object.entries(json).forEach(([name, value]) => {
        addData(name, value, "", 0);
      });
    }
    return data;
  }, [json, expandedSources]);

  return (
    <div style={{ height: "100%", width: "100%" }}>
      <div style={{ height: "100%", boxSizing: "border-box" }}>
        <div
          style={{ height: "100%", width: "100%" }}
          className={"ag-theme-balham-dark"}
        >
          <AgGridReact<SourceData>
            onGridReady={(params) => {
              setSourceGrid(params.api);
            }}
            localeText={{
              noRowsToShow: "No sources to show",
            }}
            getRowId={(props) => {
              return props.data.id;
            }}
            rowData={nt4Data}
            columnDefs={columnDefs}
            rowDragManaged={true}
            suppressMoveWhenRowDragging={true}
          />
        </div>
      </div>
    </div>
  );
}

export default Sources;
