function Stats() {
  const workflow = [
    "Customer intake",
    "Device diagnosis",
    "Estimate approval",
    "Parts allocation",
    "Repair updates",
    "Invoice settlement",
    "Pickup and history",
  ];

  const signals = [
    { value: "7", label: "Connected shop workflows" },
    { value: "4", label: "Operational roles for V1 teams" },
    { value: "1", label: "Customer tracking page per ticket" },
    { value: "Live", label: "Queue, branch, stock, and invoice visibility" },
  ];

  return (
    <section className="stats" id="workflow">
      <div className="stats-intro">
        <p>Repair workflow</p>
        <h2>From walk-in request to paid collection, every step stays visible.</h2>
      </div>

      <div className="workflow-rail" aria-label="FixHub repair workflow">
        {workflow.map((step, index) => (
          <div className="workflow-step" key={step}>
            <span>{String(index + 1).padStart(2, "0")}</span>
            <strong>{step}</strong>
          </div>
        ))}
      </div>

      <div className="stat-grid">
        {signals.map((signal) => (
          <div className="stat-card" key={signal.label}>
            <h3>{signal.value}</h3>
            <p>{signal.label}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

export default Stats
