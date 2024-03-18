import { CustomCellEditorProps } from "ag-grid-react";
import React, { memo, useEffect, useRef, useState } from "react";
import MDEditor, {
  ICommand,
  commands,
  divider,
  getCommands,
} from "@uiw/react-md-editor";
import { PropertyData } from "./Properties";

export default memo((props: CustomCellEditorProps<PropertyData>) => {
  const { value, onValueChange, stopEditing } = props;

  console.log("PROPS:", props, onValueChange);
  const isHappy = (value: string) => value === "Happy";

  const onClick = (happy: boolean) => {
    onValueChange(happy ? "Happy" : "Sad");
    stopEditing();
  };

  const title3: ICommand = {
    name: "title3",
    keyCommand: "title3",
    buttonProps: { "aria-label": "Insert title3" },
    icon: (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: '5px'
        }}
      >
        <svg
          width="12"
          height="12"
          viewBox="0 0 12 12"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M 1,6 L 4,9 L 11,2"
            stroke="white"
            fill="none"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
        <span style={{  }}>Finish Editing</span>
      </div>
    ),
    execute: (state, api) => {
      stopEditing();
    },
  };
  // const [editorValue, setValue] = React.useState("**Hello world!!!**");

  return (
    <div className="container" data-color-mode="dark" style={{ width: "100%" }}>
      <MDEditor
        value={value}
        onChange={(value) => {
          onValueChange(value ?? "");
          // setValue(value ?? "");
        }}
        commands={[title3, divider, ...getCommands()]}
        fullscreen
      />
    </div>
  );
});
