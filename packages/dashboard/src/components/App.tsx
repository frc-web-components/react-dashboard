import 'flexlayout-react/style/dark.css';
import Titlebar from './titlebar/Titlebar';
import {
  Action,
  Actions,
  Layout as FlexLayout,
  Model,
  TabNode,
} from 'flexlayout-react';
import Editor from './tools/editor/Editor';
import Settings from './tools/Settings';
import { appLayoutJson } from './app-layout';
import DashboardLayout from './DashboardLayout';
import { setEditing } from '@store/slices/appSlice';
import { useAppDispatch } from '@store/app/hooks';
import ThemeProvider from '@mui/material/styles/ThemeProvider';
import createTheme from '@mui/material/styles/createTheme';
import { useDashboardTheme } from '@/dashboard';
import CssBaseline from '@mui/material/CssBaseline/CssBaseline';
import { Box } from '@mui/material';

const model = Model.fromJson(appLayoutJson);
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    text: {
      primary: '#dddddd',
      secondary: '#aaaaaa',
      disabled: '#888888',
    },
    background: {
      default: '#121212',
    },
  },
});

const lightTheme = createTheme({
  palette: {
    mode: 'light',
    text: {
      primary: '#010101',
      secondary: '#cccccc',
      disabled: '#888888',
    },
    background: { default: '#fdfdfd' },
  },
  components: {
    MuiFormLabel: {
      styleOverrides: {
        root: {
          color: '#010101',
        },
      },
    },
  },
});

function App() {
  const dispatch = useAppDispatch();
  const [theme] = useDashboardTheme();

  return (
    <ThemeProvider theme={theme == 'dark' ? darkTheme : lightTheme}>
      <CssBaseline />
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          width: '100vw',
          height: '100vh',
          alignItems: 'stretch',
          padding: 3,
          boxSizing: 'border-box',
          background: 'primary.main',
        }}
      >
        <Titlebar />
        <div
          style={{
            position: 'relative',
            flex: '1',
          }}
        >
          <FlexLayout
            model={model}
            factory={(node: TabNode) => {
              const component = node.getComponent();

              if (component === 'dashboard') {
                return <DashboardLayout />;
              }

              if (component === 'editor') {
                return <Editor />;
              }

              if (component === 'settings') {
                return <Settings />;
              }
            }}
            onModelChange={(model, action: Action) => {
              const tabNode = action.data?.tabNode;
              if (
                action.type === Actions.SELECT_TAB &&
                tabNode === 'editorTab'
              ) {
                const visible = !model.getNodeById('editorTab')?.isVisible();
                dispatch(setEditing(visible));
              } else if (
                action.type === Actions.SELECT_TAB &&
                tabNode === 'settingsTab'
              ) {
                const visible = !model.getNodeById('settingsTab')?.isVisible();
                dispatch(setEditing(visible));
              }
              return action;
            }}
          />
        </div>
      </Box>
    </ThemeProvider>
  );
}

export default App;
