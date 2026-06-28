export const getTime = (dateTime) => {
  return dateTime.split("T")[1];
};

// Reverse-geocode coordinates into a city name using BigDataCloud's keyless
// client endpoint (no API key required, CORS-enabled). Returns null when no
// usable place name is found.
export const getCityFromCoords = async (latitude, longitude) => {
  const url = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`;

  const response = await fetch(url);
  const data = await response.json();

  return data.city || data.locality || data.principalSubdivision || null;
};

export const getNameOfTheDay = (dateString) => {
  const date = new Date(dateString);
  const dayOfWeekNumber = date.getDay();
  const daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  return daysOfWeek[dayOfWeekNumber];
};

export const isToday = (dateString) => {
  const date = new Date(dateString);
  const currentDate = new Date();

  const isToday =
    date.getDate() === currentDate.getDate() &&
    date.getMonth() === currentDate.getMonth() &&
    date.getFullYear() === currentDate.getFullYear();

  const result = isToday ? "Today" : date.toLocaleString();
  return result;
};
