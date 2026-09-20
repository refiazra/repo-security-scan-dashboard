import { useState } from "react";
import { Link } from "react-router-dom";
import PageHeader from "../components/PageHeader.jsx";
import SearchInput from "../components/SearchInput.jsx";
import SortSelect from "../components/SortSelect.jsx";
import RepositoryRow from "../components/RepositoryRow.jsx";
import StateMessage from "../components/StateMessage.jsx";
import useFetch from "../hooks/useFetch.js";
import { getRepositories } from "../data/api.js";
import { getLatestScan } from "../utils/scanHelpers.js";

const sortOptions = [
  { value: "score", label: "Security score" },
  { value: "name", label: "Name" },
  { value: "date", label: "Last scan" }
];

export default function Repositories() {
  const { data, loading, error } = useFetch(getRepositories);
  const [searchText, setSearchText] = useState("");
  const [sortBy, setSortBy] = useState("score");

  let content;

  if (loading) {
    content = <StateMessage type="loading" />;
  } else if (error) {
    content = <StateMessage type="error" title="Something went wrong" text={error} />;
  } else if (data.repositories.length === 0) {
    content = <StateMessage type="empty" title="No repositories yet" text="Start a scan to add one." />;
  } else {
    const rows = data.repositories
      .filter(repo => repo.name.toLowerCase().includes(searchText.trim().toLowerCase()))
      .map(repo => ({ repo, latestScan: getLatestScan(data.scans, repo.id) }))
      .sort((a, b) => {
        if (sortBy === "name") return a.repo.name.localeCompare(b.repo.name);
        if (!a.latestScan) return 1;
        if (!b.latestScan) return -1;
        if (sortBy === "score") return a.latestScan.score - b.latestScan.score;
        return b.latestScan.date.localeCompare(a.latestScan.date);
      });

    content = (
      <>
        <div className="toolbar">
          <SearchInput id="repo-search" value={searchText} onChange={setSearchText} placeholder="Search repositories..." />
          <SortSelect id="repo-sort" value={sortBy} onChange={setSortBy} options={sortOptions} />
        </div>

        {rows.length === 0 ? (
          <StateMessage type="empty" title="No repositories found" text="Try a different search." />
        ) : (
          <table className="repo-table">
            <thead>
              <tr>
                <th scope="col">Repository</th>
                <th scope="col">Branch</th>
                <th scope="col">Last scan</th>
                <th scope="col">Score</th>
                <th scope="col">Findings</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(row => (
                <RepositoryRow key={row.repo.id} repo={row.repo} latestScan={row.latestScan} />
              ))}
            </tbody>
          </table>
        )}
      </>
    );
  }

  return (
    <>
      <PageHeader
        title="Repositories"
        subtitle={data ? data.repositories.length + " repositories monitored" : null}
        actions={<Link className="btn btn-primary" to="/new-scan">+ New Scan</Link>}
      />
      <div className="page-body">{content}</div>
    </>
  );
}
