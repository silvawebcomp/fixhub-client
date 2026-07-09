import "./NewRepair.css";

import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import DashboardLayout from "../../layouts/DashboardLayout";
import { getBranches } from "../../services/branchService";
import { getCustomers } from "../../services/customerService";
import { createRepair } from "../../services/repairService";
import type { Branch } from "../../types/branch";
import type { Customer } from "../../types/customer";
import type { RepairPayload } from "../../types/repair";
import RepairForm from "./RepairForm";

const INITIAL_REPAIR: RepairPayload = {
    customer: "",
    customerPhone: "",
    customerEmail: "",
    device: "",
    deviceBrand: "",
    deviceModel: "",
    serialNumber: "",
    issue: "",
    status: "Received",
    priority: "Normal",
    assignedTechnician: "",
    estimatedCost: "",
    finalCost: "",
    dueDate: "",
    notes: "",
    branchId: "",
};

function NewRepair() {
    const navigate = useNavigate();
    const [values, setValues] = useState<RepairPayload>(INITIAL_REPAIR);
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [branches, setBranches] = useState<Branch[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        Promise.all([getCustomers(), getBranches()])
            .then(([customerData, branchData]) => {
                setCustomers(customerData);
                setBranches(branchData);
            })
            .catch(console.error);
    }, []);

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setLoading(true);
        setError("");

        try {
            const repair = await createRepair(values);
            navigate(`/repairs/${repair.id}`);
        } catch (requestError) {
            setError(
                requestError instanceof Error
                    ? requestError.message
                    : "Unable to save repair."
            );
        } finally {
            setLoading(false);
        }
    }

    return (
        <DashboardLayout>
            <main className="repair-editor-page">
                <header className="repair-editor-header">
                    <div>
                        <p className="eyebrow">Repair intake</p>
                        <h1>New repair ticket</h1>
                        <p>Capture the job once, then move it through the full workflow.</p>
                    </div>
                    <Link className="secondary-action" to="/repairs">
                        Back to repairs
                    </Link>
                </header>

                {error && <p className="form-error">{error}</p>}

                <RepairForm
                    values={values}
                    customers={customers}
                    branches={branches}
                    loading={loading}
                    submitLabel="Create repair ticket"
                    onChange={setValues}
                    onSubmit={handleSubmit}
                />
            </main>
        </DashboardLayout>
    );
}

export default NewRepair;
