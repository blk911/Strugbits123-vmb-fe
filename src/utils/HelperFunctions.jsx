function convertTo12Hour(time) {
  if (!time) return "";

  let [hour, minute] = time.split(":");
  hour = parseInt(hour);

  const ampm = hour >= 12 ? "PM" : "AM";
  hour = hour % 12 || 12;

  return `${hour}:${minute} ${ampm}`;
}

export { convertTo12Hour };
