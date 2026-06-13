import "./Repairs.css";

import DashboardLayout from "../../layouts/DashboardLayout";
import Topbar from "../../components/dashboard/Topbar";
import RepairsTable from "./RepairsTable";
import SearchBar from "../../components/dashboard/SearchBar";

function Repairs() {

    return (

        <DashboardLayout>

            <Topbar />

            <main className="repairs-page">

                <div className="repairs-header">

                    <h2>Repairs</h2>

                    <button className="new-repair-btn">

                        + New Repair

                    </button>

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