import { Flex, Text } from "@mantine/core";
import classes from "./InfoItem.module.css";

const InfoItem = ({ data, infoText, icon }) => {
  return (
    <Flex align="center" gap="0.5rem" wrap="wrap">
      <Text size="lg" c="gray">
        {infoText}
      </Text>
      <img
        className={classes.weather_icon_info}
        src={icon.src}
        alt={`${icon.name} icon`}
      />
      <Text size="xl">{`${data[0]}${data[1]}`}</Text>
    </Flex>
  );
};

export default InfoItem;
