import { useState } from "react";
import PageHeader from "../components/PageHeader.jsx";
import ScoreChart from "../components/ScoreChart.jsx";
import ScoreBadge from "../components/ScoreBadge.jsx";
import StateMessage from "../components/StateMessage.jsx";
import useFetch from "../hooks/useFetch.js";
import { getRepositories } from "../data/api.js";
import { getRepoScans } from "../utils/scanHelpers.js";
import { countFindings } from "../utils/calculateScore.js";
import { formatDate, formatTime } from "../utils/format.js";

function getChange(difference) {
  if (difference > 0) return { text: "Up " + difference, className: "change change-up" };
  if (difference < 0) return { text: "Down " + Math.abs(difference), className: "change change-down" };
  return { text: "No change", className: "change" };
}

export default function ScanHistory() {
  const { data, loading, error } = useFetch(getRepositories);
  const [repoId, setRepoId] = useState("payment-gateway");

  if (loading || error) {
    return (
      <>
        <PageHeader title="Scan History" />
        <div className="page-body">
          {loading
            ? <StateMessage type="loading" />
            : <StateMessage type="error" title="Something went wrong" text={error} />}
        </div>
      </>
    );
  }

  const scannedRepos = data.repositories.filter(r => getRepoScans(data.scans, r.id).length > 0);
  const repo = scannedRepos.find(r => r.id === repoId) || scannedRepos[0];

  if (!repo) {
    return (
      <>
        <PageHeader title="Scan History" />
        <div className="page-body">
          <StateMessage type="empty" title="No scans yet" text="Run a scan to see its history." />
        </div>
      </>
    );
  }

  const repoScans = getRepoScans(data.scans, repo.id);
  const last = repoScans[repoScans.length - 1];
  const before = repoScans[repoScans.length - 2];

  let trend = { text: "Only one scan so far", className: "trend-note trend-flat" };
  if (before) {
    const difference = last.score - before.score;
    if (difference > 0) trend = { text: "Up " + difference + " points in the last scan", className: "trend-note trend-up" };
    else if (difference < 0) trend = { text: "Down " + Math.abs(difference) + " points in the last scan", className: "trend-note" };
    else trend = { text: "No change in the last scan", className: "trend-note trend-flat" };
  }

  const picker = (
    <div className="repo-picker">
      <label htmlFor="history-repo">Repository</label>
      <select id="history-repo" value={repo.id} onChange={event => setRepoId(event.target.value)}>
        {scannedRepos.map(r => (
          <option key={r.id} value={r.id}>{r.name}</option>
        ))}
      </select>
    </div>
  );

  return (
    <>
      <PageHeader
        title="Scan History"
        subtitle={repo.name + " · " + repoScans.length + (repoScans.length === 1 ? " scan" : " scans")}
        actions={picker}
      />
      <div className="page-body">
        <section className="score-trend">
          <h2>Security score trend</h2>
          <p className={trend.className}>{trend.text}</p>
          <ScoreChart scans={repoScans} />
        </section>

        <section className="history-list">
          <h2>All scans</h2>
          <table>
            <thead>
              <tr>
                <th scope="col">Date</th>
                <th scope="col">Branch</th>
                <th scope="col">Score</th>
                <th scope="col">Change</th>
                <th scope="col">Findings</th>
              </tr>
            </thead>
            <tbody>
              {[...repoScans].reverse().map((scan, index, list) => {
                const previous = list[index + 1];
                const change = previous
                  ? getChange(scan.score - previous.score)
                  : { text: "First scan", className: "change" };

                return (
                  <tr key={scan.id}>
                    <td><time dateTime={scan.date}>{formatDate(scan.date)}, {formatTime(scan.date)}</time></td>
                    <td><span className="branch">{scan.branch}</span></td>
                    <td><ScoreBadge score={scan.score} /></td>
                    <td><span className={change.className}>{change.text}</span></td>
                    <td>{countFindings(scan.summary)} findings</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </section>
      </div>
    </>
  );
}
