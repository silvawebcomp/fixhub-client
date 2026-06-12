import "./Sidebar.css";

function Sidebar() {
    return (
        <aside className="sidebar">

            <h2 className="logo">
                FIXHUB
            </h2>

            <nav>

                <a href="/dashboard">
                    Dashboard
                </a>

                <a href="/repairs/new">
                    Repairs
                </a>

                <a href="/customers">
                    Customers
                </a>

                <a href="/settings">
                    Settings
                </a>

            </nav>

        </aside>
    );
}

export default Sidebar;
