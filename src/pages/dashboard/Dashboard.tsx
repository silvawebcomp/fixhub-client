import "./Dashboard.css";

import DashboardLayout from "../../layouts/DashboardLayout";

import Topbar from "../../components/dashboard/Topbar";
import StatCard from "../../components/dashboard/StatCard";
import QuickActions from "../../components/dashboard/QuickActions";
import RecentRepairs from "../../components/dashboard/RecentRepairs";

import { dashboardStats } from "../../data/dashboard";

function Dashboard() {

    return (

        <DashboardLayout>

            <main className="dashboard-page">

                <Topbar />

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

            </main>

        </DashboardLayout>

    );

}

export default Dashboard;