import "./RecentRepairs.css";

function RecentRepairs() {
  return (
    <section className="recent-repairs">

      <h2>Recent Repairs</h2>

      <div className="repair-item">
        <h3>Samsung A16</h3>
        <span>In Progress</span>
      </div>

      <div className="repair-item">
        <h3>HP EliteBook</h3>
        <span>Completed</span>
      </div>

      <div className="repair-item">
        <h3>Apple Watch</h3>
        <span>Waiting Parts</span>
      </div>

    </section>
  );
}

export default RecentRepairs;