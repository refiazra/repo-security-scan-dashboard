export function getRepoScans(scans, repoId) {
  return scans
    .filter(scan => scan.repoId === repoId)
    .sort((a, b) => a.date.localeCompare(b.date));
}

export function getLatestScan(scans, repoId) {
  const repoScans = getRepoScans(scans, repoId);
  return repoScans[repoScans.length - 1];
}

export function getPreviousScan(scans, scan) {
  const repoScans = getRepoScans(scans, scan.repoId);
  const index = repoScans.findIndex(s => s.id === scan.id);
  return repoScans[index - 1];
}
