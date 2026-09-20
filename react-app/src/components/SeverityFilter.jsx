const levels = [
  { key: "all", label: "All" },
  { key: "critical", label: "Critical" },
  { key: "high", label: "High" },
  { key: "medium", label: "Medium" },
  { key: "low", label: "Low" }
];

export default function SeverityFilter({ findings, active, onChange }) {
  return (
    <div className="filters">
      {levels.map(level => {
        const count = level.key === "all"
          ? findings.length
          : findings.filter(f => f.severity === level.key).length;
        const isActive = active === level.key;

        return (
          <button
            key={level.key}
            type="button"
            className={"chip chip-" + level.key + (isActive ? " chip-active" : "")}
            aria-pressed={isActive}
            onClick={() => onChange(level.key)}
          >
            {level.label} {count}
          </button>
        );
      })}
    </div>
  );
}
