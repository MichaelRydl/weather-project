import { useEffect, useState } from "react";
import { useRecoilState, useSetRecoilState } from "recoil";
import {
  ActionIcon,
  Autocomplete,
  CloseButton,
  Flex,
  Menu,
  SegmentedControl,
  Text,
  useMantineColorScheme,
  useComputedColorScheme,
} from "@mantine/core";
import { useDebouncedValue } from "@mantine/hooks";
import axios from "axios";
import {
  IconSun,
  IconMoon,
  IconSettings,
  IconSearch,
  IconCurrentLocation,
} from "@tabler/icons-react";
import cx from "clsx";
import classes from "./Header.module.css";
import { getCityFromCoords } from "../../utils";
import ClearDay from "../../assets/icons/clear-day.svg?react";
import Cloudy from "../../assets/icons/cloudy.svg?react";
import Rain from "../../assets/icons/rain.svg?react";
import Snow from "../../assets/icons/snow.svg?react";
import LigtningBolt from "../../assets/icons/lightning-bolt.svg?react";
import {
  weatherLocationState,
  temperatureUnitState,
  windSpeedUnitState,
  precipitationUnitState,
  isLoadingState,
} from "../../state/atoms";

const Header = () => {
  const icons = [ClearDay, Cloudy, Rain, Snow, LigtningBolt];
  const setLocation = useSetRecoilState(weatherLocationState);
  const setIsLoading = useSetRecoilState(isLoadingState);
  const [temperatureUnit, setTemperatureUnit] =
    useRecoilState(temperatureUnitState);
  const [windSpeedUnit, setWindSpeedUnit] = useRecoilState(windSpeedUnitState);
  const [precipitationUnit, setPrecipitationUnit] = useRecoilState(
    precipitationUnitState
  );
  const [logoIcon, setLogoIcon] = useState(0);
  const [searchedLocation, setSearchedLocation] = useState("");
  const [citySuggestions, setCitySuggestions] = useState([]);
  const [debouncedSearch] = useDebouncedValue(searchedLocation, 300);
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

  // Fetch city name suggestions from the (keyless) open-meteo geocoding API as
  // the user types, so they can pick from real cities worldwide.
  useEffect(() => {
    const query = debouncedSearch.trim();
    if (query.length < 2) {
      setCitySuggestions([]);
      return;
    }

    let active = true;
    axios
      .get(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
          query
        )}&count=10&language=en&format=json`
      )
      .then((response) => {
        if (!active) return;
        const results = response.data.results || [];
        // Build "City, Region, Country" labels and drop duplicates, since the
        // Autocomplete requires unique option values.
        const labels = results.map((result) =>
          [result.name, result.admin1, result.country].filter(Boolean).join(", ")
        );
        setCitySuggestions([...new Set(labels)]);
      })
      .catch(() => {
        if (active) setCitySuggestions([]);
      });

    return () => {
      active = false;
    };
  }, [debouncedSearch]);

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
    if (!navigator.geolocation) {
      alert("Geolocation isn't supported by this browser.");
      return;
    }

    // Browsers only expose geolocation in a secure context (HTTPS or
    // localhost). On a phone opening the dev server over http://<LAN-IP> the
    // permission prompt never appears, so explain it instead of failing silently.
    if (!window.isSecureContext) {
      alert(
        "Location needs a secure (HTTPS) connection. On your computer use http://localhost, or open the app over HTTPS on your phone. You can still search for a city by name."
      );
      return;
    }

    setIsLoading(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const city = await getCityFromCoords(
            position.coords.latitude,
            position.coords.longitude
          );
          if (city) setLocation(city);
        } catch (error) {
          console.error("Failed to determine location:", error);
          alert("Couldn't determine your city from your location. Try searching by name.");
        } finally {
          setIsLoading(false);
        }
      },
      (error) => {
        console.error("Geolocation error:", error.message);
        setIsLoading(false);
        alert(
          error.code === error.PERMISSION_DENIED
            ? "Location access is blocked for this site. Allow it in your browser settings and try again."
            : "Couldn't get your location. Try searching for a city by name."
        );
      }
    );
  };

  const handleTemperatureUnitChange = (value) => {
    setTemperatureUnit(value);
  };

  const handleWindSpeedUnitChange = (value) => {
    setWindSpeedUnit(value);
  };

  const handlePrecipitationUnitChange = (value) => {
    setPrecipitationUnit(value);
  };

  const handleSearchLocation = (value) => {
    // Picking a suggestion makes Mantine emit the full "City, Region, Country"
    // label here — treat that as a selection: search by the city name and reset
    // the field so it's ready for the next search.
    if (citySuggestions.includes(value)) {
      setLocation(value.split(",")[0].trim());
      setSearchedLocation("");
      setCitySuggestions([]);
      return;
    }

    setSearchedLocation(value);
  };

  const handleSetLocation = (ev) => {
    ev.preventDefault();

    setLocation(searchedLocation);
    setSearchedLocation("");
    setCitySuggestions([]);
  };

  return (
    <div className={classes.header}>
      <div className={classes.logo}>
        <Text size="xl" fw={700}>
          WeatherProject
        </Text>
        {logoIcons()}
      </div>
      <form
        className={classes.search_location_form}
        onSubmit={handleSetLocation}
      >
        <Flex w="100%" gap="xs" align="center" justify="center">
          <Autocomplete
            className={classes.header_search_input}
            radius="xl"
            size="sm"
            placeholder="Search city"
            data={citySuggestions}
            value={searchedLocation}
            onChange={handleSearchLocation}
            filter={({ options }) => options}
            comboboxProps={{ withinPortal: true }}
            rightSectionPointerEvents="auto"
            rightSection={
              searchedLocation ? (
                <CloseButton
                  size="sm"
                  radius="xl"
                  aria-label="Clear search"
                  onClick={() => {
                    setSearchedLocation("");
                    setCitySuggestions([]);
                  }}
                />
              ) : null
            }
            leftSection={
              <ActionIcon
                type="button"
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
            aria-label="Search icon"
            disabled={searchedLocation === ""}
            onClick={handleSetLocation}
          >
            <IconSearch
              style={{ width: "1.1rem", height: "1.1rem" }}
              stroke={1.5}
            />
          </ActionIcon>
        </Flex>
      </form>
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
            <SegmentedControl
              value={temperatureUnit}
              radius="sm"
              data={[
                { label: "°C", value: "celsius" },
                { label: "°F", value: "fahrenheit" },
              ]}
              fullWidth
              onChange={handleTemperatureUnitChange}
            />
            <Menu.Label>Wind speed:</Menu.Label>
            <SegmentedControl
              value={windSpeedUnit}
              radius="sm"
              data={[
                { label: "Km/h", value: "kmh" },
                { label: "m/s", value: "ms" },
                { label: "Mph", value: "mph" },
                { label: "Knots", value: "kn" },
              ]}
              fullWidth
              onChange={handleWindSpeedUnitChange}
            />
            <Menu.Label>Precipitation:</Menu.Label>
            <SegmentedControl
              value={precipitationUnit}
              radius="sm"
              data={[
                { label: "mm", value: "mm" },
                { label: "in", value: "inch" },
              ]}
              fullWidth
              onChange={handlePrecipitationUnitChange}
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
