import { useEffect } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { Card, Flex, Loader, Text, Paper } from "@mantine/core";
import { convertUnixTimestampToTime, kelvinToCelsius } from "../../utils/utils";
import classes from "./Main.module.css";
import ClearDay from "../../assets/icons/clear-day.svg?react";
import Cloudy from "../../assets/icons/openweathermap/04d.svg?react";
import OvercastDay from "../../assets/icons/overcast-day.svg?react";
import Sunrise from "../../assets/icons/line/sunrise.svg?react";
import Sunset from "../../assets/icons/line/sunset.svg?react";
import DayItem from "../DayItem/DayItem";
import {
  geoDataState,
  weatherDataState,
  weatherLocationState,
} from "../../state/atoms";
import { fetchWeatherData } from "../../utils/utils";

const Main = () => {
  const location = useRecoilValue(weatherLocationState);
  const [geoData, setGeoData] = useRecoilState(geoDataState);
  const [weatherData, setWeatherData] = useRecoilState(weatherDataState);

  useEffect(() => {
    fetchWeatherData(location, setGeoData, setWeatherData);
  }, [location, setGeoData, setWeatherData]);

  const getIconUrl = (icon) => {
    return new URL(
      `../../assets/icons/openweathermap/${icon}.svg`,
      import.meta.url
    ).href;
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
            {geoData && weatherData.current ? (
              <Flex mih="100%" justify="space-between">
                <Card.Section>
                  <img
                    className={classes.weather_icon}
                    src={getIconUrl(weatherData.current.weather[0].icon)}
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
