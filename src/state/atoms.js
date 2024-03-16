import { atom } from "recoil";

export const weatherDataState = atom({
  key: "weatherDataState",
  default: null,
});

export const geolocationDataState = atom({
  key: "geolocationDataState",
  default: null,
});

export const forecastDataState = atom({
  key: "forecastDataState",
  default: [],
});

export const weatherDataListState = atom({
  key: "weatherDataListState",
  default: [],
});

export const weatherLocationState = atom({
  key: "weatherLocationState",
  default: null,
});

export const favouriteLocationsState = atom({
  key: "favouriteLocationsState",
  default: [],
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
