const repoSelect = document.getElementById("history-repo");
const subtitle = document.getElementById("history-subtitle");
const trendNote = document.getElementById("trend-note");
const chart = document.getElementById("chart");
const barTemplate = document.getElementById("bar-template");
const historyList = document.getElementById("history-list");
const rowTemplate = document.getElementById("history-row-template");

function getRepoScans(repoId) {
  const repoScans = scans.filter(scan => scan.repoId === repoId);
  repoScans.sort((a, b) => a.date.localeCompare(b.date));
  return repoScans;
}

function getChangeText(difference) {
  if (difference > 0) return "Up " + difference;
  if (difference < 0) return "Down " + Math.abs(difference);
  return "No change";
}

function fillRepoSelect() {
  repositories.forEach(repo => {
    if (getRepoScans(repo.id).length === 0) return;

    const option = document.createElement("option");
    option.value = repo.id;
    option.textContent = repo.name;
    repoSelect.appendChild(option);
  });
}

function renderTrend(repoScans) {
  trendNote.className = "trend-note";

  if (repoScans.length < 2) {
    trendNote.textContent = "Only one scan so far";
    trendNote.classList.add("trend-flat");
    return;
  }

  const last = repoScans[repoScans.length - 1];
  const before = repoScans[repoScans.length - 2];
  const difference = last.score - before.score;

  if (difference > 0) {
    trendNote.textContent = "Up " + difference + " points in the last scan";
    trendNote.classList.add("trend-up");
  } else if (difference < 0) {
    trendNote.textContent = "Down " + Math.abs(difference) + " points in the last scan";
  } else {
    trendNote.textContent = "No change in the last scan";
    trendNote.classList.add("trend-flat");
  }
}

function renderChart(repoScans) {
  chart.innerHTML = "";

  repoScans.forEach((scan, index) => {
    const bar = barTemplate.content.cloneNode(true);

    bar.querySelector(".bar-value").textContent = scan.score;
    bar.querySelector(".bar-fill").style.height = (scan.score * 1.6) + "px";
    bar.querySelector(".bar-label").textContent = formatDate(scan.date).slice(0, -5);

    if (index === repoScans.length - 1) {
      bar.querySelector(".bar").classList.add("bar-latest");
    }

    chart.appendChild(bar);
  });
}

function renderTable(repoScans) {
  historyList.innerHTML = "";

  const newestFirst = [...repoScans].reverse();

  newestFirst.forEach(scan => {
    const row = rowTemplate.content.cloneNode(true);

    const time = row.querySelector("time");
    time.textContent = formatDate(scan.date) + ", " + formatTime(scan.date);
    time.setAttribute("datetime", scan.date);

    row.querySelector(".branch").textContent = scan.branch;

    const scoreBadge = row.querySelector(".score");
    scoreBadge.textContent = scan.score;
    scoreBadge.classList.add("score-" + getScoreLevel(scan.score));

    const change = row.querySelector(".change");
    const previous = getPreviousScan(scan);

    if (!previous) {
      change.textContent = "First scan";
    } else {
      const difference = scan.score - previous.score;
      change.textContent = getChangeText(difference);
      if (difference < 0) change.classList.add("change-down");
      if (difference > 0) change.classList.add("change-up");
    }

    row.querySelector(".history-findings").textContent = countFindings(scan) + " findings";

    historyList.appendChild(row);
  });
}

function renderHistory() {
  const repo = repositories.find(r => r.id === repoSelect.value);
  const repoScans = getRepoScans(repo.id);

  const word = repoScans.length === 1 ? " scan" : " scans";
  subtitle.textContent = repo.name + " · " + repoScans.length + word;

  renderTrend(repoScans);
  renderChart(repoScans);
  renderTable(repoScans);
}

fillRepoSelect();
repoSelect.addEventListener("change", renderHistory);
renderHistory();