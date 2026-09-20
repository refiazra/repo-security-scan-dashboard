const scoreLabels = {
  critical: "Poor — needs immediate attention",
  high: "Weak — several risks to fix",
  medium: "Fair — some issues to plan",
  low: "Good — only minor issues"
};

function showMessage(title, text) {
  document.title = title + " - SecScan";
  document.getElementById("repo-name").textContent = title;
  document.getElementById("scan-meta").hidden = true;
  document.getElementById("view-findings").hidden = true;

  const pageBody = document.getElementById("page-body");
  pageBody.innerHTML = "";

  const message = document.createElement("p");
  message.textContent = text;
  pageBody.appendChild(message);
}

function renderScan(repo, scan) {
  document.title = repo.name + " - SecScan";
  document.getElementById("repo-name").textContent = repo.name;
  document.getElementById("scan-branch").textContent = scan.branch;
  document.getElementById("scan-date").textContent =
    formatDate(scan.date) + ", " + formatTime(scan.date);

  const findingsUrl = "findings.html?scan=" + scan.id;
  document.getElementById("view-findings").href = findingsUrl;

  const level = getScoreLevel(scan.score);
  document.getElementById("score-value").textContent = scan.score;
  document.getElementById("score-label").textContent = scoreLabels[level];
  document.getElementById("score-panel").classList.add("level-" + level);

  document.getElementById("count-critical").textContent = scan.summary.critical;
  document.getElementById("count-high").textContent = scan.summary.high;
  document.getElementById("count-medium").textContent = scan.summary.medium;
  document.getElementById("count-low").textContent = scan.summary.low;

  const total = countFindings(scan);
  const previous = getPreviousScan(scan);

  document.getElementById("scan-duration").textContent = formatDuration(scan.durationSec);
  document.getElementById("scan-files").textContent = scan.filesScanned;
  document.getElementById("scan-total").textContent = total;
  document.getElementById("scan-previous").textContent =
    previous ? previous.score + " → " + scan.score : "First scan";
  document.getElementById("scan-tools").textContent = scan.tools.join(", ");

  const allLink = document.getElementById("all-findings-link");
  allLink.textContent = "View all " + total + " findings";
  allLink.href = findingsUrl;

  renderTopFindings(scan);
}

function renderTopFindings(scan) {
  const list = document.getElementById("top-findings-list");
  const template = document.getElementById("finding-row-template");

  const scanFindings = findings.filter(f => f.scanId === scan.id);

  if (scanFindings.length === 0) {
    document.getElementById("top-table").hidden = true;
    document.getElementById("no-findings").hidden = false;
    document.getElementById("all-findings-link").hidden = true;
    return;
  }

  scanFindings.sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity]);
  const topFour = scanFindings.slice(0, 4);

  topFour.forEach(finding => {
    const row = template.content.cloneNode(true);

    const badge = row.querySelector(".severity");
    badge.textContent = finding.severity;
    badge.classList.add("severity-" + finding.severity);

    const link = row.querySelector(".finding-title");
    link.textContent = finding.title;
    link.href = "finding-detail.html?id=" + finding.id;

    row.querySelector(".file-ref").textContent = finding.file + " : " + finding.line;
    row.querySelector(".finding-tool").textContent = finding.scanner;

    list.appendChild(row);
  });
}

const params = new URLSearchParams(window.location.search);
const repoId = params.get("repo");

const repo = repositories.find(r => r.id === repoId);

if (!repo) {
  showMessage("Repository not found", "Go back to the repository list and pick a repository.");
} else {
  const scan = getLatestScan(repo.id);

  if (!scan) {
    showMessage(repo.name, "This repository has not been scanned yet.");
  } else {
    renderScan(repo, scan);
  }
}