import { useEffect } from "react";
import {
  Divider,
  MantineThemeProvider,
  useComputedColorScheme,
} from "@mantine/core";
import { useSetRecoilState } from "recoil";
import { weatherLocationState } from "./state/atoms";
import cx from "clsx";
import classes from "./App.module.css";
import Header from "./components/Header/Header";
import MainWeatherCard from "./components/MainWeatherCard/MainWeatherCard";
import FavouriteList from "./components/FavouriteList/FavouriteList";

const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

const App = () => {
  const setLocation = useSetRecoilState(weatherLocationState);

  const computedColorScheme = useComputedColorScheme("light", {
    getInitialValueInEffect: true,
  });

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(showLocation);
    } else {
      console.error("Geolocation is not supported by this browser.");
    }

    function showLocation(position) {
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;
      const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${API_KEY}`;

      fetch(url)
        .then((response) => response.json())
        .then((data) => {
          if (data.results.length > 0) {
            const output = {};

            if (data.results.length > 0) {
              data.results.map((result) => {
                if (result.address_components.length > 0) {
                  result.address_components.map((address) => {
                    if (address.types[0]) {
                      if (!output[address.types[0]]) {
                        output[address.types[0]] = address.long_name;
                      }
                    }
                  });
                }
              });
            }
            setLocation(output.locality);
          }
        })
        .catch((error) => console.log(error));
    }
  }, [setLocation]);

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
