import "./NewRepair.css";
import "./RepairDetails.css";

import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import DashboardLayout from "../../layouts/DashboardLayout";
import { getBranches } from "../../services/branchService";
import { getCustomers } from "../../services/customerService";
import {
    deleteRepair,
    getRepair,
    updateRepair,
} from "../../services/repairService";
import type { Branch } from "../../types/branch";
import type { Customer } from "../../types/customer";
import type { Repair, RepairPayload } from "../../types/repair";
import RepairCommunicationPanel from "./RepairCommunicationPanel";
import RepairForm from "./RepairForm";

function toFormValues(repair: Repair): RepairPayload {
    return {
        customer: repair.customer,
        customerPhone: repair.customerPhone ?? "",
        customerEmail: repair.customerEmail ?? "",
        device: repair.device,
        deviceBrand: repair.deviceBrand ?? "",
        deviceModel: repair.deviceModel ?? "",
        serialNumber: repair.serialNumber ?? "",
        issue: repair.issue ?? "",
        status: repair.status,
        priority: repair.priority,
        assignedTechnician: repair.assignedTechnician ?? "",
        estimatedCost: repair.estimatedCost?.toString() ?? "",
        finalCost: repair.finalCost?.toString() ?? "",
        dueDate: repair.dueDate?.slice(0, 10) ?? "",
        notes: repair.notes ?? "",
        branchId: repair.branchId?.toString() ?? "",
        statusNote: "",
    };
}

function RepairDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const repairId = Number(id);
    const [repair, setRepair] = useState<Repair | null>(null);
    const [values, setValues] = useState<RepairPayload | null>(null);
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [branches, setBranches] = useState<Branch[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [linkCopied, setLinkCopied] = useState(false);

    useEffect(() => {
        Promise.all([getRepair(repairId), getCustomers(), getBranches()])
            .then(([repairData, customerData, branchData]) => {
                setRepair(repairData);
                setValues(toFormValues(repairData));
                setCustomers(customerData);
                setBranches(branchData);
            })
            .catch((requestError) => {
                setError(
                    requestError instanceof Error
                        ? requestError.message
                        : "Unable to load repair."
                );
            })
            .finally(() => setLoading(false));
    }, [repairId]);

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (!values) {
            return;
        }

        setSaving(true);
        setError("");
        setSuccess("");

        try {
            const updated = await updateRepair(repairId, values);
            setRepair(updated);
            setValues(toFormValues(updated));
            setSuccess("Repair ticket updated.");
        } catch (requestError) {
            setError(
                requestError instanceof Error
                    ? requestError.message
                    : "Unable to update repair."
            );
        } finally {
            setSaving(false);
        }
    }

    async function handleDelete() {
        if (!window.confirm("Permanently delete this repair ticket?")) {
            return;
        }

        try {
            await deleteRepair(repairId);
            navigate("/repairs");
        } catch (requestError) {
            setError(
                requestError instanceof Error
                    ? requestError.message
                    : "Unable to delete repair."
            );
        }
    }

    async function handleCopyTrackingLink() {
        const ticketNumber = repair?.ticketNumber;

        if (!ticketNumber) {
            return;
        }

        const url = `${window.location.origin}/track?ticket=${encodeURIComponent(
            ticketNumber
        )}`;

        try {
            await navigator.clipboard.writeText(url);
            setLinkCopied(true);
            window.setTimeout(() => setLinkCopied(false), 2000);
        } catch {
            setError("Unable to copy the tracking link.");
        }
    }

    if (loading) {
        return (
            <DashboardLayout>
                <p className="loading-state">Loading repair ticket...</p>
            </DashboardLayout>
        );
    }

    if (!repair || !values) {
        return (
            <DashboardLayout>
                <div className="empty-state">
                    <p>{error || "Repair ticket not found."}</p>
                    <Link to="/repairs">Return to repairs</Link>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <main className="repair-editor-page">
                <header className="repair-editor-header">
                    <div>
                        <p className="eyebrow">{repair.ticketNumber || `Repair #${repair.id}`}</p>
                        <h1>{repair.device}</h1>
                        <p>
                            {repair.customer} - {repair.branch?.name ?? "Default branch"} - Opened{" "}
                            {new Date(repair.createdAt).toLocaleDateString()}
                        </p>
                    </div>
                    <div className="header-actions">
                        <Link className="secondary-action" to="/repairs">
                            Back to repairs
                        </Link>
                        <Link
                            className="secondary-action"
                            to={`/invoices/new?repairId=${repair.id}`}
                        >
                            Create invoice
                        </Link>
                        <button className="danger-button" onClick={handleDelete}>
                            Delete
                        </button>
                    </div>
                </header>

                <section className="ticket-overview">
                    <div>
                        <span>Branch</span>
                        <strong>{repair.branch?.name ?? "Default"}</strong>
                    </div>
                    <div>
                        <span>Status</span>
                        <strong className={`status status-${repair.status.toLowerCase().replaceAll(" ", "-")}`}>
                            {repair.status}
                        </strong>
                    </div>
                    <div>
                        <span>Priority</span>
                        <strong>{repair.priority}</strong>
                    </div>
                    <div>
                        <span>Due date</span>
                        <strong>
                            {repair.dueDate
                                ? new Date(repair.dueDate).toLocaleDateString()
                                : "Not set"}
                        </strong>
                    </div>
                    <div>
                        <span>Technician</span>
                        <strong>{repair.assignedTechnician || "Unassigned"}</strong>
                    </div>
                </section>

                <section className="customer-tracking-share">
                    <div>
                        <span>Customer tracking</span>
                        <strong>Share a secure progress link</strong>
                        <p>
                            The customer will verify with the phone number or email
                            saved on this ticket.
                        </p>
                    </div>
                    <button
                        className="secondary-action"
                        type="button"
                        onClick={handleCopyTrackingLink}
                        disabled={!repair.ticketNumber}
                    >
                        {linkCopied ? "Link copied" : "Copy tracking link"}
                    </button>
                </section>

                {error && <p className="form-error">{error}</p>}
                {success && <p className="form-success">{success}</p>}

                <div className="repair-detail-grid">
                    <RepairForm
                        values={values}
                        customers={customers}
                        branches={branches}
                        loading={saving}
                        submitLabel="Save changes"
                        showStatusNote
                        onChange={setValues}
                        onSubmit={handleSubmit}
                    />

                    <aside className="repair-side-column">
                        <section className="status-timeline">
                            <div className="form-section-heading">
                                <h2>Status timeline</h2>
                                <p>Every workflow change is recorded here.</p>
                            </div>
                            <ol>
                                {repair.statusHistory?.map((entry) => (
                                    <li key={entry.id}>
                                        <span className="timeline-marker" />
                                        <div>
                                            <strong>{entry.status}</strong>
                                            <time>
                                                {new Date(entry.createdAt).toLocaleString()}
                                            </time>
                                            {entry.note && <p>{entry.note}</p>}
                                        </div>
                                    </li>
                                ))}
                            </ol>
                        </section>

                        <RepairCommunicationPanel repair={repair} />
                    </aside>
                </div>
            </main>
        </DashboardLayout>
    );
}

export default RepairDetails;
