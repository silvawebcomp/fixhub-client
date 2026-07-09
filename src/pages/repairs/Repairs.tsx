import "./Repairs.css";

import DashboardLayout from "../../layouts/DashboardLayout";
import RepairsTable from "./RepairsTable";
import { useRepairs } from "../../hooks/useRepairs";

import { Link } from "react-router-dom";

function Repairs() {
    const {
        data: repairs = [],
        isLoading,
        error,
    } = useRepairs();

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

                {isLoading ? (
                    <p className="loading-state">
                        Loading repair queue...
                    </p>
                ) : error ? (
                    <p className="form-error">
                        Unable to load repairs.
                    </p>
                ) : (
                    <RepairsTable
                        repairs={repairs}
                    />
                )}

            </main>

        </DashboardLayout>

    );

}

export default Repairs;

