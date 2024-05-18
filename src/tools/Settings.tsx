import { useState, useEffect } from "react";
import Stack from "@mui/material/Stack";
import Chip from "@mui/material/Chip";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { Box, Grid, Typography } from "@mui/material";
import NumberInput from "./number-input/NumberInput";
import { useSourceProvider } from "../context-providers/SourceProviderContext";
import { NT4Provider } from "../store/sources/nt4";

const addressOptions = ["localhost"];
const themeOptions = [{ label: "dark" }, { label: "light" }];

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

export default function Settings() {
  const [address, setAddress] = useState("localhost");
  const { providers } = useSourceProvider();

  useEffect(() => {
    (providers["NT"] as NT4Provider).connect(address);
  }, [address]);

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Box sx={{ flexGrow: 1, padding: "10px" }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="h5" gutterBottom>
              Dashboard Settings
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Autocomplete
              id="size-small-outlined"
              size="small"
              options={themeOptions}
              freeSolo
              defaultValue={themeOptions[0]}
              renderInput={(params) => <TextField {...params} label="Theme" />}
            />
          </Grid>
          <Grid item xs={12}>
            <Autocomplete
              id="size-small-outlined"
              size="small"
              options={addressOptions}
              freeSolo
              defaultValue={address}
              onChange={(_, value) => {
                if (value) {
                  setAddress(value);
                }
              }}
              renderInput={(params) => (
                <TextField {...params} label="Team/IP" />
              )}
            />
          </Grid>
          <Grid item xs={12}>
            <NumberInput
              initialValue={30}
              size="small"
              label="Grid Size"
              style={{ width: "100%" }}
            />
          </Grid>
          <Grid item xs={12}>
            <NumberInput
              initialValue={5}
              size="small"
              label="Grid Gap"
              style={{ width: "100%" }}
            />
          </Grid>
        </Grid>
      </Box>
    </ThemeProvider>
  );
}
