import { Flex, Paper, Text } from "@mantine/core";
import { wmoCodes } from "../../../wmo-codes";
import { getTime, getNameOfTheDay } from "../../utils/utils";
import Raindrop from "../../assets/icons/raindrop.svg";
import Sunrise from "../../assets/icons/sunrise.svg";
import Sunset from "../../assets/icons/sunset.svg";
import classes from "./DayItem.module.css";

const DayItem = ({ date, weatherData, index }) => {
  return (
    <div className={classes.wrapper}>
      <Paper shadow="xl" radius="xl" p="lg">
        <Flex
          align={"center"}
          justify={"center"}
          direction={"column"}
          gap={"sm"}
        >
          <Text size={"sm"} c="gray">
            {getNameOfTheDay(date)}
          </Text>
          <img
            className={classes.weather_icon}
            src={
              weatherData.is_day
                ? wmoCodes[weatherData.daily.weather_code[index]].day.image
                : wmoCodes[weatherData.daily.weather_code[index]].night.image
            }
            alt={`${
              weatherData.is_day
                ? wmoCodes[weatherData.daily.weather_code[index]].day
                    .description
                : wmoCodes[weatherData.daily.weather_code[index]].night
                    .description
            } icon`}
          />
          <div className={classes.weather_temperature}>
            <Text size={"xl"} fw={700} c="white">
              {Math.round(weatherData.daily.temperature_2m_min[index])} /{" "}
              {Math.round(weatherData.daily.temperature_2m_max[index])}
              <sup style={{ fontSize: "0.8rem" }}>
                {weatherData.daily_units.temperature_2m_max}
              </sup>
            </Text>
          </div>
          <Flex align="center">
            <img
              className={classes.weather_icon_info}
              src={Raindrop}
              alt="Raindrop icon"
            />
            <Text size="sm">{`${weatherData.daily.precipitation_sum[index]}${weatherData.daily_units.precipitation_sum}`}</Text>
          </Flex>
          <Flex align="center">
            <img
              className={classes.weather_icon_info}
              src={Sunrise}
              alt="Sunrise icon"
            />
            <Text size="sm">
              {`${getTime(weatherData.daily.sunrise[index])} - ${getTime(
                weatherData.daily.sunset[index]
              )}`}
            </Text>
            <img
              className={classes.weather_icon_info}
              src={Sunset}
              alt="Sunset icon"
            />
          </Flex>
        </Flex>
      </Paper>
    </div>
  );
};

export default DayItem;
