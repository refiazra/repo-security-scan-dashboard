import { Link } from "react-router-dom";
import ScoreBadge from "./ScoreBadge.jsx";
import { formatDate } from "../utils/format.js";
import { countFindings } from "../utils/calculateScore.js";

export default function RepositoryRow({ repo, latestScan }) {
  return (
    <tr>
      <td>
        <Link to={"/repos/" + repo.id}>{repo.name}</Link>
        <span className="repo-org">{repo.org}</span>
      </td>
      <td><span className="branch">{repo.defaultBranch}</span></td>
      <td>{latestScan ? formatDate(latestScan.date) : "Never scanned"}</td>
      <td><ScoreBadge score={latestScan?.score} /></td>
      <td>
        {latestScan
          ? countFindings(latestScan.summary) + " findings"
          : <Link to="/new-scan">Start scan</Link>}
      </td>
    </tr>
  );
}
