import { getScoreLevel, getScoreLabel } from "../utils/calculateScore.js";

export default function SecurityScore({ score }) {
  return (
    <section className={"score-panel level-" + getScoreLevel(score)}>
      <h2>Security score</h2>
      <p className="score-value">
        <strong>{score}</strong> / 100
      </p>
      <p className="score-label">{getScoreLabel(score)}</p>
    </section>
  );
}
