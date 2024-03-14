import { useEffect, useState } from "react";
import { useSetRecoilState } from "recoil";
import {
  ActionIcon,
  Flex,
  Menu,
  SegmentedControl,
  Text,
  TextInput,
  useMantineColorScheme,
  useComputedColorScheme,
} from "@mantine/core";
import {
  IconSun,
  IconMoon,
  IconSettings,
  IconSearch,
  IconCurrentLocation,
} from "@tabler/icons-react";
import cx from "clsx";
import classes from "./Header.module.css";
import ClearDay from "../../assets/icons/clear-day.svg?react";
import Cloudy from "../../assets/icons/cloudy.svg?react";
import Rain from "../../assets/icons/rain.svg?react";
import Snow from "../../assets/icons/snow.svg?react";
import LigtningBolt from "../../assets/icons/lightning-bolt.svg?react";
import { weatherLocationState } from "../../state/atoms";

const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

const Header = () => {
  const icons = [ClearDay, Cloudy, Rain, Snow, LigtningBolt];
  const setLocation = useSetRecoilState(weatherLocationState);
  const [logoIcon, setLogoIcon] = useState(0);
  const [searchedLocation, setSearchedLocation] = useState("");
  const { setColorScheme } = useMantineColorScheme();
  const computedColorScheme = useComputedColorScheme("light", {
    getInitialValueInEffect: true,
  });

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

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(showCity);
    } else {
      console.log("Geolocation is not supported by this browser.");
    }

    function showCity(position) {
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;
      const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${API_KEY}`;

      fetch(url)
        .then((response) => response.json())
        .then((data) => {
          const city = data.results[0].address_components[4].long_name;
          setLocation(city);
        })
        .catch((error) => console.log(error));
    }
  };

  const handleSearchLocation = (locationValue) => {
    setSearchedLocation(locationValue);
  };

  const handleSetLocation = () => {
    setLocation(searchedLocation);
    setSearchedLocation("");
  };

  return (
    <div className={classes.header}>
      <div className={classes.logo}>
        <Text size="xl" fw={700}>
          WeatherProject
        </Text>
        {logoIcons()}
      </div>
      <Flex w="100%" gap="xs" align="center" justify="center">
        <TextInput
          className={classes.header_search_input}
          radius="xl"
          size="sm"
          placeholder="Search city"
          onChange={(ev) => handleSearchLocation(ev.target.value)}
          value={searchedLocation}
          leftSection={
            <ActionIcon
              variant="subtle"
              size="input-sm"
              radius="xl"
              color="gray"
              aria-label="Current location"
              onClick={getCurrentLocation}
            >
              <IconCurrentLocation
                style={{ width: "1.1rem", height: "1.1rem" }}
                stroke={1.5}
              />
            </ActionIcon>
          }
        />
        <ActionIcon
          variant="light"
          size="input-sm"
          radius="xl"
          color="gray"
          aria-label="Search"
          onClick={handleSetLocation}
        >
          <IconSearch
            style={{ width: "1.1rem", height: "1.1rem" }}
            stroke={1.5}
          />
        </ActionIcon>
      </Flex>
      <div className={classes.header_buttons}>
        <Menu shadow="md" width={300} position="bottom-end">
          <Menu.Target>
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
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Label>Temperature:</Menu.Label>
            <SegmentedControl radius="sm" data={["ºC", "ºF"]} fullWidth />
            <Menu.Label>Units of measurement:</Menu.Label>
            <SegmentedControl
              radius="sm"
              data={["standard", "metric", "imperial"]}
              fullWidth
            />
          </Menu.Dropdown>
        </Menu>
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
};

export default Header;
