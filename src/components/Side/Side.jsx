import { useEffect } from "react";
import { Divider, Flex, Text } from "@mantine/core";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  favouriteLocationsState,
  geoDataListState,
  weatherDataListState,
} from "../../state/atoms";
import { fetchWeatherData, kelvinToCelsius } from "../../utils/utils";
import classes from "./Side.module.css";

const Side = () => {
  const favouriteLocations = useRecoilValue(favouriteLocationsState);
  const [geoListData, setGeoListData] = useRecoilState(geoDataListState);
  const [weatherListData, setWeatherListData] =
    useRecoilState(weatherDataListState);

  const getIconUrl = (icon) => {
    return new URL(
      `../../assets/icons/openweathermap/${icon}.svg`,
      import.meta.url
    ).href;
  };

  useEffect(() => {
    favouriteLocations.forEach((location) => {
      fetchWeatherData(location, setGeoListData, setWeatherListData);
    });
  }, [favouriteLocations, setGeoListData, setWeatherListData]);

  return (
    <div className={classes.wrapper}>
      {geoListData?.map((data, i) => (
        <>
          <div className={classes.city_box}>
            <div className={classes.city_box_overlay}>
              <Flex mih={"100%"} justify={"space-between"}>
                <img
                  className={classes.weather_icon}
                  src={getIconUrl(weatherListData[i]?.current?.weather[0].icon)}
                  alt=""
                />
                <Flex align={"end"} direction={"column"}>
                  <Text className={classes.city_text} size={"md"} c="white">
                    {data?.name}
                  </Text>
                  <Text size={"2.5rem"} c="white">
                    {Math.round(
                      kelvinToCelsius(weatherListData[i]?.current?.temp)
                    )}
                    <sup style={{ fontSize: "1rem" }}>°C</sup>
                  </Text>
                </Flex>
              </Flex>
            </div>
          </div>
          <Divider />
        </>
      ))}
    </div>
  );
};

export default Side;
