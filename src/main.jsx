import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { RecoilRoot } from "recoil";
import { MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <RecoilRoot>
    <MantineProvider defaultColorScheme="light">
      <App />
    </MantineProvider>
  </RecoilRoot>
);
