import "./Dashboard.css";

import DashboardLayout from "../../components/dashboard/DashboardLayout";
import Topbar from "../../components/dashboard/Topbar";
import StatCard from "../../components/dashboard/StatCard";
import RecentRepairs from "../../components/dashboard/RecentRepairs";
import QuickActions from "../../components/dashboard/QuickActions";

function Dashboard() {
    return (
        <DashboardLayout>

            <Topbar />

            <div className="stats-grid">

                <StatCard
                    title="Active Repairs"
                    value="128"
                />

                <StatCard
                    title="Completed"
                    value="96"
                />

                <StatCard
                    title="Customers"
                    value="245"
                />

                <StatCard
                    title="Revenue"
                    value="$12.4K"
                />

            </div>

            <RecentRepairs />

            <QuickActions />

        </DashboardLayout>
    );
}

export default Dashboard;