import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import PageHeader from "../components/PageHeader.jsx";
import SeverityBadge from "../components/SeverityBadge.jsx";
import StateMessage from "../components/StateMessage.jsx";
import useFetch from "../hooks/useFetch.js";
import { getScanData } from "../data/api.js";
import { formatDate } from "../utils/format.js";

const statusLabels = { open: "Open", resolved: "Resolved", ignored: "Ignored" };

export default function FindingDetail() {
  const { findingId } = useParams();
  const { data, loading, error } = useFetch(getScanData);
  const [status, setStatus] = useState("open");

  if (loading || error) {
    return (
      <>
        <PageHeader title="Finding" breadcrumb={<Link to="/">← Repositories</Link>} />
        <div className="page-body">
          {loading
            ? <StateMessage type="loading" />
            : <StateMessage type="error" title="Something went wrong" text={error} />}
        </div>
      </>
    );
  }

  const finding = data.findings.find(f => f.id === findingId);

  if (!finding) {
    return (
      <>
        <PageHeader title="Finding not found" breadcrumb={<Link to="/">← Repositories</Link>} />
        <div className="page-body">
          <StateMessage type="empty" title="Finding not found" text="Go back to the findings list and pick a finding." />
        </div>
      </>
    );
  }

  const isOpen = status === "open";

  return (
    <>
      <PageHeader
        breadcrumb={<Link to={"/scans/" + finding.scanId + "/findings"}>← Findings</Link>}
        title={<><SeverityBadge severity={finding.severity} /> {finding.title}</>}
        actions={
          <div className="header-actions">
            <button type="button" disabled={!isOpen} onClick={() => setStatus("ignored")}>
              Ignore
            </button>
            <button type="button" className="btn-primary" disabled={!isOpen} onClick={() => setStatus("resolved")}>
              Mark as resolved
            </button>
          </div>
        }
      />
      <div className="page-body">
        <section className="finding-description">
          <h2>Description</h2>
          <p>{finding.description}</p>
        </section>

        <section className="affected-code">
          <h2>Affected code</h2>
          <p className="file-ref">{finding.file} — line {finding.line}</p>
          <pre><code>{finding.line}  {finding.snippet}</code></pre>
        </section>

        <section className="suggested-fix">
          <h2>Suggested fix</h2>
          <p>{finding.recommendation}</p>
        </section>

        <section className="finding-meta">
          <h2>Finding details</h2>
          <dl>
            <dt>Status</dt>
            <dd><span className={"status status-" + status}>{statusLabels[status]}</span></dd>
            <dt>Scanner</dt>
            <dd>{finding.scanner}</dd>
            <dt>First seen</dt>
            <dd><time dateTime={finding.firstSeen}>{formatDate(finding.firstSeen)}</time></dd>
            <dt>Category</dt>
            <dd>{finding.category}</dd>
          </dl>
        </section>

        <section className="finding-impact">
          <h2>Possible impact</h2>
          <p>{finding.impact}</p>
        </section>
      </div>
    </>
  );
}
