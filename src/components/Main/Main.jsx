import { Card, Flex, Text } from "@mantine/core";
import classes from "./Main.module.css";
import ClearDay from "../../assets/icons/line/clear-day.svg?react";
import Sunrise from "../../assets/icons/line/sunrise.svg?react";
import Sunset from "../../assets/icons/line/sunset.svg?react";

function Main() {
  return (
    <div className={classes.wrapper}>
      <Card className={classes.card} shadow="sm" padding="lg" radius="md">
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
              <Flex align={"end"} direction={"row"}>
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
    </div>
  );
}

export default Main;
