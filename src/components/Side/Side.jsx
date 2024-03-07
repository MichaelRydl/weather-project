import { Divider, Flex, Text } from "@mantine/core";
import ClearDay from "../../assets/icons/clear-day.svg?react";
import Cloudy from "../../assets/icons/cloudy.svg?react";
import OvercastDay from "../../assets/icons/overcast-day.svg?react";
import classes from "./Side.module.css";

const Side = () => {
  return (
    <div className={classes.wrapper}>
      <div className={classes.city_box}>
        <div className={classes.city_box_overlay}>
          <Flex mih={"100%"} justify={"space-between"}>
            <ClearDay className={classes.weather_icon} />
            <Flex align={"end"} direction={"column"}>
              <Text className={classes.city_text} size={"md"} c="white">
                Paris, FR
              </Text>
              <Text size={"2.5rem"} c="white">
                24°C
              </Text>
            </Flex>
          </Flex>
        </div>
      </div>
      <Divider />
      <div className={classes.city_box}>
        <div className={classes.city_box_overlay}>
          <Flex mih={"100%"} justify={"space-between"}>
            <ClearDay className={classes.weather_icon} />
            <Flex align={"end"} direction={"column"}>
              <Text className={classes.city_text} size={"md"} c="white">
                London, GB
              </Text>
              <Text size={"2.5rem"} c="white">
                18°C
              </Text>
            </Flex>
          </Flex>
        </div>
      </div>
      <Divider />
      <div className={classes.city_box}>
        <div className={classes.city_box_overlay}>
          <Flex mih={"100%"} justify={"space-between"}>
            <Cloudy className={classes.weather_icon} />
            <Flex align={"end"} direction={"column"}>
              <Text className={classes.city_text} size={"md"} c="white">
                Rome, IT
              </Text>
              <Text size={"2.5rem"} c="white">
                20°C
              </Text>
            </Flex>
          </Flex>
        </div>
      </div>
      <Divider />
      <div className={classes.city_box}>
        <div className={classes.city_box_overlay}>
          <Flex mih={"100%"} justify={"space-between"}>
            <OvercastDay className={classes.weather_icon} />
            <Flex align={"end"} direction={"column"}>
              <Text className={classes.city_text} size={"md"} c="white">
                New York, US
              </Text>
              <Text size={"2.5rem"} c="white">
                24°C
              </Text>
            </Flex>
          </Flex>
        </div>
      </div>
    </div>
  );
};

export default Side;
