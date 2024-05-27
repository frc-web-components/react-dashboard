import WifiIcon from "@mui/icons-material/Wifi";
import WifiOffIcon from "@mui/icons-material/WifiOff";
import { useAppSelector } from "./store/app/hooks";
import { selectConnectionStatus } from "./store/selectors/sourceSelectors";
import { ButtonGroup, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CropSquareIcon from "@mui/icons-material/CropSquare";
import RemoveIcon from "@mui/icons-material/Remove";

function Titlebar() {
  const connectionStatuses = useAppSelector(selectConnectionStatus);

  return (
    <div
      className="fwc-titlebar"
      data-tauri-drag-region
      style={{
        height: "33px",
        background: "black",
        borderBottom: "1px solid #333",
        display: "flex",
        alignItems: "center",
        // padding: "0 7px",
        paddingLeft: '7px',
        justifyContent: "space-between",
      }}
    >
      <div>
        {Object.values(connectionStatuses).map((status) => {
          return (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                color: status.connected ? "green" : "red",
                gap: "5px",
                fontSize: "15px",
              }}
            >
              {status.connected ? (
                <WifiIcon fontSize="small" />
              ) : (
                <WifiOffIcon fontSize="small" />
              )}
              {status.label}
            </div>
          );
        })}
      </div>
      <div>
        <ButtonGroup variant="outlined" aria-label="Loading button group">
          <IconButton
            aria-label="Minimize"
            style={{
              outline: "none",
            }}
          >
            <RemoveIcon fontSize="small" />
          </IconButton>
          <IconButton
            aria-label="Maximize"
            style={{
              outline: "none",
            }}
          >
            <CropSquareIcon sx={{ fontSize: 17 }} />
          </IconButton>
          <IconButton
            aria-label="Close"
            style={{
              outline: "none",
            }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </ButtonGroup>
      </div>
    </div>
  );
}

export default Titlebar;
