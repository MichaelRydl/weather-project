import { Fragment, useEffect } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  ActionIcon,
  Card,
  Divider,
  Flex,
  Loader,
  Text,
  Paper,
} from "@mantine/core";
import { LineChart } from "@mantine/charts";
import { IconStar } from "@tabler/icons-react";
import { getTime, isToday } from "../../utils/utils";
import { wmoCodes } from "../../../wmo-codes";
import axios from "axios";
import classes from "./MainWeatherCard.module.css";
import Sunrise from "../../assets/icons/line/sunrise.svg";
import Sunset from "../../assets/icons/line/sunset.svg";
import Wind from "../../assets/icons/wind.svg";
import Humidity from "../../assets/icons/humidity.svg";
import Umbrella from "../../assets/icons/umbrella.svg";
import Barometer from "../../assets/icons/barometer.svg";
import Cloudy from "../../assets/icons/cloudy.svg";
import DayItem from "../DayItem/DayItem";
import InfoItem from "../InfoItem/InfoItem";
import {
  favouriteLocationsState,
  weatherDataState,
  geolocationDataState,
  weatherLocationState,
  temperatureUnitState,
  precipitationUnitState,
  windSpeedUnitState,
  isLoadingState,
} from "../../state/atoms";
import UVIndex1 from "../../assets/icons/uv-index-1.svg";
import UVIndex2 from "../../assets/icons/uv-index-2.svg";
import UVIndex3 from "../../assets/icons/uv-index-3.svg";
import UVIndex4 from "../../assets/icons/uv-index-4.svg";
import UVIndex5 from "../../assets/icons/uv-index-5.svg";
import UVIndex6 from "../../assets/icons/uv-index-6.svg";
import UVIndex7 from "../../assets/icons/uv-index-7.svg";
import UVIndex8 from "../../assets/icons/uv-index-8.svg";
import UVIndex9 from "../../assets/icons/uv-index-9.svg";
import UVIndex10 from "../../assets/icons/uv-index-10.svg";
import UVIndex11 from "../../assets/icons/uv-index-11.svg";

