import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import PageHeader from "../components/PageHeader.jsx";
import SearchInput from "../components/SearchInput.jsx";
import SortSelect from "../components/SortSelect.jsx";
import SeverityFilter from "../components/SeverityFilter.jsx";
import FindingTable from "../components/FindingTable.jsx";
import StateMessage from "../components/StateMessage.jsx";
import useFetch from "../hooks/useFetch.js";
import { getScanData } from "../data/api.js";
import { filterFindings } from "../utils/filterFindings.js";
import { formatDate } from "../utils/format.js";

const sortOptions = [
  { value: "severity", label: "Severity" },
  { value: "file", label: "File" },
  { value: "tool", label: "Tool" }
];

export default function Findings() {
  const { scanId } = useParams();
  const { data, loading, error } = useFetch(getScanData);
  const [severity, setSeverity] = useState("all");
  const [searchText, setSearchText] = useState("");
  const [sortBy, setSortBy] = useState("severity");

  if (loading || error) {
    return (
      <>
        <PageHeader title="Findings" breadcrumb={<Link to="/">← Repositories</Link>} />
        <div className="page-body">
          {loading
            ? <StateMessage type="loading" />
            : <StateMessage type="error" title="Something went wrong" text={error} />}
        </div>
      </>
    );
  }

  const scan = data.scans.find(s => s.id === scanId);
  const repo = scan ? data.repositories.find(r => r.id === scan.repoId) : undefined;

  if (!scan) {
    return (
      <>
        <PageHeader title="Findings" breadcrumb={<Link to="/">← Repositories</Link>} />
        <div className="page-body">
          <StateMessage type="empty" title="Scan not found" text="Open a repository and click View findings." />
        </div>
      </>
    );
  }

  const scanFindings = data.findings.filter(f => f.scanId === scan.id);
  const visible = filterFindings(scanFindings, { severity, searchText, sortBy });
  const breadcrumb = (
    <Link to={"/repos/" + repo.id}>← {repo.name} · {formatDate(scan.date)} scan</Link>
  );

  return (
    <>
      <PageHeader title="Findings" breadcrumb={breadcrumb} />
      <div className="page-body">
        {scanFindings.length === 0 ? (
          <StateMessage type="empty" title="No detailed findings" text="The sample data has no findings for this scan." />
        ) : (
          <>
            <div className="toolbar">
              <SearchInput id="finding-search" value={searchText} onChange={setSearchText} placeholder="Search finding or file..." />
              <SortSelect id="finding-sort" value={sortBy} onChange={setSortBy} options={sortOptions} />
            </div>

            <SeverityFilter findings={scanFindings} active={severity} onChange={setSeverity} />

            <p className="result-count">
              Showing {visible.length} of {scanFindings.length} findings
            </p>

            {visible.length === 0 ? (
              <StateMessage type="empty" title="No results" text="No findings match your filters." />
            ) : (
              <FindingTable findings={visible} className="findings-table" />
            )}
          </>
        )}
      </div>
    </>
  );
}
