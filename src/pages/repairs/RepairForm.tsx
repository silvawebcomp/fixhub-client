import type { Customer } from "../../types/customer";
import {
    REPAIR_PRIORITIES,
    REPAIR_STATUSES,
    type RepairPayload,
} from "../../types/repair";

type RepairFormProps = {
    values: RepairPayload;
    customers: Customer[];
    loading: boolean;
    submitLabel: string;
    showStatusNote?: boolean;
    onChange: (values: RepairPayload) => void;
    onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
};

function RepairForm({
    values,
    customers,
    loading,
    submitLabel,
    showStatusNote = false,
    onChange,
    onSubmit,
}: RepairFormProps) {
    function setField<K extends keyof RepairPayload>(
        field: K,
        value: RepairPayload[K]
    ) {
        onChange({ ...values, [field]: value });
    }

    function selectCustomer(name: string) {
        const match = customers.find(
            (customer) => customer.name.toLowerCase() === name.toLowerCase()
        );

        onChange({
            ...values,
            customer: name,
            ...(match
                ? {
                      customerPhone: match.phone,
                      customerEmail: match.email ?? "",
                  }
                : {}),
        });
    }

    return (
        <form className="repair-workflow-form" onSubmit={onSubmit}>
            <section className="form-section">
                <div className="form-section-heading">
                    <h2>Customer</h2>
                    <p>Choose an existing customer or enter a new name.</p>
                </div>
                <div className="form-grid">
                    <label className="field field-wide">
                        <span>Customer name</span>
                        <input
                            list="repair-customers"
                            value={values.customer}
                            onChange={(event) => selectCustomer(event.target.value)}
                            placeholder="Search or enter customer name"
                            required
                        />
                        <datalist id="repair-customers">
                            {customers.map((customer) => (
                                <option key={customer.id} value={customer.name} />
                            ))}
                        </datalist>
                    </label>
                    <label className="field">
                        <span>Phone</span>
                        <input
                            type="tel"
                            value={values.customerPhone}
                            onChange={(event) =>
                                setField("customerPhone", event.target.value)
                            }
                            placeholder="+234..."
                        />
                    </label>
                    <label className="field">
                        <span>Email</span>
                        <input
                            type="email"
                            value={values.customerEmail}
                            onChange={(event) =>
                                setField("customerEmail", event.target.value)
                            }
                            placeholder="customer@example.com"
                        />
                    </label>
                </div>
            </section>

            <section className="form-section">
                <div className="form-section-heading">
                    <h2>Device and issue</h2>
                    <p>Record enough detail to identify and diagnose the item.</p>
                </div>
                <div className="form-grid">
                    <label className="field">
                        <span>Device type</span>
                        <input
                            value={values.device}
                            onChange={(event) => setField("device", event.target.value)}
                            placeholder="Phone, laptop, tablet..."
                            required
                        />
                    </label>
                    <label className="field">
                        <span>Brand</span>
                        <input
                            value={values.deviceBrand}
                            onChange={(event) =>
                                setField("deviceBrand", event.target.value)
                            }
                            placeholder="Apple, Samsung, HP..."
                        />
                    </label>
                    <label className="field">
                        <span>Model</span>
                        <input
                            value={values.deviceModel}
                            onChange={(event) =>
                                setField("deviceModel", event.target.value)
                            }
                            placeholder="iPhone 14 Pro"
                        />
                    </label>
                    <label className="field">
                        <span>Serial / IMEI</span>
                        <input
                            value={values.serialNumber}
                            onChange={(event) =>
                                setField("serialNumber", event.target.value)
                            }
                            placeholder="Optional identifier"
                        />
                    </label>
                    <label className="field field-wide">
                        <span>Reported issue</span>
                        <textarea
                            value={values.issue}
                            onChange={(event) => setField("issue", event.target.value)}
                            placeholder="Describe the fault and what the customer expects..."
                            required
                        />
                    </label>
                </div>
            </section>

            <section className="form-section">
                <div className="form-section-heading">
                    <h2>Workflow</h2>
                    <p>Set ownership, urgency, timing, and commercial details.</p>
                </div>
                <div className="form-grid">
                    <label className="field">
                        <span>Status</span>
                        <select
                            value={values.status}
                            onChange={(event) =>
                                setField(
                                    "status",
                                    event.target.value as RepairPayload["status"]
                                )
                            }
                        >
                            {REPAIR_STATUSES.map((status) => (
                                <option key={status}>{status}</option>
                            ))}
                        </select>
                    </label>
                    <label className="field">
                        <span>Priority</span>
                        <select
                            value={values.priority}
                            onChange={(event) =>
                                setField(
                                    "priority",
                                    event.target.value as RepairPayload["priority"]
                                )
                            }
                        >
                            {REPAIR_PRIORITIES.map((priority) => (
                                <option key={priority}>{priority}</option>
                            ))}
                        </select>
                    </label>
                    <label className="field">
                        <span>Assigned technician</span>
                        <input
                            value={values.assignedTechnician}
                            onChange={(event) =>
                                setField("assignedTechnician", event.target.value)
                            }
                            placeholder="Technician name"
                        />
                    </label>
                    <label className="field">
                        <span>Due date</span>
                        <input
                            type="date"
                            value={values.dueDate}
                            onChange={(event) =>
                                setField("dueDate", event.target.value)
                            }
                        />
                    </label>
                    <label className="field">
                        <span>Estimate (NGN)</span>
                        <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={values.estimatedCost}
                            onChange={(event) =>
                                setField("estimatedCost", event.target.value)
                            }
                            placeholder="0.00"
                        />
                    </label>
                    <label className="field">
                        <span>Final cost (NGN)</span>
                        <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={values.finalCost}
                            onChange={(event) =>
                                setField("finalCost", event.target.value)
                            }
                            placeholder="0.00"
                        />
                    </label>
                    {showStatusNote && (
                        <label className="field field-wide">
                            <span>Status update note</span>
                            <input
                                value={values.statusNote ?? ""}
                                onChange={(event) =>
                                    setField("statusNote", event.target.value)
                                }
                                placeholder="What changed? This is added to the timeline."
                            />
                        </label>
                    )}
                    <label className="field field-wide">
                        <span>Internal notes</span>
                        <textarea
                            value={values.notes}
                            onChange={(event) => setField("notes", event.target.value)}
                            placeholder="Diagnosis, accessories received, warranty notes..."
                        />
                    </label>
                </div>
            </section>

            <div className="form-actions">
                <button className="primary-action" type="submit" disabled={loading}>
                    {loading ? "Saving..." : submitLabel}
                </button>
            </div>
        </form>
    );
}

export default RepairForm;
