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
