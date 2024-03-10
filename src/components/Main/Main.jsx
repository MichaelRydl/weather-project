import { Card, Flex, Text, Paper } from "@mantine/core";
import classes from "./Main.module.css";
import ClearDay from "../../assets/icons/clear-day.svg?react";
import Cloudy from "../../assets/icons/cloudy.svg?react";
import OvercastDay from "../../assets/icons/overcast-day.svg?react";
import Sunrise from "../../assets/icons/line/sunrise.svg?react";
import Sunset from "../../assets/icons/line/sunset.svg?react";
import DayItem from "../DayItem/DayItem";

function Main() {
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
            <Flex mih={"100%"} justify={"space-between"}>
              <Card.Section>
                <ClearDay className={classes.weather_icon} />
              </Card.Section>
              <Flex
                className={classes.info}
                align={"center"}
                justify={"space-between"}
                direction={"column"}
              >
                <Flex align={"end"} direction={"column"}>
                  <Text className={classes.city_text} size={"lg"} c="white">
                    Prague, CZ
                  </Text>
                  <Text size={"4rem"} c="white">
                    24°C
                  </Text>
                </Flex>
                <Flex align={"center"} direction={"row"}>
                  <Sunrise style={{ width: "2rem" }} />
                  <Text size={"sm"} c="white">
                    6:10 - 19:20
                  </Text>
                  <Sunset style={{ width: "2rem" }} />
                </Flex>
              </Flex>
            </Flex>
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
        <Flex gap={"1rem"} wrap={"wrap"}>
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
}

export default Main;
