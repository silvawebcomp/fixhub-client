import "./Topbar.css";

function Topbar() {
  return (
    <header className="topbar">

      <h2>Dashboard</h2>

      <div className="topbar-user">

        <button>
          🔔
        </button>

        <span>Sam</span>

      </div>

    </header>
  );
}

export default Topbar;