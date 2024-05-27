import WifiIcon from "@mui/icons-material/Wifi";
import WifiOffIcon from "@mui/icons-material/WifiOff";
import { useAppSelector } from "./store/app/hooks";
import { selectConnectionStatus } from "./store/selectors/sourceSelectors";
import {
  Button,
  ButtonGroup,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  MenuList,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CropSquareIcon from "@mui/icons-material/CropSquare";
import RemoveIcon from "@mui/icons-material/Remove";
import { MouseEvent, useState } from "react";
import ArticleIcon from '@mui/icons-material/Article';

function Titlebar() {
  const connectionStatuses = useAppSelector(selectConnectionStatus);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

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
        justifyContent: "space-between",
      }}
    >
      <div>
        <Button
          id="basic-button"
          aria-controls={open ? "basic-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
          onClick={handleClick}
          sx={{ color: "white", outline: "none" }}
          style={{
            outline: "none",
            textTransform: 'none'
          }}
          startIcon={<ArticleIcon fontSize="small" />}
        >
          File
        </Button>
        <Menu
          id="basic-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          MenuListProps={{
            "aria-labelledby": "basic-button",
          }}
          style={{
            outline: "none",
          }}
        >
          <MenuList
            dense
            style={{
              padding: 0,
            }}
          >
            <MenuItem onClick={handleClose}>New Dashboard</MenuItem>
            <MenuItem onClick={handleClose}>New Window</MenuItem>

            <Divider />

            <MenuItem onClick={handleClose}>Open Dashboard...</MenuItem>
            <MenuItem onClick={handleClose}>Save Dashboard</MenuItem>
            <MenuItem onClick={handleClose}>Save Dashboard As...</MenuItem>

            <Divider />

            <MenuItem onClick={handleClose}>Plugins</MenuItem>

            <Divider />

            <MenuItem onClick={handleClose}>Close Window</MenuItem>
            <MenuItem onClick={handleClose}>Quit</MenuItem>
          </MenuList>
        </Menu>
      </div>
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
