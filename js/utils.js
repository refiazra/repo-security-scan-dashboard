function formatDate(dateText) {
  const date = new Date(dateText);
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric"
  });
}

function getScoreLevel(score) {
  if (score < 50) return "critical";
  if (score < 60) return "high";
  if (score < 70) return "medium";
  return "low";
}

function getLatestScan(repoId) {
  const repoScans = scans.filter(scan => scan.repoId === repoId);
  repoScans.sort((a, b) => b.date.localeCompare(a.date));
  return repoScans[0];
}

function countFindings(scan) {
  const s = scan.summary;
  return s.critical + s.high + s.medium + s.low;
}
function formatTime(dateText) {
  return dateText.slice(11, 16);
}

function formatDuration(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  if (minutes === 0) {
    return seconds + " s";
  }
  return minutes + " min " + seconds + " s";
}

function getPreviousScan(scan) {
  const olderScans = scans.filter(s =>
    s.repoId === scan.repoId && s.date < scan.date
  );
  olderScans.sort((a, b) => b.date.localeCompare(a.date));
  return olderScans[0];
}

const severityOrder = { critical: 0, high: 1, medium: 2, low: 3 };