const MainWeatherCard = () => {
  const location = useRecoilValue(weatherLocationState);
  const temperatureUnit = useRecoilValue(temperatureUnitState);
  const windSpeedUnit = useRecoilValue(windSpeedUnitState);
  const isLoading = useRecoilValue(isLoadingState);
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
          `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,is_day,precipitation,rain,showers,snowfall,weather_code,cloud_cover,surface_pressure,wind_speed_10m&hourly=sunshine_duration,precipitation&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,precipitation_sum,uv_index_max&timezone=auto&temperature_unit=${temperatureUnit}&wind_speed_unit=${windSpeedUnit}&precipitation_unit=${precipitationUnit}`
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

  useEffect(() => {
    const updateWeatherDataForFavoriteLocations = async () => {
      for (const favoriteLocation of favouriteLocations) {
        try {
          const geolocationResponse = await axios.get(
            `https://geocoding-api.open-meteo.com/v1/search?name=${favoriteLocation.name}&count=1&language=en&format=json`
          );

          const { latitude, longitude } = geolocationResponse.data.results[0];

          const weatherResponse = await axios.get(
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,is_day,precipitation,weather_code,precipitation&daily=temperature_2m_max&timezone=auto&temperature_unit=${temperatureUnit}`
          );

          setFavouriteLocations((prevState) => {
            return prevState.map((location) => {
              if (location.name === favoriteLocation.name) {
                return {
                  ...location,
                  weatherData: {
                    weatherCode: weatherResponse.data.current.weather_code,
                    temperature: weatherResponse.data.current.temperature_2m,
                    temperatureUnit:
                      weatherResponse.data.daily_units.temperature_2m_max,
                    isDay: weatherResponse.data.current.is_day,
                  },
                };
              }
              return location;
            });
          });
        } catch (error) {
          console.error(error);
        }
      }
    };

    if (favouriteLocations.length > 0) {
      updateWeatherDataForFavoriteLocations();
    }
  }, [weatherData, setFavouriteLocations]);

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
      {
        name: geolocationData.name,
        country: geolocationData.country_code,
        weatherData: {
          weatherCode: weatherData.current.weather_code,
          temperature: weatherData.current.temperature_2m,
          temperatureUnit: weatherData.daily_units.temperature_2m_max,
          isDay: weatherData.current.is_day,
        },
      },
    ]);
  };

  const UVIndexIcons = [
    UVIndex1,
    UVIndex2,
    UVIndex3,
    UVIndex4,
    UVIndex5,
    UVIndex6,
    UVIndex7,
    UVIndex8,
    UVIndex9,
    UVIndex10,
    UVIndex11,
  ];

  const getUVIndexIcon = (uvIndex) => {
    const index = Math.min(Math.floor(uvIndex) - 1, UVIndexIcons.length - 1);
    return UVIndexIcons[index < 0 ? 0 : index];
  };

  const infoItemData = [
    {
      data: [
        weatherData?.current.wind_speed_10m,
        weatherData?.current_units.wind_speed_10m,
      ],
      icon: { src: Wind, name: "Wind speed" },
      infoText: "Wind speed:",
    },
    {
      data: [
        weatherData?.current.relative_humidity_2m,
        weatherData?.current_units.relative_humidity_2m,
      ],
      icon: { src: Humidity, name: "Raindrop with percent" },
      infoText: "Humidity:",
    },
    {
      data: [
        weatherData?.current.precipitation,
        weatherData?.current_units.precipitation,
      ],
      icon: { src: Umbrella, name: "Umbrella" },
      infoText: "Precipitation:",
    },
    {
      data: [
        weatherData?.current.surface_pressure,
        weatherData?.current_units.surface_pressure,
      ],
      icon: { src: Barometer, name: "Barometer" },
      infoText: "Pressure:",
    },
    {
      data: [
        weatherData?.current.cloud_cover,
        weatherData?.current_units.cloud_cover,
      ],
      icon: { src: Cloudy, name: "Cloud" },
      infoText: "Cloud cover:",
    },
    {
      data: ["", ""],
      icon: {
        src: getUVIndexIcon(weatherData?.daily.uv_index_max[0]),
        name: "UV Index",
      },
      infoText: "UV Index:",
    },
  ];

  const hourlySunshineDurationData = (sunshineDuration) => {
    let hourlySunshineData = [];
    for (let i = 0; i < 25; i++) {
      hourlySunshineData.push({
        time: `${i}h`,
        Sunshine_Duration: Math.round((sunshineDuration[i] / 3600) * 100),
      });
    }
    return hourlySunshineData;
  };

  const hourlyPrecipitationData = (precipitation) => {
    let hourlyPrecipitation = [];
    for (let i = 0; i < 25; i++) {
      hourlyPrecipitation.push({
        time: `${i}h`,
        Precipitation: precipitation[i],
      });
    }
    return hourlyPrecipitation;
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
            {!isLoading && weatherData ? (
              <Flex mih="100%" justify="space-between">
                <Card.Section>
                  <img
                    className={classes.weather_icon}
                    src={
                      weatherData.current.is_day
                        ? wmoCodes[weatherData.current.weather_code].day.image
                        : wmoCodes[weatherData.current.weather_code].night.image
                    }
                    alt={`${
                      weatherData.current.is_day
                        ? wmoCodes[weatherData.current.weather_code].day
                            .description
                        : wmoCodes[weatherData.current.weather_code].night
                            .description
                    } icon`}
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
                        {weatherData.current_units.temperature_2m}
                      </sup>
                    </Text>
                  </Flex>
                  <Flex align="center" direction="row">
                    <img
                      style={{ width: "2rem" }}
                      src={Sunrise}
                      alt="Sunrise icon"
                    />
                    <Text size="sm" c="white">
                      {`${getTime(weatherData.daily.sunrise[0])} - ${getTime(
                        weatherData.daily.sunset[0]
                      )}`}
                    </Text>
                    <img
                      style={{ width: "2rem" }}
                      src={Sunset}
                      alt="Sunset icon"
                    />
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
        <Paper shadow="xl" radius="xl" p="xl">
          {!isLoading && weatherData ? (
            <Flex
              w="100%"
              h="100%"
              direction="column"
              align="center"
              justify="center"
            >
              {infoItemData.map((infoItem, i) => (
                <Fragment key={i}>
                  <InfoItem
                    data={infoItem.data}
                    infoText={infoItem.infoText}
                    icon={infoItem.icon}
                  />
                  {i !== infoItemData.length - 1 && <Divider w="100%" />}
                </Fragment>
              ))}
              <Text size="xs" c="gray" mt="xl">
                Last update:{" "}
                {`${isToday(weatherData.current.time)} at
                ${getTime(weatherData.current.time)}`}
              </Text>
            </Flex>
          ) : (
            <Flex h="100%" align="center" justify="center">
              <Loader w="100%" color="gray" type="dots" size={50} />
            </Flex>
          )}
        </Paper>
      </div>
      <div className={classes.wrapper_forecast}>
        <Flex justify="center" gap="1rem" wrap="wrap">
          {!isLoading && weatherData ? (
            weatherData.daily.time.map((date, i) => (
              <DayItem
                key={i}
                date={date}
                weatherData={weatherData}
                index={i}
              />
            ))
          ) : (
            <Flex h="100%" align="center" justify="center">
              <Loader w="100%" color="gray" type="dots" size={50} />
            </Flex>
          )}
        </Flex>
      </div>
      <div>
        <Text size="lg" c="gray" p="2rem 1rem 3rem 1rem" ta="center">
          Sunshine duration for current day:
        </Text>
        {!isLoading && weatherData ? (
          <LineChart
            w="100%"
            h={300}
            data={hourlySunshineDurationData(
              weatherData.hourly.sunshine_duration
            )}
            dataKey="time"
            unit="%"
            series={[{ name: "Sunshine_Duration", color: "yellow.6" }]}
            curveType="monotone"
          />
        ) : (
          <Flex h="100%" align="center" justify="center">
            <Loader w="100%" color="gray" type="dots" size={50} />
          </Flex>
        )}
      </div>
      <div>
        <Text size="lg" c="gray" p="2rem 1rem 3rem 1rem" ta="center">
          Precipitation for current day:
        </Text>
        {!isLoading && weatherData ? (
          <LineChart
            w="100%"
            h={300}
            data={hourlyPrecipitationData(weatherData.hourly.precipitation)}
            dataKey="time"
            unit={weatherData.hourly_units.precipitation}
            series={[{ name: "Precipitation", color: "blue.6" }]}
            curveType="monotone"
          />
        ) : (
          <Flex h="100%" align="center" justify="center">
            <Loader w="100%" color="gray" type="dots" size={50} />
          </Flex>
        )}
      </div>
    </div>
  );
};

export default MainWeatherCard;
