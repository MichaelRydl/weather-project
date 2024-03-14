import { useEffect } from "react";
import cx from "clsx";
import {
  Divider,
  MantineThemeProvider,
  useComputedColorScheme,
} from "@mantine/core";
import { useSetRecoilState } from "recoil";
import { weatherLocationState } from "./state/atoms";
import classes from "./App.module.css";
import Header from "./components/Header/Header";
import Main from "./components/Main/Main";
import Side from "./components/Side/Side";

const App = () => {
  const setLocation = useSetRecoilState(weatherLocationState);

  const computedColorScheme = useComputedColorScheme("light", {
    getInitialValueInEffect: true,
  });

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        setLocation({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        });
      });
    } else {
      throw new Error("Geolocation service is not available.");
    }
  }, []);

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
