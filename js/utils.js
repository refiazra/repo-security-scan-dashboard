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