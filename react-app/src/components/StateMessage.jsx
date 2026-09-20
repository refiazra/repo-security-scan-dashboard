export default function StateMessage({ type, title, text }) {
  if (type === "loading") {
    return (
      <p className="state-message" role="status">
        <span className="loading-dot" aria-hidden="true"></span>
        Loading...
      </p>
    );
  }

  return (
    <div className={type === "error" ? "state-message state-error" : "state-message"} role={type === "error" ? "alert" : undefined}>
      <strong>{title}</strong>
      {text}
    </div>
  );
}
