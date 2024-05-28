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
import { MouseEvent, useEffect, useState } from "react";
import ArticleIcon from "@mui/icons-material/Article";
import { useDashboard } from "./context-providers/DashboardContext";
import PluginsDialog from "./PluginsDialog";

function Titlebar() {
  const { dashboard } = useDashboard();
  const connectionStatuses = useAppSelector(selectConnectionStatus);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const [dashboardTitle, setDashboardTitle] = useState(dashboard.getTitle());

  const [pluginsDialogOpen, setPluginsDialogOpen] = useState(false);

  useEffect(() => {
    dashboard.on('dashboardTitleChange', title => {
      setDashboardTitle(title);
    });
  }, [dashboard]);

  return (
    <>
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
              textTransform: "none",
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
              <MenuItem
                onClick={() => {
                  dashboard.emit("newDashboardMenuClickEvent");
                  handleClose();
                }}
              >
                New Dashboard
              </MenuItem>
              <MenuItem
                onClick={() => {
                  dashboard.emit("newWindowMenuClickEvent");
                  handleClose();
                }}
              >
                New Window
              </MenuItem>

              <Divider />

              <MenuItem
                onClick={() => {
                  dashboard.emit("openDashboardMenuClickEvent");
                  handleClose();
                }}
              >
                Open Dashboard...
              </MenuItem>
              <MenuItem
                onClick={() => {
                  dashboard.emit("saveDashboardMenuClickEvent");
                  handleClose();
                }}
              >
                Save Dashboard
              </MenuItem>
              <MenuItem
                onClick={() => {
                  dashboard.emit("saveDashboardAsMenuClickEvent");
                  handleClose();
                }}
              >
                Save Dashboard As...
              </MenuItem>

              <Divider />

              <MenuItem
                onClick={() => {
                  dashboard.emit("pluginsMenuClickEvent");
                  setPluginsDialogOpen(true);
                  handleClose();
                }}
              >
                Plugins
              </MenuItem>

              <Divider />

              <MenuItem
                onClick={() => {
                  dashboard.emit("closeWindowMenuClickEvent");
                  handleClose();
                }}
              >
                Close Window
              </MenuItem>
              <MenuItem
                onClick={() => {
                  dashboard.emit("quitMenuClickEvent");
                  handleClose();
                }}
              >
                Quit
              </MenuItem>
            </MenuList>
          </Menu>
        </div>
        <div style={{ fontSize: 20, color: '#ccc', userSelect: 'none' }}>{dashboardTitle}</div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "5px",
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
                    userSelect: 'none'
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
          <ButtonGroup variant="outlined" aria-label="Loading button group">
            <IconButton
              aria-label="Minimize"
              style={{
                outline: "none",
              }}
              onClick={() => {
                dashboard.emit("minimizeWindowClickEvent");
              }}
            >
              <RemoveIcon fontSize="small" />
            </IconButton>
            <IconButton
              aria-label="Maximize"
              style={{
                outline: "none",
              }}
              onClick={() => {
                dashboard.emit("maximizeWindowClickEvent");
              }}
            >
              <CropSquareIcon sx={{ fontSize: 17 }} />
            </IconButton>
            <IconButton
              aria-label="Close"
              style={{
                outline: "none",
              }}
              onClick={() => {
                dashboard.emit("closeWindowClickEvent");
              }}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </ButtonGroup>
        </div>
      </div>
      <PluginsDialog
        open={pluginsDialogOpen}
        onClose={() => setPluginsDialogOpen(false)}
      />
    </>
  );
}

export default Titlebar;
