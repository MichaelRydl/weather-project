import { atom } from "recoil";

export const weatherDataState = atom({
  key: "weatherDataState",
  default: [],
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

export const weatherUnit = atom({
  key: "weatherUnit",
  default: "metric",
});
