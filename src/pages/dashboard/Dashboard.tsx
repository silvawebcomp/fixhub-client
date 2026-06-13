import "./Dashboard.css";

import DashboardLayout from "../../layouts/DashboardLayout";

import StatCard from "../../components/dashboard/StatCard";
import QuickActions from "../../components/dashboard/QuickActions";
import RecentRepairs from "../../components/dashboard/RecentRepairs";
import Topbar from "../../components/dashboard/Topbar";

import { dashboardStats } from "../../data/dashboard";

function Dashboard() {
    return (
        <DashboardLayout>

            <Topbar />

            <div className="stats-grid">

                {dashboardStats.map((stat) => (

                    <StatCard
                        key={stat.id}
                        title={stat.title}
                        value={stat.value}
                    />

                ))}

            </div>

            <QuickActions />

            <RecentRepairs />

        </DashboardLayout>
    );
}

export default Dashboard;