import "./CreateInvoice.css";
import "./InvoiceList.css";

import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

import DashboardLayout from "../../layouts/DashboardLayout";
import {
    PAYMENT_METHODS,
    createInvoice,
    type InvoiceItemPayload,
    type PaymentMethod,
} from "../../services/invoiceService";
import { getRepairs } from "../../services/repairService";
import type { Repair } from "../../types/repair";

type InvoiceForm = {
    repairId: string;
    labourCost: string;
    discount: string;
    tax: string;
    amountPaid: string;
    paymentMethod: PaymentMethod | "";
    paymentReference: string;
    notes: string;
    items: Array<{
        description: string;
        quantity: string;
        unitPrice: string;
    }>;
};

const EMPTY_ITEM = {
    description: "",
    quantity: "1",
    unitPrice: "",
};

const INITIAL_FORM: InvoiceForm = {
    repairId: "",
    labourCost: "",
    discount: "",
    tax: "",
    amountPaid: "",
    paymentMethod: "",
    paymentReference: "",
    notes: "",
    items: [{ ...EMPTY_ITEM }],
};

function money(value: number) {
    return `NGN ${value.toLocaleString()}`;
}

function toNumber(value: string) {
    const parsed = Number(value);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
}

function CreateInvoice() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [repairs, setRepairs] = useState<Repair[]>([]);
    const [form, setForm] = useState<InvoiceForm>(INITIAL_FORM);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        getRepairs()
            .then((repairData) => {
                setRepairs(repairData);

                const repairId = searchParams.get("repairId");

                if (repairId && repairData.some((repair) => repair.id === Number(repairId))) {
                    const selectedRepair = repairData.find(
                        (repair) => repair.id === Number(repairId)
                    );

                    setForm((current) => ({
                        ...current,
                        repairId,
                        labourCost: selectedRepair?.finalCost?.toString() ?? "",
                    }));
                }
            })
            .catch((requestError) => {
                setError(
                    requestError instanceof Error
                        ? requestError.message
                        : "Unable to load repair tickets."
                );
            })
            .finally(() => setLoading(false));
    }, [searchParams]);

    const selectedRepair = useMemo(
        () => repairs.find((repair) => repair.id === Number(form.repairId)),
        [form.repairId, repairs]
    );

    const totals = useMemo(() => {
        const partsCost = form.items.reduce(
            (sum, item) => sum + toNumber(item.quantity) * toNumber(item.unitPrice),
            0
        );
        const labourCost = toNumber(form.labourCost);
        const subtotal = labourCost + partsCost;
        const discount = toNumber(form.discount);
        const tax = toNumber(form.tax);
        const total = Math.max(subtotal - discount + tax, 0);
        const amountPaid = toNumber(form.amountPaid);
        const balance = Math.max(total - amountPaid, 0);

        return {
            partsCost,
            labourCost,
            subtotal,
            discount,
            tax,
            total,
            amountPaid,
            balance,
        };
    }, [form]);

    function updateField<K extends keyof InvoiceForm>(field: K, value: InvoiceForm[K]) {
        setForm((current) => ({
            ...current,
            [field]: value,
        }));
    }

    function updateItem(index: number, field: keyof InvoiceForm["items"][number], value: string) {
        setForm((current) => ({
            ...current,
            items: current.items.map((item, itemIndex) =>
                itemIndex === index
                    ? {
                          ...item,
                          [field]: value,
                      }
                    : item
            ),
        }));
    }

    function addItem() {
        setForm((current) => ({
            ...current,
            items: [...current.items, { ...EMPTY_ITEM }],
        }));
    }

    function removeItem(index: number) {
        setForm((current) => ({
            ...current,
            items:
                current.items.length === 1
                    ? current.items
                    : current.items.filter((_, itemIndex) => itemIndex !== index),
        }));
    }

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setError("");
        setSaving(true);

        const items: InvoiceItemPayload[] = form.items.map((item) => ({
            description: item.description,
            quantity: Number(item.quantity),
            unitPrice: Number(item.unitPrice),
        }));

        try {
            const invoice = await createInvoice({
                repairId: Number(form.repairId),
                labourCost: toNumber(form.labourCost),
                discount: toNumber(form.discount),
                tax: toNumber(form.tax),
                amountPaid: toNumber(form.amountPaid),
                paymentMethod: form.paymentMethod,
                paymentReference: form.paymentReference,
                notes: form.notes,
                items,
            });

            navigate(`/invoices/${invoice.id}`);
        } catch (requestError) {
            setError(
                requestError instanceof Error
                    ? requestError.message
                    : "Unable to create invoice."
            );
        } finally {
            setSaving(false);
        }
    }

    return (
        <DashboardLayout>
            <section className="invoice-page">
                <header className="invoice-header">
                    <div>
                        <p className="eyebrow">Finance</p>
                        <h2>Create Invoice</h2>
                        <p>Build a bill from a repair ticket and record the first payment.</p>
                    </div>

                    <Link to="/invoices" className="secondary-invoice-btn">
                        Back to invoices
                    </Link>
                </header>

                {error && <p className="form-error">{error}</p>}

                {loading ? (
                    <p className="loading-state">Loading repair tickets...</p>
                ) : (
                    <form className="invoice-form-grid" onSubmit={handleSubmit}>
                        <div className="invoice-form-panel">
                            <div className="invoice-section-heading">
                                <h3>Repair and customer</h3>
                                <p>Select the repair ticket this invoice should close out.</p>
                            </div>

                            <label>
                                Repair ticket
                                <select
                                    value={form.repairId}
                                    onChange={(event) =>
                                        updateField("repairId", event.target.value)
                                    }
                                    required
                                >
                                    <option value="">Select a repair</option>
                                    {repairs.map((repair) => (
                                        <option key={repair.id} value={repair.id}>
                                            {repair.ticketNumber || `Repair #${repair.id}`} -{" "}
                                            {repair.customer} - {repair.device}
                                        </option>
                                    ))}
                                </select>
                            </label>

                            {selectedRepair && (
                                <div className="selected-repair-card">
                                    <strong>{selectedRepair.customer}</strong>
                                    <span>{selectedRepair.device}</span>
                                    <span>Status: {selectedRepair.status}</span>
                                    <span>
                                        Estimate:{" "}
                                        {money(selectedRepair.estimatedCost ?? 0)}
                                    </span>
                                </div>
                            )}

                            <label>
                                Labour cost
                                <input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={form.labourCost}
                                    onChange={(event) =>
                                        updateField("labourCost", event.target.value)
                                    }
                                    placeholder="0"
                                />
                            </label>

                            <div className="invoice-section-heading">
                                <h3>Parts and services</h3>
                                <p>Add every part or extra service the customer is paying for.</p>
                            </div>

                            <div className="line-items">
                                {form.items.map((item, index) => (
                                    <div className="line-item-row" key={index}>
                                        <label>
                                            Description
                                            <input
                                                value={item.description}
                                                onChange={(event) =>
                                                    updateItem(
                                                        index,
                                                        "description",
                                                        event.target.value
                                                    )
                                                }
                                                placeholder="Screen replacement"
                                                required
                                            />
                                        </label>

                                        <label>
                                            Qty
                                            <input
                                                type="number"
                                                min="1"
                                                step="1"
                                                value={item.quantity}
                                                onChange={(event) =>
                                                    updateItem(
                                                        index,
                                                        "quantity",
                                                        event.target.value
                                                    )
                                                }
                                                required
                                            />
                                        </label>

                                        <label>
                                            Unit price
                                            <input
                                                type="number"
                                                min="0"
                                                step="0.01"
                                                value={item.unitPrice}
                                                onChange={(event) =>
                                                    updateItem(
                                                        index,
                                                        "unitPrice",
                                                        event.target.value
                                                    )
                                                }
                                                required
                                            />
                                        </label>

                                        <button
                                            type="button"
                                            className="icon-text-button"
                                            onClick={() => removeItem(index)}
                                            disabled={form.items.length === 1}
                                        >
                                            Remove
                                        </button>
                                    </div>
                                ))}
                            </div>

                            <button
                                type="button"
                                className="secondary-invoice-btn"
                                onClick={addItem}
                            >
                                Add line item
                            </button>

                            <div className="invoice-two-columns">
                                <label>
                                    Discount
                                    <input
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        value={form.discount}
                                        onChange={(event) =>
                                            updateField("discount", event.target.value)
                                        }
                                        placeholder="0"
                                    />
                                </label>

                                <label>
                                    Tax or extra charges
                                    <input
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        value={form.tax}
                                        onChange={(event) =>
                                            updateField("tax", event.target.value)
                                        }
                                        placeholder="0"
                                    />
                                </label>
                            </div>

                            <div className="invoice-section-heading">
                                <h3>Payment</h3>
                                <p>Record a deposit or full payment if the customer has paid.</p>
                            </div>

                            <div className="invoice-two-columns">
                                <label>
                                    Amount paid
                                    <input
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        value={form.amountPaid}
                                        onChange={(event) =>
                                            updateField("amountPaid", event.target.value)
                                        }
                                        placeholder="0"
                                    />
                                </label>

                                <label>
                                    Payment method
                                    <select
                                        value={form.paymentMethod}
                                        onChange={(event) =>
                                            updateField(
                                                "paymentMethod",
                                                event.target.value as PaymentMethod | ""
                                            )
                                        }
                                    >
                                        <option value="">No payment yet</option>
                                        {PAYMENT_METHODS.map((method) => (
                                            <option key={method} value={method}>
                                                {method}
                                            </option>
                                        ))}
                                    </select>
                                </label>
                            </div>

                            <label>
                                Payment reference
                                <input
                                    value={form.paymentReference}
                                    onChange={(event) =>
                                        updateField("paymentReference", event.target.value)
                                    }
                                    placeholder="Transfer ID, POS slip, or receipt note"
                                />
                            </label>

                            <label>
                                Invoice notes
                                <textarea
                                    value={form.notes}
                                    onChange={(event) =>
                                        updateField("notes", event.target.value)
                                    }
                                    rows={4}
                                    placeholder="Warranty terms, pickup notes, or payment terms"
                                />
                            </label>
                        </div>

                        <aside className="invoice-summary-panel">
                            <h3>Invoice summary</h3>
                            <dl>
                                <div>
                                    <dt>Labour</dt>
                                    <dd>{money(totals.labourCost)}</dd>
                                </div>
                                <div>
                                    <dt>Parts</dt>
                                    <dd>{money(totals.partsCost)}</dd>
                                </div>
                                <div>
                                    <dt>Subtotal</dt>
                                    <dd>{money(totals.subtotal)}</dd>
                                </div>
                                <div>
                                    <dt>Discount</dt>
                                    <dd>{money(totals.discount)}</dd>
                                </div>
                                <div>
                                    <dt>Tax/charges</dt>
                                    <dd>{money(totals.tax)}</dd>
                                </div>
                                <div className="summary-total">
                                    <dt>Total</dt>
                                    <dd>{money(totals.total)}</dd>
                                </div>
                                <div>
                                    <dt>Paid</dt>
                                    <dd>{money(totals.amountPaid)}</dd>
                                </div>
                                <div className="summary-balance">
                                    <dt>Balance</dt>
                                    <dd>{money(totals.balance)}</dd>
                                </div>
                            </dl>

                            <button className="new-invoice-btn" disabled={saving}>
                                {saving ? "Creating invoice..." : "Create invoice"}
                            </button>
                        </aside>
                    </form>
                )}
            </section>
        </DashboardLayout>
    );
}

export default CreateInvoice;
