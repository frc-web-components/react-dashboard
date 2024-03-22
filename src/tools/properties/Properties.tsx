import { ColDef, GridApi, IsFullWidthRowParams } from "ag-grid-community";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-balham.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { AgGridReact } from "ag-grid-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useAppSelector, useAppDispatch } from "../../store/app/hooks";
import {
  updateComponentProperty,
  updateComponentSource,
} from "../../store/slices/layoutSlice";
import {
  ComponentConfig,
  useComponentConfigs,
} from "../../context-providers/ComponentConfigContext";
import useResizeObserver from "@react-hook/resize-observer";
import MarkdownEditor from "./MarkdownEditor";
import { selectSelectedComponent } from "../../store/selectors/layoutSelectors";
import { SourceCellRenderer } from "./SourceCellRenderer";
import { ColorCellRenderer } from "./ColorCellRenderer";

export interface SourceData {
  key: string;
  provider: string;
}

export interface PropertyData {
  isParent?: boolean;
  name: string;
  source?: SourceData;
  type: string;
  defaultValue: unknown;
  componentConfig: ComponentConfig;
}

const defaultColumnDefs: ColDef<PropertyData>[] = [
  {
    field: "name",
    editable: false,
    sortable: false,
    cellRendererSelector: (params) => {
      if (params.data?.isParent) {
        return {
          component: 
        };
      }
      return {
        component: 'agTextCellRenderer'
      }
    }
  },
  {
    field: "source",
    editable: false,
    sortable: false,
    cellRenderer: SourceCellRenderer,
  },
  // Using dot notation to access nested property
  {
    field: "defaultValue",
    // editable: true,
    sortable: false,
    suppressKeyboardEvent: (params) => {
      if (!params.data) {
        return false;
      }
      const { componentConfig, name } = params.data;
      const { input } = componentConfig.properties[name];
      return input?.type === "Markdown";
    },

    valueGetter: (params) => {
      return params.data?.defaultValue;
    },
    editable: (params) => {
      if (!params.data) {
        return true;
      }
      const { componentConfig, name } = params.data;
      const { input } = componentConfig.properties[name];
      return input?.type !== "Color";
    },
    cellEditorSelector: (params) => {
      const { type, componentConfig, name } = params.data;
      const { input } = componentConfig.properties[name];
      if (type === "Markdown") {
        return {
          component: MarkdownEditor,
          popup: true,
        };
      }
      if (type === "Number") {
        return {
          component: "agNumberCellEditor",
          params: {
            min: input?.min,
            max: input?.max,
            step: input?.step,
            precision: input?.precision,
            showStepperButtons: true,
          },
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
      if (!params.data) {
        return {
          component: "agTextCellRenderer",
        };
      }
      const { type } = params.data;
      if (type === "Color") {
        return {
          component: ColorCellRenderer,
        };
      } else if (type === "Number") {
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
];

function Properties() {
  const [columnDefs] = useState<ColDef[]>(defaultColumnDefs);
  const [gridApi, setGridApi] = useState<GridApi>();
  const selectedComponent = useAppSelector(selectSelectedComponent);
  const { components } = useComponentConfigs();
  const dispatch = useAppDispatch();
  const containerElementRef = useRef<HTMLElement>(null);
  useResizeObserver(containerElementRef, () => {
    if (gridApi) {
      gridApi.sizeColumnsToFit();
    }
  });

  const rowData: PropertyData[] = useMemo(() => {
    if (!selectedComponent || !components) {
      return [];
    }
    const component = components[selectedComponent.type];
    const propertyRows =
      Object.entries(component?.properties).map(([name, property]) => {
        return {
          name,
          defaultValue:
            selectedComponent.properties[name]?.value ?? property.defaultValue,
          type: property.input?.type ?? property.type,
          source: selectedComponent.properties[name].source,
          componentConfig: component,
        };
      }) ?? [];
      return propertyRows;
  }, [selectedComponent, components]);

  useEffect(() => {
    if (gridApi) {
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
            localeText={{
              noRowsToShow: "No properties to show",
            }}
            rowData={rowData}
            columnDefs={columnDefs}
            rowDragManaged={true}
            suppressMoveWhenRowDragging={true}
            suppressRowDrag={true}
            getRowId={(params) => {
              if ("name" in params.data) {
                return params.data.name;
              }
              return "parent";
            }}
            animateRows={false}
            reactiveCustomComponents

            onCellValueChanged={(event) => {
              console.log("VALUE:", event);
              const { newValue } = event;
              const colId = event.column.getColId();
              if (!selectedComponent) {
                return;
              }
              if (!("name" in event.data)) {
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
