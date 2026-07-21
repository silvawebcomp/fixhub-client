function Features() {
  const modules = [
    {
      title: "Repair command center",
      detail:
        "Create repair tickets, assign jobs, track diagnosis, record estimates, upload job notes, and move each device through a clear service timeline.",
      meta: "Tickets, statuses, technicians",
    },
    {
      title: "Customer workspace",
      detail:
        "Keep names, phone numbers, devices, repair history, balances, and follow-up details connected to every job so service never feels scattered.",
      meta: "Profiles, history, contact records",
    },
    {
      title: "Inventory control",
      detail:
        "Know what parts are available, where they are stored, when stock is low, and how parts affect repair cost and profit.",
      meta: "SKU, supplier, branch stock",
    },
    {
      title: "Invoices and payments",
      detail:
        "Turn a repair into a clean invoice, separate labour from parts, track deposits, discounts, tax, outstanding balances, and paid jobs.",
      meta: "Bills, receipts, balances",
    },
    {
      title: "Branch operations",
      detail:
        "Run one shop or prepare for multiple service locations with branch filters, default locations, and branch-aware repair and stock views.",
      meta: "Locations, counters, teams",
    },
    {
      title: "Team permissions",
      detail:
        "Separate owner, admin, technician, and front desk responsibilities so each person sees the right tools for their daily work.",
      meta: "Roles, access, accountability",
    },
  ];

  return (
    <section className="features" id="product">
      <div className="section-header">
        <p>Product modules</p>
        <h2>Everything a serious repair business needs to run the day.</h2>
        <span>
          FixHub V1 keeps the workflow familiar for small shops, while giving
          growing teams the structure investors and subscribers expect.
        </span>
      </div>

      <div className="feature-grid">
        {modules.map((module) => (
          <article className="card feature-card" key={module.title}>
            <span>{module.meta}</span>
            <h3>{module.title}</h3>
            <p>{module.detail}</p>
          </article>
        ))}
      </div>
    </section>
  )
}

export default Features
