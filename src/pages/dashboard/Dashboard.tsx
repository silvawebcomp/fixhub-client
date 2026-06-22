import "./Dashboard.css";

import { useEffect, useState } from "react";

import DashboardLayout from "../../layouts/DashboardLayout";

import StatCard from "../../components/dashboard/StatCard";
import QuickActions from "../../components/dashboard/QuickActions";
import RecentRepairs from "../../components/dashboard/RecentRepairs";

import {

    getDashboardStats,

    type DashboardStats,

} from "../../services/dashboardService";

function Dashboard() {

    const [

        stats,

        setStats,

    ] = useState<DashboardStats>({

        totalRepairs: 0,

        activeRepairs: 0,

        customers: 0,

        inventoryItems: 0,

    });

    useEffect(() => {

        async function loadDashboard() {

            try {

                const data = await getDashboardStats();

                setStats(data);

            } catch (error) {

                console.error(error);

            }

        }

        loadDashboard();

    }, []);

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

                </section>

                <QuickActions />

                <RecentRepairs />

            </section>

        </DashboardLayout>

    );

}

export default Dashboard;