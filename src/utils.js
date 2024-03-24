export const getTime = (dateTime) => {
  return dateTime.split("T")[1];
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
