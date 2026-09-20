const severityLabels = {
  all: "All",
  critical: "Critical",
  high: "High",
  medium: "Medium",
  low: "Low"
};

const findingsList = document.getElementById("findings-list");
const rowTemplate = document.getElementById("finding-row-template");
const resultCount = document.getElementById("result-count");
const searchInput = document.getElementById("finding-search");
const sortSelect = document.getElementById("finding-sort");
const chips = document.querySelectorAll(".chip");

let scanFindings = [];
let activeSeverity = "all";

function showMessage(text) {
  const pageBody = document.getElementById("page-body");
  pageBody.innerHTML = "";

  const message = document.createElement("p");
  message.textContent = text;
  pageBody.appendChild(message);
}

function setupHeader(scan) {
  const repo = repositories.find(r => r.id === scan.repoId);
  const backLink = document.getElementById("back-link");

  backLink.textContent = "← " + repo.name + " · " + formatDate(scan.date) + " scan";
  backLink.href = "scan-detail.html?repo=" + repo.id;
  document.title = "Findings · " + repo.name + " - SecScan";
}

function setupChips() {
  chips.forEach(chip => {
    const severity = chip.dataset.severity;

    let count = scanFindings.length;
    if (severity !== "all") {
      count = scanFindings.filter(f => f.severity === severity).length;
    }

    chip.textContent = severityLabels[severity] + " " + count;

    chip.addEventListener("click", () => {
      activeSeverity = severity;
      updateList();
    });
  });
}

function renderFindings(list) {
  findingsList.innerHTML = "";

  list.forEach(finding => {
    const row = rowTemplate.content.cloneNode(true);

    const badge = row.querySelector(".severity");
    badge.textContent = finding.severity;
    badge.classList.add("severity-" + finding.severity);

    const link = row.querySelector(".finding-title");
    link.textContent = finding.title;
    link.href = "finding-detail.html?id=" + finding.id;

    row.querySelector(".file-ref").textContent = finding.file + " : " + finding.line;
    row.querySelector(".finding-tool").textContent = finding.scanner;

    findingsList.appendChild(row);
  });

  resultCount.textContent =
    "Showing " + list.length + " of " + scanFindings.length + " findings";
}

function updateList() {
  chips.forEach(chip => {
    const isActive = chip.dataset.severity === activeSeverity;
    chip.classList.toggle("chip-active", isActive);
    chip.setAttribute("aria-pressed", isActive);
  });

  const searchText = searchInput.value.trim().toLowerCase();

  const filtered = scanFindings.filter(f => {
    const severityMatch = activeSeverity === "all" || f.severity === activeSeverity;
    const textMatch =
      f.title.toLowerCase().includes(searchText) ||
      f.file.toLowerCase().includes(searchText);
    return severityMatch && textMatch;
  });

  const sortBy = sortSelect.value;

  filtered.sort((a, b) => {
    if (sortBy === "file") return a.file.localeCompare(b.file);
    if (sortBy === "tool") return a.scanner.localeCompare(b.scanner);
    return severityOrder[a.severity] - severityOrder[b.severity];
  });

  renderFindings(filtered);
}

const params = new URLSearchParams(window.location.search);
const scanId = params.get("scan");
const scan = scans.find(s => s.id === scanId);

if (!scan) {
  const backLink = document.getElementById("back-link");
  backLink.textContent = "← Repositories";
  backLink.href = "index.html";
  showMessage("Scan not found. Open a repository and click \"View findings\".");
} else {
  setupHeader(scan);
  scanFindings = findings.filter(f => f.scanId === scan.id);

  if (scanFindings.length === 0) {
    showMessage("No detailed findings in the sample data for this scan.");
  } else {
    setupChips();
    searchInput.addEventListener("input", updateList);
    sortSelect.addEventListener("change", updateList);
    updateList();
  }
}