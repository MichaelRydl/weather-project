import { Flex, Paper, Text } from "@mantine/core";
import { useRecoilValue } from "recoil";
import { weatherUnit } from "../../state/atoms";
import PressureLow from "../../assets/icons/pressure-low.svg?react";
import PressureHigh from "../../assets/icons/pressure-high.svg?react";
import classes from "./DayItem.module.css";

const DayItem = ({ time, weatherIcon, temperature, description }) => {
  const unit = useRecoilValue(weatherUnit);

  const getDayNameFromTimestamp = () => {
    const daysOfWeek = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const dayIndex = new Date(time * 1000).getDay();
    return daysOfWeek[dayIndex];
  };

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
            {getDayNameFromTimestamp()}
          </Text>
          <img
            className={classes.weather_icon}
            src={`/icons/openweathermap/${weatherIcon}.svg`}
            alt=""
          />
          <div className={classes.weather_temperature}>
            <Text size={"xl"} fw={700} c="white">
              {Math.round(temperature)}
              <sup style={{ fontSize: "0.8rem" }}>
                {unit === "metric" ? "°C" : "°F"}
              </sup>
            </Text>
          </div>
          <Flex align={"center"}>
            <PressureLow className={classes.weather_icon_pressure} />
            <Text size={"sm"}>18°C</Text>
            <PressureHigh className={classes.weather_icon_pressure} />
            <Text size={"sm"}>28°C</Text>
          </Flex>
          <Text size={"sm"}>{description}</Text>
        </Flex>
      </Paper>
    </div>
  );
};

export default DayItem;
