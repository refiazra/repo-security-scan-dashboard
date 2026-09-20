import { getScoreLevel } from "../utils/calculateScore.js";

export default function ScoreBadge({ score }) {
  if (score === undefined) {
    return <span className="score">—</span>;
  }
  return <span className={"score score-" + getScoreLevel(score)}>{score}</span>;
}
