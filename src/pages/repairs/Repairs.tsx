import "./Repairs.css";

import { useState } from "react";
import { Link } from "react-router-dom";

import DashboardLayout from "../../layouts/DashboardLayout";
import { useBranches } from "../../hooks/useBranches";
import { useRepairs } from "../../hooks/useRepairs";
import RepairsTable from "./RepairsTable";

function Repairs() {
    const [branchId, setBranchId] = useState("");
    const {
        data: repairs = [],
        isLoading,
        error,
    } = useRepairs(branchId);
    const {
        data: branches = [],
    } = useBranches();

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

                <section className="branch-filter-bar">
                    <label>
                        <span>Branch</span>
                        <select
                            value={branchId}
                            onChange={(event) => setBranchId(event.target.value)}
                        >
                            <option value="">All branches</option>
                            {branches.map((branch) => (
                                <option key={branch.id} value={branch.id}>
                                    {branch.name}
                                </option>
                            ))}
                        </select>
                    </label>
                    <p>
                        {branchId
                            ? "Showing repair work for the selected branch."
                            : "Showing repair work across every branch."}
                    </p>
                </section>

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
