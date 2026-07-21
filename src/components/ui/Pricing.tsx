import { useNavigate } from "react-router-dom";

function Pricing() {
  const navigate = useNavigate();

  const plans = [
    {
      name: "Starter",
      price: "Free",
      description: "For a single repair desk getting organized quickly.",
      features: [
        "Repair and customer records",
        "Basic inventory tracking",
        "Invoices and payment status",
        "Public repair tracking",
      ],
      action: "Start Free",
    },
    {
      name: "Growth",
      price: "Scale-ready",
      description: "For shops preparing for more staff, stock, and daily volume.",
      features: [
        "Branch-aware operations",
        "Team roles and permissions",
        "Inventory reorder visibility",
        "Operational dashboard signals",
      ],
      action: "Create Workspace",
    },
    {
      name: "Multi-branch",
      price: "Expansion",
      description: "For repair brands that need stronger control across locations.",
      features: [
        "Location-based queue filters",
        "Centralized customer history",
        "Finance and stock oversight",
        "Investor-ready reporting foundation",
      ],
      action: "Prepare Launch",
    },
  ];

  return (
    <section className="pricing" id="pricing">
      <div className="section-header">
        <p>V1 access</p>
        <h2>Simple enough for first-time users. Strong enough for a real business.</h2>
        <span>
          Launch with the workflows people understand first, then expand into
          branch control, automation, and reporting as usage grows.
        </span>
      </div>

      <div className="pricing-grid">
        {plans.map((plan) => (
          <article className="pricing-card" key={plan.name}>
            <h3>{plan.name}</h3>
            <h4>{plan.price}</h4>
            <p>{plan.description}</p>

            <ul>
              {plan.features.map((feature) => (
                <li key={feature}>{feature}</li>
              ))}
            </ul>

            <button onClick={() => navigate("/register")}>{plan.action}</button>
          </article>
        ))}
      </div>
    </section>
  );
}

export default Pricing;
