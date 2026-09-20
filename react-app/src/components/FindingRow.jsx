import { Link } from "react-router-dom";
import SeverityBadge from "./SeverityBadge.jsx";

export default function FindingRow({ finding }) {
  return (
    <tr>
      <td><SeverityBadge severity={finding.severity} /></td>
      <td><Link to={"/findings/" + finding.id}>{finding.title}</Link></td>
      <td><span className="file-ref">{finding.file} : {finding.line}</span></td>
      <td>{finding.scanner}</td>
    </tr>
  );
}
