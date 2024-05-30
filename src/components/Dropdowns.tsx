import { Autocomplete, TextField } from "@mui/material";
import { createComponent, stringArrayProp, stringProp } from "./fromProps";

export const sendableChooser = createComponent(
  {
    dashboard: {
      name: "Sendable Chooser",
      description: "",
      defaultSize: { width: 100, height: 100 },
      minSize: { width: 20, height: 20 },
    },
    primaryProperty: "selected",
    properties: {
      options: stringArrayProp(),
      selected: stringProp(),
      default: stringProp(),
      active: stringProp(),
      label: stringProp({ defaultValue: "Auto Choices" }),
    },
  },
  ({
    options,
    selected,
    default: defaultValue,
    active,
    label,
    setProperty,
  }) => {
    return (
      <div>
        <Autocomplete
          style={{
            // width: "100%",
            height: "auto",
          }}
          onChange={(_, newValue) => {
            if (newValue !== null) {
              setProperty("selected", newValue);
            }
          }}
          options={options}
          value={selected}
          renderInput={(params) => (
            <TextField {...params} label={label} variant="standard" />
          )}
        />
      </div>
    );
  }
);
