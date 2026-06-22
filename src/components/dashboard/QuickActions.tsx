import "./QuickActions.css";

import { Link } from "react-router-dom";

function QuickActions() {
    return (

        <section className="quick-actions">

            <h2>Quick Actions</h2>

            <Link to="/repairs/new">New Repair</Link>

            <Link to="/customers/new">Add Customer</Link>

            <Link to="/inventory/new">Add Inventory</Link>

        </section>

    );
}

export default QuickActions;
