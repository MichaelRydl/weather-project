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

function Header() {
  const { setColorScheme } = useMantineColorScheme();
  const computedColorScheme = useComputedColorScheme("light", {
    getInitialValueInEffect: true,
  });
  const searchIcon = <IconSearch style={{ width: rem(16), height: rem(16) }} />;

  return (
    <div className={classes.header}>
      <Text size="xl" fw={700}>
        WeatherProject
      </Text>
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
          <IconSettings stroke={1.5} />
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
