function Testimonials() {
  const trustSignals = [
    {
      title: "For owners",
      detail:
        "See queue pressure, revenue movement, unpaid balances, low stock, branch activity, and team workload without opening five different spreadsheets.",
    },
    {
      title: "For technicians",
      detail:
        "Work from a clean job list with device details, diagnosis notes, assigned parts, customer decisions, and repair status in one place.",
    },
    {
      title: "For customers",
      detail:
        "Track repair progress from a simple public page instead of calling the shop repeatedly to ask what changed.",
    },
  ];

  return (
    <section className="testimonials" id="operations">
      <div className="section-header">
        <p>Operator confidence</p>
        <h2>Built to look credible to customers, subscribers, and investors.</h2>
        <span>
          The interface makes the business feel organized from the outside and
          measurable from the inside.
        </span>
      </div>

      <div className="ops-showcase">
        <div className="ops-board">
          <div className="ops-board-header">
            <span>Executive view</span>
            <strong>Service desk health</strong>
          </div>
          <div className="ops-meter">
            <span style={{ width: "74%" }} />
          </div>
          <div className="ops-grid">
            <div>
              <small>Pending approvals</small>
              <strong>5</strong>
            </div>
            <div>
              <small>Parts below reorder</small>
              <strong>3</strong>
            </div>
            <div>
              <small>Unpaid invoices</small>
              <strong>NGN 420K</strong>
            </div>
            <div>
              <small>Ready devices</small>
              <strong>9</strong>
            </div>
          </div>
        </div>

        <div className="customer-card">
          <span>Customer portal preview</span>
          <h3>Repair FH-1034</h3>
          <p>Screen replacement is complete. Device is ready for pickup.</p>
          <div className="portal-status">
            <i className="done" />
            <i className="done" />
            <i className="done" />
            <i />
          </div>
        </div>
      </div>

      <div className="trust-grid">
        {trustSignals.map((signal) => (
          <article className="testimonial-card" key={signal.title}>
            <h3>{signal.title}</h3>
            <p>{signal.detail}</p>
          </article>
        ))}
      </div>
    </section>
  )
}

export default Testimonials
