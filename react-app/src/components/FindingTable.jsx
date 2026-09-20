import FindingRow from "./FindingRow.jsx";

export default function FindingTable({ findings, className }) {
  return (
    <table className={className}>
      <thead>
        <tr>
          <th scope="col">Severity</th>
          <th scope="col">Finding</th>
          <th scope="col">File : line</th>
          <th scope="col">Tool</th>
        </tr>
      </thead>
      <tbody>
        {findings.map(finding => (
          <FindingRow key={finding.id} finding={finding} />
        ))}
      </tbody>
    </table>
  );
}
