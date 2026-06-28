import { Fragment, useEffect, useRef } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  ActionIcon,
  Alert,
  Badge,
  Card,
  Divider,
  Flex,
  Loader,
  Text,
  Tooltip,
  Paper,
} from "@mantine/core";
import { LineChart } from "@mantine/charts";
import { useMediaQuery } from "@mantine/hooks";
import {
  IconStar,
  IconStarFilled,
  IconAlertTriangle,
} from "@tabler/icons-react";
import { getTime, isToday } from "../../utils";
import { wmoCodes } from "../../../wmo-codes";
import axios from "axios";
import Sunrise from "../../assets/icons/line/sunrise.svg";
import Sunset from "../../assets/icons/line/sunset.svg";
import Wind from "../../assets/icons/wind.svg";
import Humidity from "../../assets/icons/humidity.svg";
import Umbrella from "../../assets/icons/umbrella.svg";
import Barometer from "../../assets/icons/barometer.svg";
import Cloudy from "../../assets/icons/cloudy.svg";
import DayItem from "../DayItem/DayItem";
import InfoItem from "../InfoItem/InfoItem";
import classes from "./MainWeatherCard.module.css";
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
  const scrollContainerRef = useRef(null);
  // Below the md breakpoint the layout stacks, so the alerts sit between the
  // hero card and the detail tiles; on wider screens they go below both.
  const isMobile = useMediaQuery("(max-width: 61.99em)");

  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        const geolocationResponse = await axios.get(
          `https://geocoding-api.open-meteo.com/v1/search?name=${location}&count=1&language=en&format=json`
        );

        setGeolocationData(geolocationResponse.data.results[0]);

        const { latitude, longitude } = geolocationResponse.data.results[0];

        const weatherResponse = await axios.get(
          `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,is_day,precipitation,rain,showers,snowfall,weather_code,cloud_cover,surface_pressure,wind_speed_10m&hourly=sunshine_duration,precipitation,weather_code,temperature_2m,is_day&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,precipitation_sum,uv_index_max&timezone=auto&temperature_unit=${temperatureUnit}&wind_speed_unit=${windSpeedUnit}&precipitation_unit=${precipitationUnit}`
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
    const updateWeatherDataForFavouriteLocations = async () => {
      for (const favouriteLocation of favouriteLocations) {
        try {
          const geolocationResponse = await axios.get(
            `https://geocoding-api.open-meteo.com/v1/search?name=${favouriteLocation.name}&count=1&language=en&format=json`
          );

          const { latitude, longitude } = geolocationResponse.data.results[0];

          const weatherResponse = await axios.get(
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,is_day,precipitation,weather_code,precipitation&daily=temperature_2m_max&timezone=auto&temperature_unit=${temperatureUnit}`
          );

          setFavouriteLocations((prevState) => {
            return prevState.map((location) => {
              if (location.name === favouriteLocation.name) {
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
      updateWeatherDataForFavouriteLocations();
    }
  }, [weatherData]);

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    // The hourly strip isn't rendered while there's no location (empty state),
    // so the ref can be null — bail out instead of crashing.
    if (!scrollContainer) return;

    const handleWheel = (ev) => {
      ev.preventDefault();
      scrollContainer.scrollLeft += ev.deltaY;
    };

    scrollContainer.addEventListener("wheel", handleWheel);

    return () => {
      scrollContainer.removeEventListener("wheel", handleWheel);
    };
  }, [location]);

  const isFavourite = favouriteLocations.some(
    (location) => location.name === geolocationData?.name
  );

  const toggleFavouriteLocation = () => {
    if (isFavourite) {
      setFavouriteLocations((prevState) =>
        prevState.filter((location) => location.name !== geolocationData.name)
      );
      return;
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

  // open-meteo doesn't return official warnings, so derive alerts from the
  // forecast itself (severe conditions, extreme values).
  const getWeatherAlerts = () => {
    const alerts = [];
    const { weather_code, wind_speed_10m } = weatherData.current;
    const temperatureUnit = weatherData.current_units.temperature_2m;
    const windUnit = weatherData.current_units.wind_speed_10m;
    const uvIndex = weatherData.daily.uv_index_max[0];
    const dailyHigh = weatherData.daily.temperature_2m_max[0];
    const dailyLow = weatherData.daily.temperature_2m_min[0];

    if ([95, 96, 99].includes(weather_code)) {
      alerts.push({
        color: "red",
        title: "Thunderstorm",
        message:
          "Thunderstorms in the area. Stay indoors and avoid open spaces.",
      });
    }
    if ([65, 82].includes(weather_code)) {
      alerts.push({
        color: "yellow",
        title: "Heavy rain",
        message: "Heavy rainfall expected. Watch for local flooding.",
      });
    }
    if ([66, 67].includes(weather_code)) {
      alerts.push({
        color: "yellow",
        title: "Freezing rain",
        message: "Freezing rain may cause icy, slippery surfaces.",
      });
    }
    if ([75, 86].includes(weather_code)) {
      alerts.push({
        color: "blue",
        title: "Heavy snow",
        message: "Heavy snowfall expected. Travel may be difficult.",
      });
    }

    if (uvIndex >= 8) {
      alerts.push({
        color: "orange",
        title: "Very high UV",
        message: `UV index reaches ${Math.round(
          uvIndex
        )}. Use sun protection outdoors.`,
      });
    }

    const isFahrenheit = temperatureUnit.includes("F");
    if (dailyHigh >= (isFahrenheit ? 95 : 35)) {
      alerts.push({
        color: "red",
        title: "Extreme heat",
        message: `Highs around ${Math.round(
          dailyHigh
        )}${temperatureUnit} today. Stay hydrated and avoid the midday sun.`,
      });
    } else if (dailyHigh >= (isFahrenheit ? 86 : 30)) {
      alerts.push({
        color: "orange",
        title: "High temperature",
        message: `Highs around ${Math.round(
          dailyHigh
        )}${temperatureUnit} today. Stay hydrated and take it easy in the heat.`,
      });
    }
    if (dailyLow <= (isFahrenheit ? 14 : -10)) {
      alerts.push({
        color: "blue",
        title: "Extreme cold",
        message: `Lows around ${Math.round(
          dailyLow
        )}${temperatureUnit} today. Dress warmly to avoid frostbite.`,
      });
    }

    const windThreshold = { "km/h": 60, "m/s": 17, "mp/h": 38, kn: 33 }[
      windUnit
    ];
    if (windThreshold && wind_speed_10m >= windThreshold) {
      alerts.push({
        color: "yellow",
        title: "Strong wind",
        message: `Winds up to ${Math.round(
          wind_speed_10m
        )} ${windUnit}. Secure loose objects outdoors.`,
      });
    }

    return alerts;
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

  const hourlyData = (hourly) => {
    // Start at the location's current hour so "now" is the first (left-most)
    // item, then show the next hours to scroll through. The hourly arrays are
    // aligned to local midnight, so the current hour is the index into them.
    const currentHour = Number(getTime(weatherData.current.time).split(":")[0]);
    const hoursToShow = 24;
    const newHourlyData = [];

    for (let i = currentHour; i < currentHour + hoursToShow; i++) {
      if (hourly.temperature_2m[i] === undefined) break;

      newHourlyData.push({
        time: getTime(hourly.time[i]),
        temperature: hourly.temperature_2m[i],
        temperatureUnit: weatherData.current_units.temperature_2m,
        weatherCode: hourly.weather_code[i],
        isDay: hourly.is_day[i],
      });
    }

    return newHourlyData;
  };

  // No location yet (geolocation denied/unavailable, or none saved): show a
  // search prompt instead of an endless loader.
  if (!location) {
    return (
      <Flex
        className={classes.empty_state}
        direction="column"
        align="center"
        justify="center"
        gap="sm"
      >
        <Text size="xl" fw={700} ta="center">
          Search for a city
        </Text>
        <Text c="dimmed" ta="center" maw={420}>
          Type a city name in the search bar above, or allow location access to
          detect your position automatically.
        </Text>
      </Flex>
    );
  }

  const weatherAlerts =
    !isLoading && weatherData ? getWeatherAlerts() : [];

  const alertSection = !isLoading &&
    weatherData &&
    weatherAlerts.length > 0 && (
      <div className={classes.alerts_section}>
        <Flex direction="column" gap="sm">
          {weatherAlerts.map((alert, i) => (
            <Alert
              key={i}
              variant="light"
              radius="md"
              color={alert.color}
              title={alert.title}
              icon={<IconAlertTriangle />}
            >
              {alert.message}
            </Alert>
          ))}
        </Flex>
      </div>
    );

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
              onClick={toggleFavouriteLocation}
            >
              <ActionIcon
                variant="light"
                radius="xl"
                color="white"
                aria-label={
                  isFavourite ? "Remove from favourites" : "Add to favourites"
                }
              >
                {isFavourite ? (
                  <IconStarFilled
                    style={{ width: "1.1rem", height: "1.1rem" }}
                  />
                ) : (
                  <IconStar
                    style={{ width: "1.1rem", height: "1.1rem" }}
                    stroke={1.5}
                  />
                )}
              </ActionIcon>
            </div>
            {!isLoading && weatherData ? (
              <Flex mih="100%" justify="space-between">
                <Card.Section className={classes.weather_icon_section}>
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
        {isMobile && alertSection}
        <Paper shadow="xl" radius="xl" p="xl">
          {!isLoading && weatherData ? (
            <div className={classes.info_panel}>
              {infoItemData.map((infoItem, i) => (
                <Fragment key={i}>
                  <InfoItem
                    data={infoItem.data}
                    infoText={infoItem.infoText}
                    icon={infoItem.icon}
                  />
                  {i !== infoItemData.length - 1 && (
                    <Divider w="100%" className={classes.info_divider} />
                  )}
                </Fragment>
              ))}
              <Tooltip
                label="The date and time are displayed according to the local time zone."
                color="gray"
              >
                <Text
                  size="xs"
                  c="gray"
                  mt="xl"
                  className={classes.last_update}
                >
                  Last update:{" "}
                  {`${isToday(weatherData.current.time)} at
                ${getTime(weatherData.current.time)}`}
                </Text>
              </Tooltip>
            </div>
          ) : (
            <Flex h="100%" align="center" justify="center">
              <Loader w="100%" color="gray" type="dots" size={50} />
            </Flex>
          )}
        </Paper>
      </div>
      {!isMobile && alertSection}
      <Text
        className={`${classes.section_label} ${classes.mobile_only}`}
        size="lg"
        c="gray"
      >
        Hourly forecast
      </Text>
      <Flex
        className={classes.hourly_forecast_wrapper}
        gap="1rem"
        ref={scrollContainerRef}
      >
        {weatherData ? (
          hourlyData(weatherData.hourly).map((data, i) => (
            <div key={i} className={classes.hourly_forecast_item}>
              <img
                src={
                  data.isDay
                    ? wmoCodes[data.weatherCode].day.image
                    : wmoCodes[data.weatherCode].night.image
                }
                alt={`${
                  data.isDay
                    ? wmoCodes[data.weatherCode].day.description
                    : wmoCodes[data.weatherCode].night.description
                } icon`}
              />
              <Badge size="lg" color="gray" variant="default">
                <Text c="gray" fw={700}>{`${Math.round(data.temperature)}${
                  data.temperatureUnit
                }`}</Text>
              </Badge>
              <Text size="xs" c="gray" fw={700} mt="1rem">
                {data.time}
              </Text>
            </div>
          ))
        ) : (
          <Flex w="100%" h="100%" align="center" justify="center">
            <Loader w="100%" color="gray" type="dots" size={50} />
          </Flex>
        )}
      </Flex>
      <Text size="lg" c="gray" ta="center" className={classes.section_label}>
        Forecast for next 7 days:
      </Text>
      <div className={classes.wrapper_forecast}>
        <Flex
          justify="center"
          gap="1rem"
          wrap="wrap"
          className={classes.forecast_row}
        >
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
        <Text
          size="lg"
          c="gray"
          p="2rem 1rem 3rem 1rem"
          ta="center"
          className={classes.section_label}
        >
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
        <Text
          size="lg"
          c="gray"
          p="2rem 1rem 3rem 1rem"
          ta="center"
          className={classes.section_label}
        >
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
