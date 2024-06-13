import { DashboardThemes, darkTheme } from "@frc-web-components/fwc/themes";
import Layout from "./Layout";
import Titlebar from "./titlebar/Titlebar";

const themes = new DashboardThemes();
themes.addThemeRules("dark", darkTheme);
themes.setTheme(document.body, "dark");

function App() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100vw",
        height: "100vh",
        alignItems: "stretch",
        padding: '3px',
        boxSizing: 'border-box',
        background: 'black',
      }}
    >
      <Titlebar />
      <div
        style={{
          position: "relative",
          flex: "1",
        }}
      >
        <Layout />
      </div>
    </div>
  );
}

export default App;
