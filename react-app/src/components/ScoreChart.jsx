import { formatDate } from "../utils/format.js";

export default function ScoreChart({ scans }) {
  return (
    <ul className="chart">
      {scans.map((scan, index) => (
        <li key={scan.id} className={index === scans.length - 1 ? "bar bar-latest" : "bar"}>
          <span className="bar-value">{scan.score}</span>
          <span className="bar-fill" style={{ height: scan.score * 1.6 + "px" }}></span>
          <span className="bar-label">{formatDate(scan.date).slice(0, -5)}</span>
        </li>
      ))}
    </ul>
  );
}
