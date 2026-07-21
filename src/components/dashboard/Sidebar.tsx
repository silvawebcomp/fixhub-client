import "./Sidebar.css";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

const FEEDBACK_ROLES = new Set([
    "Owner",
    "Admin",
    "Manager",
]);

function Sidebar() {
    const { user } = useAuth();
    const canReviewFeedback = user?.role
        ? FEEDBACK_ROLES.has(user.role)
        : true;

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

                <NavLink to="/branches">
                    Branches
                </NavLink>

                <NavLink to="/team">
                    Team
                </NavLink>

                {canReviewFeedback && (
                    <NavLink to="/feedback">
                        Feedback
                    </NavLink>
                )}

            </nav>

        </aside>
    );
}

export default Sidebar;


