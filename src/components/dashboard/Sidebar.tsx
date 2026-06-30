import "./Sidebar.css";
import { NavLink } from "react-router-dom";

function Sidebar() {
    return (
        <aside className="sidebar">

            <h2 className="logo">
                FIXHUB
            </h2>

            <nav>

                <NavLink to="/dashboard">
                    Dashboard
                </NavLink>

                <NavLink to="/repairs">
                    Repairs
                </NavLink>

                <NavLink to="/customers">
                    Customers
                </NavLink>

                <NavLink to="/inventory">
                    Inventory
                </NavLink>

                <NavLink to="/invoices">
                    Invoices
                </NavLink>

                <NavLink to="/communications">
                    Communications
                </NavLink>

                <NavLink to="/analytics">
                    Insights
                </NavLink>

            </nav>

        </aside>
    );
}

export default Sidebar;
