import { CustomCellRendererProps } from "ag-grid-react";
import { PropertyContext, PropertyData } from "./Properties";
import collapseIcon from "/collapse.svg";
import expandIcon from "/expand.svg";
import { useCallback, useEffect, useState } from "react";
import { RowDropZoneParams } from "ag-grid-community";
import { useDropZone } from "../../context-providers/DropZoneContext";
import { useAppDispatch } from "../../store/app/hooks";
import { updateComponentPropertySource } from "../../store/slices/layoutSlice";

const NameCellRenderer = (
  props: CustomCellRendererProps<PropertyData, string, PropertyContext>
) => {
  const dispatch = useAppDispatch();

  const { data } = props;

  const isParent = !!props.data?.isParent;
  const expanded = props.context.expanded;

  const { sourceGrid } = useDropZone(); // Use the context
  const [element, setElement] = useState<HTMLElement>();
  const [dropZone, setDropZone] = useState<RowDropZoneParams>();

  const setComponentSource = useCallback(
    (key: string) => {
      if (!data) {
        return;
      }
      const { componentId, isParent, name } = data;
      if (!isParent) {
        dispatch(
          updateComponentPropertySource({
            componentId: componentId,
            propertyName: name,
            source: {
              provider: "NT",
              key,
            },
          })
        );
      }
    },
    [data]
  );

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
          setComponentSource(params.node.data.id);
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
      style={{
        cursor: "pointer",
        zIndex: 100,
        display: "flex",
        gap: 0,
        alignItems: "center",
        height: "100%",
      }}
    >
      <div
        style={{
          display: 'flex'
        }}
        onClick={() => {
          if (isParent) {
            props.context.toggleExpanded();
          }
        }}
      >
        {isParent && <img src={expanded ? collapseIcon : expandIcon} />}
      </div>
      <span
        style={{
          overflow: "hidden",
          textOverflow: "ellipsis",
          paddingLeft: isParent ? 0 : 18,
          fontWeight: isParent ? 'bold' : 'normal'
        }}
      >
        {props.data?.name}
      </span>
    </div>
  );
};

export default NameCellRenderer;
