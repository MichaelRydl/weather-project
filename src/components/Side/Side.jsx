import { useEffect, useState } from "react";
import { useRecoilState, useSetRecoilState } from "recoil";
import { ActionIcon, Divider, Flex, Text } from "@mantine/core";
import { IconMinus } from "@tabler/icons-react";
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
    const fetchWeatherData = async (location) => {
      try {
        const weatherResponse = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?q=${location.name}&units=metric&appid=${API_KEY}`
        );
        setCurrentLocationData((prevState) => {
          const filteredData = prevState.filter(
            (item) => item.favouriteLocation !== location.name
          );
          return [
            ...filteredData,
            {
              favouriteLocation: location.name,
              weatherData: weatherResponse.data,
            },
          ];
        });
      } catch (error) {
        console.error(error);
      }
    };

    if (favouriteLocations.length > 0) {
      fetchWeatherData(favouriteLocations[favouriteLocations.length - 1]);
    }
  }, [favouriteLocations]);

  const handleWeatherItemClick = (location) => {
    setLocation(location);
  };

  const removeItem = (ev, indexToRemove) => {
    ev.stopPropagation();

    setCurrentLocationData((prevItems) => {
      return prevItems.filter((_item, index) => index !== indexToRemove);
    });
    setFavouriteLocations((prevItems) => {
      return prevItems.filter((_item, index) => index !== indexToRemove);
    });
  };

  return (
    <div className={classes.wrapper}>
      {currentLocationData?.map(({ weatherData }, i) => (
        <span key={i}>
          <div
            className={classes.city_box}
            onClick={() => handleWeatherItemClick(weatherData.name)}
          >
            <div className={classes.city_box_overlay}>
              <Flex mih={"100%"} justify={"space-between"}>
                <img
                  className={classes.weather_icon}
                  src={`/icons/openweathermap/${weatherData.weather[0].icon}.svg`}
                  alt=""
                />
                <Flex align={"end"} direction={"column"}>
                  <Text className={classes.city_text} size={"md"} c="white">
                    {`${weatherData.name}, ${weatherData.sys.country}`}
                  </Text>
                  <Text size={"2.5rem"} c="white">
                    {Math.round(weatherData.main.temp)}
                    <sup style={{ fontSize: "1rem" }}>°C</sup>
                  </Text>
                </Flex>
              </Flex>
              <div
                className={classes.remove_icon_wrapper_hidden}
                onClick={(ev) => removeItem(ev, i)}
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
        </span>
      ))}
    </div>
  );
};

export default Side;
