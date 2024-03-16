import { useEffect, useState } from "react";
import { useRecoilState, useSetRecoilState, useRecoilValue } from "recoil";
import { ActionIcon, Divider, Flex, Text } from "@mantine/core";
import { IconMinus } from "@tabler/icons-react";
import {
  favouriteLocationsState,
  temperatureUnitState,
  weatherLocationState,
} from "../../state/atoms";
import { wmoCodes } from "../../../wmo-codes";
import axios from "axios";
import classes from "./Side.module.css";

const Side = () => {
  const temperatureUnit = useRecoilValue(temperatureUnitState);
  const setLocation = useSetRecoilState(weatherLocationState);
  const [favouriteLocations, setFavouriteLocations] = useRecoilState(
    favouriteLocationsState
  );
  const [currentLocationData, setCurrentLocationData] = useState([]);

  useEffect(() => {
    const fetchWeatherData = async (location) => {
      try {
        const geolocationResponse = await axios.get(
          `https://geocoding-api.open-meteo.com/v1/search?name=${location.name}&count=1&language=en&format=json`
        );

        const { latitude, longitude } = geolocationResponse.data.results[0];

        const weatherResponse = await axios.get(
          `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,is_day,precipitation,rain,showers,snowfall,weather_code,cloud_cover,surface_pressure,wind_speed_10m&hourly=sunshine_duration&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,precipitation_sum&timezone=auto&temperature_unit=${temperatureUnit}`
        );
        setCurrentLocationData((prevState) => {
          const filteredData = prevState.filter(
            (item) =>
              item.favouriteLocation !== `${location.name}, ${location.country}`
          );
          return [
            ...filteredData,
            {
              favouriteLocation: `${location.name}, ${location.country}`,
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
  }, [favouriteLocations, temperatureUnit]);

  const handleWeatherItemClick = (location) => {
    console.log(location);
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
      {currentLocationData?.map(({ favouriteLocation, weatherData }, i) => (
        <span key={i}>
          <div
            className={classes.city_box}
            onClick={() =>
              handleWeatherItemClick(favouriteLocation.split(", ")[0])
            }
          >
            <div className={classes.city_box_overlay}>
              <Flex mih={"100%"} justify={"space-between"}>
                <img
                  className={classes.weather_icon}
                  src={
                    weatherData.current.is_day
                      ? wmoCodes[weatherData.current.weather_code].day.image
                      : wmoCodes[weatherData.current.weather_code].night.image
                  }
                  alt=""
                />
                <Flex align={"end"} direction={"column"}>
                  <Text className={classes.city_text} size={"md"} c="white">
                    {favouriteLocation}
                  </Text>
                  <Text size={"2.5rem"} c="white">
                    {Math.round(weatherData.current.temperature_2m)}
                    <sup style={{ fontSize: "1rem" }}>
                      {weatherData.daily_units.temperature_2m_max}
                    </sup>
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
