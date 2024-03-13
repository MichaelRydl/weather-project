import axios from "axios";

const API_KEY = import.meta.env.VITE_OPEN_WEATHER_API_KEY;

export const fetchWeatherData = async (
  location,
  setGeoData,
  setWeatherData
) => {
  try {
    const geoResponse = await axios.get(
      `https://api.openweathermap.org/geo/1.0/direct?q=${location}&appid=${API_KEY}`
    );
    setGeoData((prevState) => [...prevState, geoResponse.data[0]]);

    const { lat, lon } = geoResponse.data[0];
    const weatherResponse = await axios.get(
      `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&appid=${API_KEY}`
    );
    setWeatherData((prevState) => [...prevState, weatherResponse.data]);
  } catch (error) {
    console.error(error);
  }
};

export const kelvinToCelsius = (kelvin) => {
  return kelvin - 273.15;
};

export const convertUnixTimestampToTime = (timestamp) => {
  const unixTimestamp = timestamp * 1000;

  const date = new Date(unixTimestamp);

  const hours = ("0" + date.getHours()).slice(-2);
  const minutes = ("0" + date.getMinutes()).slice(-2);

  return hours + ":" + minutes;
};
