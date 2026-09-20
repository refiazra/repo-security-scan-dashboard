function showMessage(text) {
  document.getElementById("finding-severity").hidden = true;
  document.getElementById("finding-title").textContent = "Finding not found";
  document.getElementById("finding-actions").hidden = true;

  const pageBody = document.getElementById("page-body");
  pageBody.innerHTML = "";

  const message = document.createElement("p");
  message.textContent = text;
  pageBody.appendChild(message);
}

function renderFinding(finding) {
  document.title = finding.title + " - SecScan";
  document.getElementById("back-link").href = "findings.html?scan=" + finding.scanId;

  const badge = document.getElementById("finding-severity");
  badge.textContent = finding.severity;
  badge.classList.add("severity-" + finding.severity);

  document.getElementById("finding-title").textContent = finding.title;
  document.getElementById("finding-description").textContent = finding.description;
  document.getElementById("finding-file").textContent =
    finding.file + " — line " + finding.line;
  document.getElementById("finding-snippet").textContent =
    finding.line + "  " + finding.snippet;
  document.getElementById("finding-fix").textContent = finding.recommendation;
  document.getElementById("finding-scanner").textContent = finding.scanner;
  document.getElementById("finding-category").textContent = finding.category;
  document.getElementById("finding-impact").textContent = finding.impact;

  const firstSeen = document.getElementById("finding-first-seen");
  firstSeen.textContent = formatDate(finding.firstSeen);
  firstSeen.setAttribute("datetime", finding.firstSeen);
}

function setStatus(label, className) {
  const status = document.getElementById("finding-status");
  status.textContent = label;
  status.className = "status " + className;

  document.getElementById("resolve-btn").disabled = true;
  document.getElementById("ignore-btn").disabled = true;
}

const params = new URLSearchParams(window.location.search);
const findingId = params.get("id");
const finding = findings.find(f => f.id === findingId);

if (!finding) {
  showMessage("Go back to the findings list and pick a finding.");
} else {
  renderFinding(finding);

  document.getElementById("resolve-btn").addEventListener("click", () => {
    setStatus("Resolved", "status-resolved");
  });

  document.getElementById("ignore-btn").addEventListener("click", () => {
    setStatus("Ignored", "status-ignored");
  });
}