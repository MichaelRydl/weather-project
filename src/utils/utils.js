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
