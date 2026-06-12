import "./StatCard.css";

type StatCardProps = {
  title: string;
  value: string;
};

function StatCard({ title, value }: StatCardProps) {
  return (
    <div className="stat-card">
      <h3>{value}</h3>
      <p>{title}</p>
    </div>
  );
}

export default StatCard;