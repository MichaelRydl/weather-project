import { useEffect } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { ActionIcon, Card, Flex, Loader, Text, Paper } from "@mantine/core";
import { IconStar } from "@tabler/icons-react";
import { getTime } from "../../utils/utils";
import { wmoCodes } from "../../../wmo-codes";
import axios from "axios";
import classes from "./Main.module.css";
import Sunrise from "../../assets/icons/line/sunrise.svg";
import Sunset from "../../assets/icons/line/sunset.svg";
import DayItem from "../DayItem/DayItem";
import {
  favouriteLocationsState,
  weatherDataState,
  geolocationDataState,
  weatherLocationState,
  temperatureUnitState,
  precipitationUnitState,
  windSpeedUnitState,
} from "../../state/atoms";

const Main = () => {
  const location = useRecoilValue(weatherLocationState);
  const temperatureUnit = useRecoilValue(temperatureUnitState);
  const windSpeedUnit = useRecoilValue(windSpeedUnitState);
  const precipitationUnit = useRecoilValue(precipitationUnitState);
  const [favouriteLocations, setFavouriteLocations] = useRecoilState(
    favouriteLocationsState
  );
  const [weatherData, setWeatherData] = useRecoilState(weatherDataState);
  const [geolocationData, setGeolocationData] =
    useRecoilState(geolocationDataState);

  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        const geolocationResponse = await axios.get(
          `https://geocoding-api.open-meteo.com/v1/search?name=${location}&count=1&language=en&format=json`
        );

        setGeolocationData(geolocationResponse.data.results[0]);

        const { latitude, longitude } = geolocationResponse.data.results[0];

        const weatherResponse = await axios.get(
          `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,is_day,precipitation,rain,showers,snowfall,weather_code,cloud_cover,surface_pressure,wind_speed_10m&hourly=sunshine_duration&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,precipitation_sum&timezone=auto&temperature_unit=${temperatureUnit}&wind_speed_unit=${windSpeedUnit}&precipitation_unit=${precipitationUnit}`
        );

        setWeatherData(weatherResponse.data);
      } catch (error) {
        console.error(error);
        alert("This location wasn't found.");
      }
    };

    location && fetchWeatherData();
  }, [
    location,
    temperatureUnit,
    windSpeedUnit,
    precipitationUnit,
    setWeatherData,
    setGeolocationData,
  ]);

  const addFavouriteLocation = () => {
    if (
      favouriteLocations.some(
        (location) => location.name === geolocationData.name
      )
    ) {
      return alert(`${geolocationData.name} is already in the favourite list.`);
    }

    setFavouriteLocations((prevState) => [
      ...prevState,
      { name: geolocationData.name, country: geolocationData.country_code },
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
            {weatherData ? (
              <Flex mih="100%" justify="space-between">
                <Card.Section>
                  <img
                    className={classes.weather_icon}
                    src={
                      weatherData.current.is_day
                        ? wmoCodes[weatherData.current.weather_code].day.image
                        : wmoCodes[weatherData.current.weather_code].night.image
                    }
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
                      {`${geolocationData.name}, ${geolocationData.country_code}`}
                    </Text>
                    <Text size="4rem" c="white">
                      {Math.round(weatherData.current.temperature_2m)}
                      <sup style={{ fontSize: "2rem" }}>
                        {temperatureUnit === "celsius" ? "°C" : "°F"}
                      </sup>
                    </Text>
                  </Flex>
                  <Flex align="center" direction="row">
                    <img style={{ width: "2rem" }} src={Sunrise} alt="" />
                    <Text size="sm" c="white">
                      {`${getTime(weatherData.daily.sunrise[0])} - ${getTime(
                        weatherData.daily.sunset[0]
                      )}`}
                    </Text>
                    <img style={{ width: "2rem" }} src={Sunset} alt="" />
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
        <Flex justify="center" gap="1rem" wrap="wrap">
          {weatherData ? (
            weatherData.daily.time.map((date, i) => (
              <DayItem
                key={i}
                date={date}
                weatherData={weatherData}
                index={i}
              />
            ))
          ) : (
            <Loader color="white" type="dots" size={50} />
          )}
        </Flex>
      </div>
    </div>
  );
};

export default Main;
