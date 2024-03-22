import { CustomCellRendererProps } from "ag-grid-react";
import { PropertyData } from "./Properties";
import collapseIcon from "/collapse.svg";
import expandIcon from "/expand.svg";

const NameCellRenderer = (
    props: CustomCellRendererProps<PropertyData, boolean>
  ) => {
    const expanded = !!props.value;
    return (
      <div
        style={{
          cursor: "pointer",
          zIndex: 100,
          display: "flex",
          gap: 0,
          alignItems: "center",
        }}
        onClick={() => {
            props.setValue?.(!expanded);
        }}
      >
        <img src={expanded ? collapseIcon : expandIcon} />
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