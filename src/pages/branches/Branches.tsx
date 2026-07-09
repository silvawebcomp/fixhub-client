import "./Branches.css";

import { useEffect, useState } from "react";

import DashboardLayout from "../../layouts/DashboardLayout";
import {
    createBranch,
    deleteBranch,
    getBranches,
    updateBranch,
} from "../../services/branchService";
import type { Branch } from "../../types/branch";

const EMPTY_FORM = {
    name: "",
    address: "",
    phone: "",
    managerName: "",
    isDefault: false,
};

function Branches() {
    const [branches, setBranches] = useState<Branch[]>([]);
    const [form, setForm] = useState(EMPTY_FORM);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    async function loadBranches() {
        setError("");

        try {
            const data = await getBranches();
            setBranches(data);
        } catch (requestError) {
            setError(
                requestError instanceof Error
                    ? requestError.message
                    : "Unable to load branches."
            );
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        let active = true;

        getBranches()
            .then((data) => {
                if (active) {
                    setBranches(data);
                }
            })
            .catch((requestError) => {
                if (active) {
                    setError(
                        requestError instanceof Error
                            ? requestError.message
                            : "Unable to load branches."
                    );
                }
            })
            .finally(() => {
                if (active) {
                    setLoading(false);
                }
            });

        return () => {
            active = false;
        };
    }, []);

    function resetForm() {
        setForm(EMPTY_FORM);
        setEditingId(null);
    }

    function startEdit(branch: Branch) {
        setEditingId(branch.id);
        setForm({
            name: branch.name,
            address: branch.address ?? "",
            phone: branch.phone ?? "",
            managerName: branch.managerName ?? "",
            isDefault: branch.isDefault,
        });
    }

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setSaving(true);
        setError("");
        setSuccess("");

        try {
            if (editingId) {
                await updateBranch(editingId, form);
                setSuccess("Branch updated.");
            } else {
                await createBranch(form);
                setSuccess("Branch created.");
            }

            resetForm();
            await loadBranches();
        } catch (requestError) {
            setError(
                requestError instanceof Error
                    ? requestError.message
                    : "Unable to save branch."
            );
        } finally {
            setSaving(false);
        }
    }

    async function handleDelete(branch: Branch) {
        const confirmed = window.confirm(`Delete ${branch.name}?`);

        if (!confirmed) {
            return;
        }

        setError("");
        setSuccess("");

        try {
            await deleteBranch(branch.id);
            setSuccess("Branch deleted.");
            await loadBranches();
        } catch (requestError) {
            setError(
                requestError instanceof Error
                    ? requestError.message
                    : "Unable to delete branch."
            );
        }
    }

    return (
        <DashboardLayout>
            <main className="branches-page">
                <header className="branches-header">
                    <div>
                        <p className="eyebrow">Multi-shop</p>
                        <h1>Branches</h1>
                        <p>Manage locations used by repair tickets and inventory stock.</p>
                    </div>
                </header>

                {error && <p className="form-error">{error}</p>}
                {success && <p className="form-success">{success}</p>}

                <section className="branches-grid">
                    <form className="branch-form" onSubmit={handleSubmit}>
                        <div className="panel-heading">
                            <h2>{editingId ? "Edit branch" : "Add branch"}</h2>
                            <p>Use branches for locations, counters, or service centers.</p>
                        </div>

                        <label>
                            Branch name
                            <input
                                value={form.name}
                                onChange={(event) =>
                                    setForm({ ...form, name: event.target.value })
                                }
                                placeholder="Main Branch"
                                required
                            />
                        </label>

                        <label>
                            Address
                            <input
                                value={form.address}
                                onChange={(event) =>
                                    setForm({ ...form, address: event.target.value })
                                }
                                placeholder="Shop address"
                            />
                        </label>

                        <div className="branch-form-row">
                            <label>
                                Phone
                                <input
                                    value={form.phone}
                                    onChange={(event) =>
                                        setForm({ ...form, phone: event.target.value })
                                    }
                                    placeholder="Branch phone"
                                />
                            </label>

                            <label>
                                Manager
                                <input
                                    value={form.managerName}
                                    onChange={(event) =>
                                        setForm({
                                            ...form,
                                            managerName: event.target.value,
                                        })
                                    }
                                    placeholder="Manager name"
                                />
                            </label>
                        </div>

                        <label className="checkbox-field">
                            <input
                                type="checkbox"
                                checked={form.isDefault}
                                onChange={(event) =>
                                    setForm({ ...form, isDefault: event.target.checked })
                                }
                            />
                            Make this the default branch
                        </label>

                        <div className="branch-form-actions">
                            <button className="primary-action" disabled={saving}>
                                {saving ? "Saving..." : editingId ? "Save branch" : "Add branch"}
                            </button>
                            {editingId && (
                                <button
                                    type="button"
                                    className="secondary-action"
                                    onClick={resetForm}
                                >
                                    Cancel
                                </button>
                            )}
                        </div>
                    </form>

                    <section className="branches-table">
                        {loading ? (
                            <p className="loading-state">Loading branches...</p>
                        ) : branches.length === 0 ? (
                            <p className="empty-state">No branches yet.</p>
                        ) : (
                            <table>
                                <thead>
                                    <tr>
                                        <th>Branch</th>
                                        <th>Contact</th>
                                        <th>Address</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {branches.map((branch) => (
                                        <tr key={branch.id}>
                                            <td>
                                                <strong>{branch.name}</strong>
                                                {branch.isDefault && <span>Default</span>}
                                            </td>
                                            <td>
                                                {branch.managerName || branch.phone ? (
                                                    <>
                                                        <strong>{branch.managerName || "-"}</strong>
                                                        <small>{branch.phone || "No phone"}</small>
                                                    </>
                                                ) : (
                                                    "-"
                                                )}
                                            </td>
                                            <td>{branch.address || "-"}</td>
                                            <td>
                                                <div className="branch-actions">
                                                    <button
                                                        className="secondary-action"
                                                        onClick={() => startEdit(branch)}
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        className="danger-button"
                                                        onClick={() => void handleDelete(branch)}
                                                        disabled={branch.isDefault}
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </section>
                </section>
            </main>
        </DashboardLayout>
    );
}

export default Branches;

