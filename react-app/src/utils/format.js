export function formatDate(dateText) {
  return new Date(dateText).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric"
  });
}

export function formatTime(dateText) {
  return dateText.slice(11, 16);
}

export function formatDuration(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return minutes === 0 ? seconds + " s" : minutes + " min " + seconds + " s";
}
