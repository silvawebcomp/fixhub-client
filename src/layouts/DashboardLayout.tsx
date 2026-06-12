import "./DashboardLayout.css";
import Sidebar from "../components/dashboard/Sidebar";
import type { ReactNode } from "react";

type DashboardLayoutProps = {
    children: ReactNode;
};

function DashboardLayout({
    children,
}: DashboardLayoutProps) {

    return (

        <div className="dashboard-layout">

            <Sidebar />

            <main className="dashboard-content">

                {children}

            </main>

        </div>

    );

}

export default DashboardLayout;