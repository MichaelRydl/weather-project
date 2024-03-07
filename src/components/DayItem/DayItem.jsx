import { Flex, Paper, Text } from "@mantine/core";
import PressureLow from "../../assets/icons/pressure-low.svg?react";
import PressureHigh from "../../assets/icons/pressure-high.svg?react";
import classes from "./DayItem.module.css";

const DayItem = ({ weatherIcon, temperature, description }) => {
  return (
    <div className={classes.wrapper}>
      <Paper shadow="xl" radius="xl" p="lg">
        <Flex
          align={"center"}
          justify={"center"}
          direction={"column"}
          gap={"sm"}
        >
          <div className={classes.weather_icon}>{weatherIcon}</div>
          <div className={classes.weather_temperature}>
            <Text size={"xl"} fw={700} c="white">
              {temperature}
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
