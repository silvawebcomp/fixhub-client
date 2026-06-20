import "./Dashboard.css";

import DashboardLayout from "../../layouts/DashboardLayout";

import StatCard from "../../components/dashboard/StatCard";
import QuickActions from "../../components/dashboard/QuickActions";
import RecentRepairs from "../../components/dashboard/RecentRepairs";

import { dashboardStats } from "../../data/dashboard";

function Dashboard() {

    return (

        <DashboardLayout>

            <section className="dashboard-page">

                <section className="stats-grid">

                    {dashboardStats.map((stat, index) => (

                        <StatCard

                            key={index}

                            title={stat.title}

                            value={stat.value}

                        />

                    ))}

                </section>

                <QuickActions />

                <RecentRepairs />

            </section>

        </DashboardLayout>

    );

}

export default Dashboard;