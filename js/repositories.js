const repoList = document.getElementById("repo-list");
const rowTemplate = document.getElementById("repo-row-template");
const repoCount = document.getElementById("repo-count");

function renderRepositories(list) {
  repoList.innerHTML = "";

  list.forEach(repo => {
    const row = rowTemplate.content.cloneNode(true);
    const latestScan = getLatestScan(repo.id);

    const link = row.querySelector(".repo-name");
    link.textContent = repo.name;
    link.href = "scan-detail.html?repo=" + repo.id;

    row.querySelector(".repo-org").textContent = repo.org;
    row.querySelector(".branch").textContent = repo.defaultBranch;

    const dateCell = row.querySelector(".repo-date");
    const scoreBadge = row.querySelector(".score");
    const findingsCell = row.querySelector(".repo-findings");

    if (latestScan) {
      dateCell.textContent = formatDate(latestScan.date);
      scoreBadge.textContent = latestScan.score;
      scoreBadge.classList.add("score-" + getScoreLevel(latestScan.score));
      findingsCell.textContent = countFindings(latestScan) + " findings";
    } else {
      dateCell.textContent = "Never scanned";
      scoreBadge.textContent = "—";

      const startLink = document.createElement("a");
      startLink.href = "new-scan.html";
      startLink.textContent = "Start scan";
      findingsCell.appendChild(startLink);
    }

    repoList.appendChild(row);
  });

    repoCount.textContent = repositories.length + " repositories monitored";
}

const searchInput = document.getElementById("repo-search");
const sortSelect = document.getElementById("repo-sort");

function updateList() {
  const searchText = searchInput.value.trim().toLowerCase();

  const filtered = repositories.filter(repo =>
    repo.name.toLowerCase().includes(searchText)
  );

  const sortBy = sortSelect.value;

  filtered.sort((a, b) => {
    if (sortBy === "name") {
      return a.name.localeCompare(b.name);
    }

    const scanA = getLatestScan(a.id);
    const scanB = getLatestScan(b.id);

    if (!scanA) return 1;
    if (!scanB) return -1;

    if (sortBy === "score") {
      return scanA.score - scanB.score;
    }

    return scanB.date.localeCompare(scanA.date);
  });

  renderRepositories(filtered);
}

searchInput.addEventListener("input", updateList);
sortSelect.addEventListener("change", updateList);

updateList();