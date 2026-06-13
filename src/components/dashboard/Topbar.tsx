import "./Topbar.css";

function Topbar() {
    return (
        <header className="topbar">

            <div>

                <h1>Welcome back, Sam 👋</h1>

                <p>
                    Manage repairs, customers and your business from one place.
                </p>

            </div>

            <div className="topbar-user">

                <button className="notification-btn">
                    🔔
                </button>

                <div className="user-profile">

                    <div className="avatar">
                        S
                    </div>

                    <span>Sam</span>

                </div>

            </div>

        </header>
    );
}

export default Topbar;