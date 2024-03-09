import { useEffect, useState } from "react";
import {
  ActionIcon,
  Text,
  TextInput,
  useMantineColorScheme,
  useComputedColorScheme,
  rem,
} from "@mantine/core";
import {
  IconSun,
  IconMoon,
  IconSettings,
  IconSearch,
} from "@tabler/icons-react";
import cx from "clsx";
import classes from "./Header.module.css";
import ClearDay from "../../assets/icons/clear-day.svg?react";
import Cloudy from "../../assets/icons/cloudy.svg?react";
import Rain from "../../assets/icons/rain.svg?react";
import Snow from "../../assets/icons/snow.svg?react";
import LigtningBolt from "../../assets/icons/lightning-bolt.svg?react";

function Header() {
  const icons = [ClearDay, Cloudy, Rain, Snow, LigtningBolt];
  const [logoIcon, setLogoIcon] = useState(0);
  const { setColorScheme } = useMantineColorScheme();
  const computedColorScheme = useComputedColorScheme("light", {
    getInitialValueInEffect: true,
  });
  const searchIcon = <IconSearch style={{ width: rem(16), height: rem(16) }} />;

  useEffect(() => {
    const interval = setInterval(() => {
      setLogoIcon((prevIcon) => (prevIcon + 1) % icons.length);
    }, 10000);

    return () => clearInterval(interval);
  }, [icons.length]);

  const logoIcons = () => {
    switch (logoIcon) {
      case 0:
        return <ClearDay className={classes.logo_icon} />;
      case 1:
        return <Cloudy className={classes.logo_icon} />;
      case 2:
        return <Rain className={classes.logo_icon} />;
      case 3:
        return <Snow className={classes.logo_icon} />;
      case 4:
        return <LigtningBolt className={classes.logo_icon} />;
    }
  };

  return (
    <div className={classes.header}>
      <div className={classes.logo}>
        <Text size="xl" fw={700}>
          WeatherProject
        </Text>
        {logoIcons()}
      </div>
      <TextInput
        className={classes.header_search}
        rightSection={searchIcon}
        radius="xl"
        placeholder="Search city"
      />
      <div className={classes.header_buttons}>
        <ActionIcon
          variant="subtle"
          size="xl"
          color="black"
          aria-label="Toggle color scheme"
        >
          <IconSettings
            stroke={1.5}
            className={cx(
              classes.icon,
              computedColorScheme === "light" ? classes.dark : classes.light
            )}
          />
        </ActionIcon>
        <ActionIcon
          onClick={() =>
            setColorScheme(computedColorScheme === "light" ? "dark" : "light")
          }
          variant="subtle"
          color="black"
          size="xl"
          aria-label="Toggle color scheme"
        >
          <IconSun className={cx(classes.icon, classes.light)} stroke={1.5} />
          <IconMoon className={cx(classes.icon, classes.dark)} stroke={1.5} />
        </ActionIcon>
      </div>
    </div>
  );
}

export default Header;
