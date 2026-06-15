import "./Repairs.css";

import DashboardLayout from "../../layouts/DashboardLayout";
import Topbar from "../../components/dashboard/Topbar";
import SearchBar from "../../components/dashboard/SearchBar";
import RepairsTable from "./RepairsTable";

import { Link } from "react-router-dom";

function Repairs() {

    return (

        <DashboardLayout>

            <Topbar />

            <main className="repairs-page">

                <div className="repairs-header">

                    <h2>Repairs</h2>

                    <Link
                        to="/repairs/new"
                        className="new-repair-btn"
                    >
                        + New Repair
                    </Link>

                </div>

                <SearchBar
                    placeholder="Search repairs..."
                />

                <RepairsTable />

            </main>

        </DashboardLayout>

    );

}

export default Repairs;