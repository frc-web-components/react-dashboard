import { ColDef, ValueGetterParams } from "ag-grid-community";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-balham.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import collapseIcon from "/collapse.svg";
import expandIcon from "/expand.svg";
import { AgGridReact, CustomCellRendererProps } from "ag-grid-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useDropZone } from "../../context-providers/DropZoneContext";
import { useAppSelector } from "../../store/app/hooks";
import {
  selectSourceTreePreview,
  SourceTreePreview,
  selectSourceTree,
  SourceTree,
} from "../../store/selectors/sourceSelectors";
import useResizeObserver from "@react-hook/resize-observer";
import styles from './Sources.module.scss';

export interface SourceData {
  name: string;
  value: unknown;
  type: string;
  parent: boolean;
  expanded: boolean;
  id: string;
  level: number;
}

function Sources() {
  const sourceTree = useAppSelector((state) =>
    selectSourceTreePreview(state, "NT", "")
  );

  const [expandedSources, setExpandedSources] = useState<string[]>([]);
  const { sourceGrid, setSourceGrid } = useDropZone(); // Use the context
  const containerElementRef = useRef<HTMLElement>(null);

  useResizeObserver(containerElementRef, () => {
    if (sourceGrid) {
      sourceGrid.sizeColumnsToFit();
    }
  });

  useEffect(() => {
    if (sourceGrid) {
      sourceGrid.sizeColumnsToFit();
    }
  }, [sourceGrid]);

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
    {
      field: "type",
      sortable: false,
    },
    // Show default header name
  ]);

  const nt4Data = useMemo(() => {
    const data: SourceData[] = [];

    const addData = (
      name: string,
      tree: SourceTreePreview,
      parentId: string,
      level: number
    ) => {
      const id = [parentId, name].join("/");
      const parent = Object.keys(tree.children).length > 0;
      const expanded = expandedSources.includes(id);
      const sourceData: SourceData = {
        name,
        value: '', // tree.value,
        type: tree.type ?? "",
        id,
        expanded,
        parent,
        level,
      };
      data.push(sourceData);

      if (parent && expanded) {
        Object.values(tree.children).forEach((childSource) => {
          addData(
            childSource.key.split("/").pop() ?? "",
            childSource,
            id,
            level + 1
          );
        });
      }
    };

    if (sourceTree) {
      Object.values(sourceTree.children).forEach((childSource) => {
        addData(childSource.key.split("/").pop() ?? "", childSource, "", 0);
      });
    }
    return data;
  }, [sourceTree, expandedSources]);

  return (
    <div
      ref={containerElementRef as any}
      style={{ height: "100%", width: "100%" }}
      className={styles.sources}
    >
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
