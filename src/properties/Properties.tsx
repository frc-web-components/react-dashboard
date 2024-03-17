import { ColDef, GridApi, RowDropZoneParams } from "ag-grid-community";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-balham.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { AgGridReact, CustomCellRendererProps } from "ag-grid-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useDropZone } from "../context-providers/DropZoneContext";
import { useAppSelector, useAppDispatch } from "../store/app/hooks";
import {
  selectSelectedComponent,
  updateComponentProperty,
  updateComponentSource,
} from "../store/slices/layoutSlice";
import { useComponents } from "../context-providers/ComponentContext";
import useResizeObserver from "@react-hook/resize-observer";

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
  type: string;
  defaultValue: unknown;
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
            provider: "NT",
            key: params.node.data.id,
          });
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
    <div
      ref={(el) => {
        if (el) {
          setElement(el);
        }
      }}
      style={{ height: "100%", display: "flex", gap: "3px" }}
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

const defaultColumnDefs: ColDef<PropertyData>[] = [
  {
    field: "name",
    editable: false,
  },
  // Using dot notation to access nested property
  {
    field: "defaultValue",
    editable: true,
    sortable: false,
    valueGetter: (params) => {
      return params.data?.defaultValue;
    },
    cellEditorSelector: (params) => {
      const type = params.data.type;
      if (type === "Number") {
        return {
          component: "agNumberCellEditor",
        };
      } else if (type === "String") {
        return {
          component: "agTextCellEditor",
        };
      } else if (type === "Boolean") {
        return {
          component: "agCheckboxCellEditor",
        };
      } else {
        return {
          component: "agTextCellEditor",
        };
      }
    },
    cellRendererSelector: (params) => {
      const type = params.data?.type;
      if (type === "Number") {
        return {
          component: "agNumberCellRenderer",
        };
      } else if (type === "String") {
        return {
          component: "agTextCellRenderer",
        };
      } else if (type === "Boolean") {
        return {
          component: "agCheckboxCellRenderer",
        };
      } else {
        return {
          component: "agTextCellRenderer",
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

function Properties() {
  const [columnDefs] = useState<ColDef[]>(defaultColumnDefs);
  const [gridApi, setGridApi] = useState<GridApi>();
  const selectedComponent = useAppSelector(selectSelectedComponent);
  const { components } = useComponents();
  const dispatch = useAppDispatch();
  const containerElementRef = useRef<HTMLElement>(null);
  useResizeObserver(containerElementRef, () => {
    if (gridApi) {
      console.log("!!!!!");
      gridApi.sizeColumnsToFit();
    };
  });

  const rowData = useMemo(() => {
    if (!selectedComponent || !components) {
      return [];
    }
    const component = components[selectedComponent.type];
    return (
      Object.entries(component?.properties).map(([name, property]) => {
        return {
          name,
          defaultValue:
            selectedComponent.properties[name]?.value ?? property.defaultValue,
          type: property.type,
          source: selectedComponent.properties[name].source,
        };
      }) ?? []
    );
  }, [selectedComponent, components]);

  useEffect(() => {
    if (gridApi) {
      console.log("????");

      gridApi.sizeColumnsToFit();
    }
  }, [gridApi]);

  // const [rowData, setRowData] = useState(gyroProperties);
  // const { setPropertiesDropZone, sourceGrid } = useDropZone(); // Use the context

  return (
    <div
      ref={containerElementRef as any}
      style={{ height: "100%", width: "100%" }}
    >
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
              return params.data.name;
            }}
            animateRows={false}
            onCellValueChanged={(event) => {
              const { newValue } = event;
              const colId = event.column.getColId();
              if (!selectedComponent) {
                return;
              }
              if (colId === "defaultValue") {
                dispatch(
                  updateComponentProperty({
                    componentId: selectedComponent.id,
                    propertyName: event.data.name,
                    propertyValue: newValue,
                  })
                );
              } else if (colId === "source") {
                dispatch(
                  updateComponentSource({
                    componentId: selectedComponent.id,
                    propertyName: event.data.name,
                    source: newValue,
                  })
                );
              }
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default Properties;
