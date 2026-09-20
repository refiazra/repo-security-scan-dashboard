export default function ScanButton({ scanning }) {
  return (
    <button type="submit" className="btn-primary" disabled={scanning}>
      {scanning ? "Scanning..." : "Start Scan"}
    </button>
  );
}
