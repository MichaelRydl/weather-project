import { Fragment } from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { ActionIcon, Divider, Flex, Text, Loader } from "@mantine/core";
import { IconMinus } from "@tabler/icons-react";
import {
  favouriteLocationsState,
  weatherDataState,
  weatherLocationState,
} from "../../state/atoms";
import { wmoCodes } from "../../../wmo-codes";
import classes from "./FavouriteList.module.css";

const FavouriteList = () => {
  const setLocation = useSetRecoilState(weatherLocationState);
  const [favouriteLocations, setFavouriteLocations] = useRecoilState(
    favouriteLocationsState
  );
  const weatherData = useRecoilValue(weatherDataState);

  const handleWeatherItemClick = (location) => {
    setLocation(location);
  };

  const removeItem = (ev, indexToRemove) => {
    ev.stopPropagation();

    setFavouriteLocations((prevItems) => {
      return prevItems.filter((_, index) => index !== indexToRemove);
    });
  };

  return (
    <div className={classes.wrapper}>
      {weatherData ? (
        favouriteLocations?.map(({ name, country, weatherData }, i) => (
          <Fragment key={i}>
            <div
              className={classes.city_box}
              onClick={() => handleWeatherItemClick(name)}
            >
              <div className={classes.city_box_overlay}>
                <Flex mih="100%" justify="space-between">
                  <img
                    className={classes.weather_icon}
                    src={
                      weatherData.isDay
                        ? wmoCodes[weatherData.weatherCode].day.image
                        : wmoCodes[weatherData.weatherCode].night.image
                    }
                    alt={`${
                      weatherData.isDay
                        ? wmoCodes[weatherData.weatherCode].day.description
                        : wmoCodes[weatherData.weatherCode].night.description
                    } icon`}
                  />
                  <Flex align="end" direction="column">
                    <Text className={classes.city_text} size="md" c="white">
                      {name}, {country}
                    </Text>
                    <Text size="2.5rem" c="white">
                      {Math.round(weatherData.temperature)}
                      <sup style={{ fontSize: "1rem" }}>
                        {weatherData.temperatureUnit}
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
          </Fragment>
        ))
      ) : (
        <Flex h="100%" align="center" justify="center">
          <Loader w="100%" color="gray" type="dots" size={50} />
        </Flex>
      )}
    </div>
  );
};

export default FavouriteList;
