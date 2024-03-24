import { atom } from "recoil";

const localStorageEffect =
  (key) =>
  ({ setSelf, onSet }) => {
    const savedValue = localStorage.getItem(key);
    if (savedValue !== null) {
      setSelf(JSON.parse(savedValue));
    }

    onSet((newValue, _, isReset) => {
      isReset
        ? localStorage.removeItem(key)
        : localStorage.setItem(key, JSON.stringify(newValue));
    });
  };

export const weatherDataState = atom({
  key: "weatherDataState",
  default: null,
});

export const geolocationDataState = atom({
  key: "geolocationDataState",
  default: null,
});

export const weatherLocationState = atom({
  key: "weatherLocationState",
  default: null,
});

export const favouriteLocationsState = atom({
  key: "favouriteLocationsState",
  default: [],
  effects: [localStorageEffect("favouriteLocations")],
});

export const temperatureUnitState = atom({
  key: "temperatureUnit",
  default: "celsius",
});

export const windSpeedUnitState = atom({
  key: "windSpeedUnit",
  default: "kmh",
});

export const precipitationUnitState = atom({
  key: "precipitationUnit",
  default: "mm",
});

export const isLoadingState = atom({
  key: "isLoadingState",
  default: false,
});
