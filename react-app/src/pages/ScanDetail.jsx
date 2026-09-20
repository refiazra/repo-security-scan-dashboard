import { Link, useParams } from "react-router-dom";
import PageHeader from "../components/PageHeader.jsx";
import SecurityScore from "../components/SecurityScore.jsx";
import SeverityCards from "../components/SeverityCards.jsx";
import FindingTable from "../components/FindingTable.jsx";
import StateMessage from "../components/StateMessage.jsx";
import useFetch from "../hooks/useFetch.js";
import { getScanData } from "../data/api.js";
import { getLatestScan, getPreviousScan } from "../utils/scanHelpers.js";
import { countFindings } from "../utils/calculateScore.js";
import { severityOrder } from "../utils/filterFindings.js";
import { formatDate, formatTime, formatDuration } from "../utils/format.js";

const backLink = <Link to="/">← Repositories</Link>;

export default function ScanDetail() {
  const { repoId } = useParams();
  const { data, loading, error } = useFetch(getScanData);

  if (loading || error) {
    return (
      <>
        <PageHeader title="Scan detail" breadcrumb={backLink} />
        <div className="page-body">
          {loading
            ? <StateMessage type="loading" />
            : <StateMessage type="error" title="Something went wrong" text={error} />}
        </div>
      </>
    );
  }

  const repo = data.repositories.find(r => r.id === repoId);
  const scan = repo ? getLatestScan(data.scans, repo.id) : undefined;

  if (!repo || !scan) {
    return (
      <>
        <PageHeader title={repo ? repo.name : "Repository not found"} breadcrumb={backLink} />
        <div className="page-body">
          <StateMessage
            type="empty"
            title={repo ? "Not scanned yet" : "Repository not found"}
            text={repo ? "Start a scan to see results here." : "Go back and pick a repository."}
          />
        </div>
      </>
    );
  }

  const previous = getPreviousScan(data.scans, scan);
  const total = countFindings(scan.summary);
  const topFindings = data.findings
    .filter(f => f.scanId === scan.id)
    .sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity])
    .slice(0, 4);
  const findingsUrl = "/scans/" + scan.id + "/findings";

  return (
    <>
      <PageHeader
        title={repo.name}
        breadcrumb={backLink}
        subtitle={<><span className="branch">{scan.branch}</span> · {formatDate(scan.date)}, {formatTime(scan.date)}</>}
        actions={<Link className="btn btn-primary" to={findingsUrl}>View findings</Link>}
      />
      <div className="page-body">
        <SecurityScore score={scan.score} />
        <SeverityCards summary={scan.summary} />

        <section className="top-findings">
          <h2>Highest risk findings</h2>
          {topFindings.length === 0 ? (
            <p>No detailed findings in the sample data for this scan.</p>
          ) : (
            <>
              <FindingTable findings={topFindings} />
              <p><Link to={findingsUrl}>View all {total} findings</Link></p>
            </>
          )}
        </section>

        <section className="scan-info">
          <h2>Scan info</h2>
          <dl>
            <dt>Duration</dt>
            <dd>{formatDuration(scan.durationSec)}</dd>
            <dt>Files scanned</dt>
            <dd>{scan.filesScanned}</dd>
            <dt>Total findings</dt>
            <dd>{total}</dd>
            <dt>Previous score</dt>
            <dd>{previous ? previous.score + " → " + scan.score : "First scan"}</dd>
            <dt>Tools used</dt>
            <dd>{scan.tools.join(", ")}</dd>
          </dl>
        </section>
      </div>
    </>
  );
}
