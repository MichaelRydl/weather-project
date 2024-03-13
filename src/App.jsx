import cx from "clsx";
import {
  Divider,
  MantineThemeProvider,
  useComputedColorScheme,
} from "@mantine/core";
import classes from "./App.module.css";
import Header from "./components/Header/Header";
import Main from "./components/Main/Main";
import Side from "./components/Side/Side";

const App = () => {
  const computedColorScheme = useComputedColorScheme("light", {
    getInitialValueInEffect: true,
  });

  return (
    <MantineThemeProvider>
      <div
        className={cx(
          classes.app,
          computedColorScheme === "light" ? classes.dark : classes.light
        )}
      >
        <div className={classes.wrapper}>
          <div className={classes.header}>
            <Header />
            <Divider my="md" />
          </div>
          <div className={classes.main}>
            <Main />
          </div>
          <div className={classes.side}>
            <Side />
          </div>
        </div>
      </div>
    </MantineThemeProvider>
  );
};

export default App;
