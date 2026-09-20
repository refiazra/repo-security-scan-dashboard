const cards = [
  { key: "critical", title: "Critical", note: "fix immediately" },
  { key: "high", title: "High", note: "in this release" },
  { key: "medium", title: "Medium", note: "can be planned" },
  { key: "low", title: "Low", note: "informational" }
];

export default function SeverityCards({ summary }) {
  return (
    <section className="severity-summary">
      <h2>Findings by severity</h2>
      <ul className="card-list">
        {cards.map(card => (
          <li key={card.key} className={"card card-" + card.key}>
            <span className="card-title">{card.title}</span>
            <span className="card-count">{summary[card.key]}</span>
            <span className="card-note">{card.note}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
