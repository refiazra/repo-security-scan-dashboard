export const severityOrder = { critical: 0, high: 1, medium: 2, low: 3 };

export function filterFindings(findings, { severity, searchText, sortBy }) {
  const text = searchText.trim().toLowerCase();

  const filtered = findings.filter(f => {
    const severityMatch = severity === "all" || f.severity === severity;
    const textMatch =
      f.title.toLowerCase().includes(text) || f.file.toLowerCase().includes(text);
    return severityMatch && textMatch;
  });

  return filtered.sort((a, b) => {
    if (sortBy === "file") return a.file.localeCompare(b.file);
    if (sortBy === "tool") return a.scanner.localeCompare(b.scanner);
    return severityOrder[a.severity] - severityOrder[b.severity];
  });
}
