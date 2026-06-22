import "./DashboardLayout.css";

import type { ReactNode } from "react";

import Sidebar from "../components/dashboard/Sidebar";
import Topbar from "../components/dashboard/Topbar";

type DashboardLayoutProps = {

    children: ReactNode;

};

function DashboardLayout({

    children,

}: DashboardLayoutProps) {

    return (

        <div className="dashboard-layout">

            <Sidebar />

            <div className="dashboard-content">

                <Topbar />

                <main className="dashboard-main">

                    {children}

                </main>

            </div>

        </div>

    );

}

export default DashboardLayout;