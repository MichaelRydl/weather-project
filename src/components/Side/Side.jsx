import { useEffect, useState } from "react";
import { useRecoilState, useSetRecoilState } from "recoil";
import { ActionIcon, Divider, Flex, Text } from "@mantine/core";
import { IconMinus } from "@tabler/icons-react";
import { kelvinToCelsius } from "../../utils/utils";
import {
  favouriteLocationsState,
  weatherLocationState,
} from "../../state/atoms";
import axios from "axios";
import classes from "./Side.module.css";

const API_KEY = import.meta.env.VITE_OPEN_WEATHER_API_KEY;

const Side = () => {
  const setLocation = useSetRecoilState(weatherLocationState);
  const [favouriteLocations, setFavouriteLocations] = useRecoilState(
    favouriteLocationsState
  );
  const [currentLocationData, setCurrentLocationData] = useState([]);

  useEffect(() => {
    favouriteLocations.forEach((location) => {
      const fetchWeatherData = async () => {
        try {
          const geoResponse = await axios.get(
            `https://api.openweathermap.org/geo/1.0/direct?q=${location.name}&appid=${API_KEY}`
          );

          const { lat, lon } = geoResponse.data[0];
          const weatherResponse = await axios.get(
            `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&appid=${API_KEY}`
          );

          setCurrentLocationData((prevState) => [
            ...prevState,
            {
              favouriteLocation: location.name,
              geoData: geoResponse.data[0],
              weatherData: weatherResponse.data,
            },
          ]);
        } catch (error) {
          console.error(error);
        }
      };

      fetchWeatherData();
    });
  }, [favouriteLocations]);

  const handleWeatherItemClick = (location) => {
    setLocation(location);
  };

  const removeItem = (indexToRemove) => {
    setCurrentLocationData((prevItems) => {
      return prevItems.filter((_item, index) => index !== indexToRemove);
    });
    setFavouriteLocations((prevItems) => {
      return prevItems.filter((_item, index) => index !== indexToRemove);
    });
  };

  return (
    <div className={classes.wrapper}>
      {currentLocationData.map(({ geoData, weatherData }, i) => (
        <>
          <div
            className={classes.city_box}
            onClick={() => handleWeatherItemClick(geoData.name)}
          >
            <div className={classes.city_box_overlay}>
              <Flex mih={"100%"} justify={"space-between"}>
                <img
                  className={classes.weather_icon}
                  src={`/icons/openweathermap/${weatherData.current.weather[0].icon}.svg`}
                  alt=""
                />
                <Flex align={"end"} direction={"column"}>
                  <Text className={classes.city_text} size={"md"} c="white">
                    {`${geoData.name}, ${geoData.country}`}
                  </Text>
                  <Text size={"2.5rem"} c="white">
                    {Math.round(kelvinToCelsius(weatherData.current.temp))}
                    <sup style={{ fontSize: "1rem" }}>°C</sup>
                  </Text>
                </Flex>
              </Flex>
              <div
                className={classes.remove_icon_wrapper_hidden}
                onClick={() => removeItem(i)}
              >
                <ActionIcon
                  variant="filled"
                  radius="xl"
                  color="red"
                  aria-label="Remove item"
                  size="xs"
                >
                  <IconMinus
                    style={{ width: "1rem", height: "1rem" }}
                    stroke={1.5}
                  />
                </ActionIcon>
              </div>
            </div>
          </div>
          <Divider />
        </>
      ))}
    </div>
  );
};

export default Side;
