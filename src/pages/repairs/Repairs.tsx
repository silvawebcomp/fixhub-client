import "./Repairs.css";

import DashboardLayout from "../../layouts/DashboardLayout";
import RepairsTable from "./RepairsTable";

import { Link } from "react-router-dom";

function Repairs() {

    return (

        <DashboardLayout>

            <main className="repairs-page">

                <div className="repairs-header">

                    <div>
                        <p className="eyebrow">Operations</p>
                        <h2>Repair queue</h2>
                        <p>Track every job from intake through collection.</p>
                    </div>

                    <Link
                        to="/repairs/new"
                        className="new-repair-btn"
                    >
                        New repair
                    </Link>

                </div>

                <RepairsTable />

            </main>

        </DashboardLayout>

    );

}

export default Repairs;
