import { useNavigate } from "react-router-dom";

function Pricing() {
  const navigate = useNavigate();

  return (
    <section className="pricing">
      <h2>Simple Pricing</h2>

      <div className="pricing-card">
        <h3>Starter</h3>
        <h1>Free</h1>
        <p>Perfect for new repair businesses.</p>

        <button onClick={() => navigate("/register")}>Start Free</button>
      </div>
    </section>
  )
}

export default Pricing
