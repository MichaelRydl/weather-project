import { atom } from "recoil";

export const geoDataState = atom({
  key: "geoDataState",
  default: [],
});

export const weatherDataState = atom({
  key: "weatherDataState",
  default: [],
});

export const geoDataListState = atom({
  key: "geoDataListState",
  default: [],
});

export const weatherDataListState = atom({
  key: "weatherDataListState",
  default: [],
});

export const weatherLocationState = atom({
  key: "weatherLocationState",
  default: "Prague",
});

export const favouriteLocationsState = atom({
  key: "favouriteLocationsState",
  default: ["Olomouc", "Prague", "Madrid"],
});
