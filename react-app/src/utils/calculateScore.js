const scoreLabels = {
  critical: "Poor — needs immediate attention",
  high: "Weak — several risks to fix",
  medium: "Fair — some issues to plan",
  low: "Good — only minor issues"
};

export function getScoreLevel(score) {
  if (score < 50) return "critical";
  if (score < 60) return "high";
  if (score < 70) return "medium";
  return "low";
}

export function getScoreLabel(score) {
  return scoreLabels[getScoreLevel(score)];
}

export function countFindings(summary) {
  return summary.critical + summary.high + summary.medium + summary.low;
}
