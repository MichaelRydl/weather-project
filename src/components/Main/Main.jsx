import { useEffect } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { ActionIcon, Card, Flex, Loader, Text, Paper } from "@mantine/core";
import { IconStar } from "@tabler/icons-react";
import { convertUnixTimestampToTime, kelvinToCelsius } from "../../utils/utils";
import axios from "axios";
import classes from "./Main.module.css";
import ClearDay from "../../assets/icons/clear-day.svg?react";
import Cloudy from "../../assets/icons/openweathermap/04d.svg?react";
import OvercastDay from "../../assets/icons/overcast-day.svg?react";
import Sunrise from "../../assets/icons/line/sunrise.svg?react";
import Sunset from "../../assets/icons/line/sunset.svg?react";
import DayItem from "../DayItem/DayItem";
import {
  geoDataState,
  favouriteLocationsState,
  weatherDataState,
  weatherLocationState,
} from "../../state/atoms";

const API_KEY = import.meta.env.VITE_OPEN_WEATHER_API_KEY;

const Main = () => {
  const location = useRecoilValue(weatherLocationState);
  const [favouriteLocations, setFavouriteLocations] = useRecoilState(
    favouriteLocationsState
  );
  const [geoData, setGeoData] = useRecoilState(geoDataState);
  const [weatherData, setWeatherData] = useRecoilState(weatherDataState);

  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        const { lat, lon } = location;

        const geoResponse = await axios.get(
          `http://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&appid=${API_KEY}`
        );
        setGeoData(geoResponse.data[0]);

        const weatherResponse = await axios.get(
          `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&appid=${API_KEY}`
        );
        setWeatherData(weatherResponse.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchWeatherData();
  }, [location, setGeoData, setWeatherData]);

  const addFavouriteLocation = () => {
    if (favouriteLocations.some((location) => location.name === geoData.name)) {
      return alert(`${geoData.name} is already in the favourite list.`);
    }

    setFavouriteLocations((prevState) => [
      ...prevState,
      { name: geoData.name, country: geoData.country },
    ]);
  };

  return (
    <div className={classes.wrapper}>
      <div className={classes.wrapper_main_info}>
        <Card
          className={classes.main_weather_info}
          shadow="sm"
          padding="lg"
          radius="xl"
        >
          <div className={classes.card_overlay}>
            <div
              className={classes.favourite_icon_wrapper}
              onClick={addFavouriteLocation}
            >
              <ActionIcon
                variant="light"
                radius="xl"
                color="white"
                aria-label="Add to favourites"
              >
                <IconStar
                  style={{ width: "1.1rem", height: "1.1rem" }}
                  stroke={1.5}
                />
              </ActionIcon>
            </div>
            {geoData && weatherData.current ? (
              <Flex mih="100%" justify="space-between">
                <Card.Section>
                  <img
                    className={classes.weather_icon}
                    src={`/icons/openweathermap/${weatherData.current.weather[0].icon}.svg`}
                    alt=""
                  />
                </Card.Section>
                <Flex
                  className={classes.info}
                  align="center"
                  justify="space-between"
                  direction="column"
                >
                  <Flex align="end" direction="column">
                    <Text className={classes.city_text} size="lg" c="white">
                      {`${geoData.name}, ${geoData.country}`}
                    </Text>
                    <Text size="4rem" c="white">
                      {Math.round(kelvinToCelsius(weatherData.current.temp))}
                      <sup style={{ fontSize: "2rem" }}>°C</sup>
                    </Text>
                  </Flex>
                  <Flex align="center" direction="row">
                    <Sunrise style={{ width: "2rem" }} />
                    <Text size="sm" c="white">
                      {`${convertUnixTimestampToTime(
                        weatherData.current.sunrise
                      )} - ${convertUnixTimestampToTime(
                        weatherData.current.sunset
                      )}`}
                    </Text>
                    <Sunset style={{ width: "2rem" }} />
                  </Flex>
                </Flex>
              </Flex>
            ) : (
              <Flex h="100%" align="center" justify="center">
                <Loader color="white" type="dots" size={50} />
              </Flex>
            )}
          </div>
        </Card>
        <Paper
          className={classes.weather_informations}
          shadow="xl"
          radius="xl"
          p="lg"
        ></Paper>
      </div>
      <div className={classes.wrapper_forecast}>
        <Flex gap="1rem" wrap="wrap">
          <DayItem
            temperature="20°C"
            description="Overcast"
            weatherIcon={<OvercastDay />}
          />
          <DayItem
            temperature="21°C"
            description="Sunny"
            weatherIcon={<ClearDay />}
          />
          <DayItem
            temperature="21°C"
            description="Sunny"
            weatherIcon={<ClearDay />}
          />
          <DayItem
            temperature="24°C"
            description="Sunny"
            weatherIcon={<ClearDay />}
          />
          <DayItem
            temperature="21°C"
            description="Cloudy"
            weatherIcon={<Cloudy />}
          />
          <DayItem
            temperature="19°C"
            description="Cloudy"
            weatherIcon={<Cloudy />}
          />
        </Flex>
      </div>
    </div>
  );
};

export default Main;
