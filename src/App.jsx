import { useEffect } from "react";
import {
  Divider,
  MantineThemeProvider,
  useComputedColorScheme,
} from "@mantine/core";
import { useRecoilState } from "recoil";
import { weatherLocationState } from "./state/atoms";
import { getCityFromCoords } from "./utils";
import cx from "clsx";
import classes from "./App.module.css";
import Header from "./components/Header/Header";
import MainWeatherCard from "./components/MainWeatherCard/MainWeatherCard";
import FavouriteList from "./components/FavouriteList/FavouriteList";

const App = () => {
  const [location, setLocation] = useRecoilState(weatherLocationState);

  const computedColorScheme = useComputedColorScheme("light", {
    getInitialValueInEffect: true,
  });

  useEffect(() => {
    // A location restored from localStorage (or set by search) takes priority,
    // so we only auto-detect when there is nothing to show yet.
    if (location) return;

    if (!navigator.geolocation) {
      console.error("Geolocation is not supported by this browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const city = await getCityFromCoords(
            position.coords.latitude,
            position.coords.longitude
          );
          if (city) setLocation(city);
        } catch (error) {
          console.error("Failed to determine location:", error);
        }
      },
      // Denied, unavailable or no prompt (e.g. permission already decided):
      // there's nothing to detect, so the UI falls back to the search prompt.
      (error) => console.error("Geolocation error:", error.message),
      { timeout: 10000 }
    );
  }, [location, setLocation]);

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
            <MainWeatherCard />
          </div>
          <div className={classes.side}>
            <FavouriteList />
          </div>
        </div>
      </div>
    </MantineThemeProvider>
  );
};

export default App;
