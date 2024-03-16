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

const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

const App = () => {
  const setLocation = useSetRecoilState(weatherLocationState);

  const computedColorScheme = useComputedColorScheme("light", {
    getInitialValueInEffect: true,
  });

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(showCity);
    } else {
      console.error("Geolocation is not supported by this browser.");
    }

    function showCity(position) {
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;
      const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${API_KEY}`;

      fetch(url)
        .then((response) => response.json())
        .then((data) => {
          const city = data.results[0].address_components[4].long_name;
          setLocation(city);
        })
        .catch((error) => console.log(error));
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
