function convertTo12Hour(time) {
  if (!time) return "";

  let [hour, minute] = time.split(":");
  hour = parseInt(hour);

  const ampm = hour >= 12 ? "PM" : "AM";
  hour = hour % 12 || 12;

  return `${hour}:${minute} ${ampm}`;
}
function convert12HourTo24Hour(time12h) {
  if (!time12h) return "";
  const [time, modifier] = time12h.split(" ");
  let [hours, minutes] = time.split(":");

  if (hours === "12") {
    hours = "00";
  }
  if (modifier === "PM") {
    hours = parseInt(hours, 10) + 12;
  }

  return `${hours.toString().padStart(2, "0")}:${minutes}`;
}
function formatTimeAgo(dateString) {
  if (!dateString) return "Unknown";

  const now = new Date();
  const created = new Date(dateString);
  const diffMs = now - created;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return diffHours === 1 ? "1h ago" : `${diffHours}h ago`;
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)}mo ago`;
  return `${Math.floor(diffDays / 365)}y ago`;
}
function formatDuration(minutes) {
  const hrs = Math.floor(minutes / 60);
  const mins = minutes % 60;

  if (hrs === 0) return `${mins} min`;
  if (mins === 0) return `${hrs} hr`;
  return `${hrs} hr ${mins} min`;
}

export {
  convertTo12Hour,
  convert12HourTo24Hour,
  formatTimeAgo,
  formatDuration,
};
