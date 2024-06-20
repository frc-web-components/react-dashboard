import { RowDropZoneParams } from "ag-grid-community";
import { CustomCellRendererProps } from "ag-grid-react";
import { useEffect, useState } from "react";
import { useDropZone } from "@context-providers/DropZoneContext";
import { PropertyData, SourceData } from "./Properties";

export const SourceCellRenderer = (
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
          props.setValue?.(params.node.data.source);
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
