import { Card, Flex, Text } from "@mantine/core";
import classes from "./Main.module.css";
import ClearDay from "../../assets/icons/clear-day.svg?react";
import Cloudy from "../../assets/icons/cloudy.svg?react";
import OvercastDay from "../../assets/icons/overcast-day.svg?react";
import Sunrise from "../../assets/icons/line/sunrise.svg?react";
import Sunset from "../../assets/icons/line/sunset.svg?react";
import DayItem from "../DayItem/DayItem";

function Main() {
  return (
    <Flex miw={"100%"} h={"100%"} gap="sm" wrap={"wrap"}>
      <Card className={classes.card} shadow="sm" padding="lg" radius="xl">
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
      </Flex>
    </Flex>
  );
}

export default Main;
