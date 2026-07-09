import "./Dashboard.css";

import DashboardLayout from "../../layouts/DashboardLayout";

import StatCard from "../../components/dashboard/StatCard";
import QuickActions from "../../components/dashboard/QuickActions";
import RecentRepairs from "../../components/dashboard/RecentRepairs";

import { useDashboard } from "../../hooks/useDashboard";

function money(value: number) {
    return `NGN ${value.toLocaleString()}`;
}

function Dashboard() {
    const {
        data: stats,
        isLoading,
        error,
    } = useDashboard();

    if (isLoading) {
        return (
            <DashboardLayout>
                <section className="dashboard-page">
                    Loading dashboard...
                </section>
            </DashboardLayout>
        );
    }

    if (error || !stats) {
        return (
            <DashboardLayout>
                <section className="dashboard-page">
                    Failed to load dashboard.
                </section>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <section className="dashboard-page">
                <section className="stats-grid">
                    <StatCard
                        title="Total Repairs"
                        value={stats.totalRepairs}
                    />

                    <StatCard
                        title="Active Repairs"
                        value={stats.activeRepairs}
                    />

                    <StatCard
                        title="Customers"
                        value={stats.customers}
                    />

                    <StatCard
                        title="Inventory"
                        value={stats.inventoryItems}
                    />

                    <StatCard
                        title="Invoice Revenue"
                        value={money(stats.invoiceRevenue)}
                    />

                    <StatCard
                        title="Outstanding"
                        value={money(stats.outstandingBalance)}
                    />
                </section>

                <QuickActions />

                <RecentRepairs />
            </section>
        </DashboardLayout>
    );
}

export default Dashboard;