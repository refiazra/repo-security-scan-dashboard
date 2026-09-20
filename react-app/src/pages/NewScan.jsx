import { useState } from "react";
import { Link } from "react-router-dom";
import PageHeader from "../components/PageHeader.jsx";
import ScanButton from "../components/ScanButton.jsx";
import { repositories } from "../data/mockScanResults.js";

const tools = [
  { value: "gitleaks", label: "Gitleaks — Secret scanning" },
  { value: "npm-audit", label: "npm audit — Dependency vulnerabilities" },
  { value: "semgrep", label: "Semgrep — Code pattern analysis" },
  { value: "eslint-security", label: "ESLint Security — Unsafe JS usage" }
];

const allTools = tools.map(tool => tool.value);

function getRepoName(url) {
  const prefix = "https://github.com/";
  if (!url.startsWith(prefix)) return null;

  const parts = url.slice(prefix.length).split("/");
  if (parts.length < 2 || parts[0] === "" || parts[1] === "") return null;

  return parts[1];
}

export default function NewScan() {
  const [url, setUrl] = useState("");
  const [selectedTools, setSelectedTools] = useState(allTools);
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");
  const [repoName, setRepoName] = useState("");

  function toggleTool(value) {
    if (selectedTools.includes(value)) {
      setSelectedTools(selectedTools.filter(tool => tool !== value));
    } else {
      setSelectedTools([...selectedTools, value]);
    }
  }

  function handleSubmit(event) {
    event.preventDefault();
    setError("");

    const name = getRepoName(url.trim());
    if (!name) {
      setError("Please enter a URL like https://github.com/org/repo");
      return;
    }
    if (selectedTools.length === 0) {
      setError("Please select at least one scan tool.");
      return;
    }

    setRepoName(name);
    setStatus("scanning");
    setTimeout(() => setStatus("success"), 2000);
  }

  function handleReset() {
    setUrl("");
    setSelectedTools(allTools);
    setStatus("idle");
    setError("");
  }

  const knownRepo = repositories.find(r => r.name === repoName);
  const steps = [
    { key: "idle", label: "Ready" },
    { key: "scanning", label: status === "scanning" ? "Scanning with " + selectedTools.length + " tools..." : "Scanning..." },
    { key: "success", label: "Completed" }
  ];

  return (
    <>
      <PageHeader title="New Scan" subtitle="Choose a repository and the tools to run" />
      <div className="page-body">
        <form className="scan-form" onSubmit={handleSubmit} onReset={handleReset}>
          <div className="form-field">
            <label htmlFor="repo-url">Repository URL</label>
            <input
              type="url"
              id="repo-url"
              placeholder="https://github.com/org/repo"
              required
              value={url}
              onChange={event => setUrl(event.target.value)}
            />
            <small>Enter a public GitHub repository URL.</small>
          </div>

          <div className="form-row">
            <div className="form-field">
              <label htmlFor="branch">Branch</label>
              <select id="branch" defaultValue="main">
                <option value="main">main</option>
                <option value="develop">develop</option>
                <option value="release/2.1">release/2.1</option>
              </select>
            </div>
            <div className="form-field">
              <label htmlFor="depth">Scan depth</label>
              <select id="depth" defaultValue="standard">
                <option value="quick">Quick</option>
                <option value="standard">Standard</option>
                <option value="deep">Deep</option>
              </select>
            </div>
          </div>

          <fieldset className="tool-list">
            <legend>Scan tools</legend>
            {tools.map(tool => (
              <div className="tool-item" key={tool.value}>
                <input
                  type="checkbox"
                  id={"tool-" + tool.value}
                  checked={selectedTools.includes(tool.value)}
                  onChange={() => toggleTool(tool.value)}
                />
                <label htmlFor={"tool-" + tool.value}>{tool.label}</label>
              </div>
            ))}
          </fieldset>

          {error && <p className="form-error" role="alert">{error}</p>}

          <div className="form-actions">
            <button type="reset">Cancel</button>
            <ScanButton scanning={status === "scanning"} />
          </div>
        </form>

        <section className="scan-status" aria-live="polite">
          <h2>Scan status</h2>
          <ul>
            {steps.map(step => (
              <li key={step.key} className={step.key === status ? "status-active" : ""}>
                {step.label}
              </li>
            ))}
          </ul>
          {status === "success" && (
            <p className="scan-result">
              {knownRepo
                ? <Link to={"/repos/" + knownRepo.id}>View results for {knownRepo.name}</Link>
                : "Demo only: results are available for the sample repositories."}
            </p>
          )}
        </section>

        <p className="info-note">
          Scans are simulated in this version. Results come from prepared
          sample data; the goal is to model and present security data clearly.
        </p>
      </div>
    </>
  );
}
