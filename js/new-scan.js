const form = document.getElementById("scan-form");
const urlInput = document.getElementById("repo-url");
const formError = document.getElementById("form-error");
const startButton = document.getElementById("start-btn");
const scanResult = document.getElementById("scan-result");

const steps = {
  ready: document.getElementById("step-ready"),
  scanning: document.getElementById("step-scanning"),
  completed: document.getElementById("step-completed")
};

function setStep(name) {
  steps.ready.classList.remove("status-active");
  steps.scanning.classList.remove("status-active");
  steps.completed.classList.remove("status-active");

  steps[name].classList.add("status-active");
}

function showError(text) {
  formError.textContent = text;
  formError.hidden = false;
}

function getRepoName(url) {
  const prefix = "https://github.com/";
  if (!url.startsWith(prefix)) return null;

  const parts = url.slice(prefix.length).split("/");
  if (parts.length < 2 || parts[0] === "" || parts[1] === "") return null;

  return parts[1];
}

function showResult(repoName) {
  scanResult.innerHTML = "";

  const repo = repositories.find(r => r.name === repoName);

  if (repo) {
    const link = document.createElement("a");
    link.href = "scan-detail.html?repo=" + repo.id;
    link.textContent = "View results for " + repo.name;
    scanResult.appendChild(link);
  } else {
    scanResult.textContent =
      "Demo only: results are available for the sample repositories.";
  }

  scanResult.hidden = false;
}

form.addEventListener("submit", event => {
  event.preventDefault();
  formError.hidden = true;
  scanResult.hidden = true;

  const repoName = getRepoName(urlInput.value.trim());
  if (!repoName) {
    showError("Please enter a URL like https://github.com/org/repo");
    return;
  }

  const checkedTools = form.querySelectorAll('input[name="tools"]:checked');
  if (checkedTools.length === 0) {
    showError("Please select at least one scan tool.");
    return;
  }

  startButton.disabled = true;
  setStep("scanning");
  steps.scanning.textContent = "Scanning with " + checkedTools.length + " tools...";

  setTimeout(() => {
    setStep("completed");
    steps.scanning.textContent = "Scanning...";
    startButton.disabled = false;
    showResult(repoName);
  }, 2000);
});

form.addEventListener("reset", () => {
  formError.hidden = true;
  scanResult.hidden = true;
  setStep("ready");
});