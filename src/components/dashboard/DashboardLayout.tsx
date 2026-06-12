import "./DashboardLayout.css";

type DashboardLayoutProps = {
  children: React.ReactNode;
};

function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="dashboard-layout">
      <aside className="sidebar">
        <h2>FixHub</h2>

        <nav>
          <a href="#">Dashboard</a>
          <a href="#">Repairs</a>
          <a href="#">Customers</a>
          <a href="#">Inventory</a>
          <a href="#">Settings</a>
        </nav>
      </aside>

      <main className="dashboard-content">
        {children}
      </main>
    </div>
  );
}

export default DashboardLayout;