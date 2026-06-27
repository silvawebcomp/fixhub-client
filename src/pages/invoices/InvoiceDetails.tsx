import "./InvoiceDetails.css";
import "./InvoiceList.css";
import "./InvoiceTable.css";

import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import DashboardLayout from "../../layouts/DashboardLayout";
import {
    PAYMENT_METHODS,
    deleteInvoice,
    getInvoice,
    recordInvoicePayment,
    type Invoice,
    type PaymentMethod,
} from "../../services/invoiceService";

type PaymentForm = {
    amount: string;
    method: PaymentMethod | "";
    reference: string;
    paidAt: string;
    notes: string;
};

const TODAY = new Date().toISOString().slice(0, 10);

function money(value: number) {
    return `NGN ${value.toLocaleString()}`;
}

function InvoiceDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const invoiceId = Number(id);
    const [invoice, setInvoice] = useState<Invoice | null>(null);
    const [payment, setPayment] = useState<PaymentForm>({
        amount: "",
        method: "",
        reference: "",
        paidAt: TODAY,
        notes: "",
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    useEffect(() => {
        getInvoice(invoiceId)
            .then(setInvoice)
            .catch((requestError) => {
                setError(
                    requestError instanceof Error
                        ? requestError.message
                        : "Unable to load invoice."
                );
            })
            .finally(() => setLoading(false));
    }, [invoiceId]);

    async function handlePaymentSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setSaving(true);
        setError("");
        setSuccess("");

        try {
            const updatedInvoice = await recordInvoicePayment(invoiceId, {
                amount: Number(payment.amount),
                method: payment.method,
                reference: payment.reference,
                paidAt: payment.paidAt,
                notes: payment.notes,
            });

            setInvoice(updatedInvoice);
            setPayment({
                amount: "",
                method: "",
                reference: "",
                paidAt: TODAY,
                notes: "",
            });
            setSuccess("Payment recorded.");
        } catch (requestError) {
            setError(
                requestError instanceof Error
                    ? requestError.message
                    : "Unable to record payment."
            );
        } finally {
            setSaving(false);
        }
    }

    async function handleDelete() {
        if (!window.confirm("Permanently delete this invoice?")) {
            return;
        }

        try {
            await deleteInvoice(invoiceId);
            navigate("/invoices");
        } catch (requestError) {
            setError(
                requestError instanceof Error
                    ? requestError.message
                    : "Unable to delete invoice."
            );
        }
    }

    if (loading) {
        return (
            <DashboardLayout>
                <p className="loading-state">Loading invoice...</p>
            </DashboardLayout>
        );
    }

    if (!invoice) {
        return (
            <DashboardLayout>
                <div className="empty-state">
                    <p>{error || "Invoice not found."}</p>
                    <Link to="/invoices">Return to invoices</Link>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <section className="invoice-page invoice-detail-page">
                <header className="invoice-header no-print">
                    <div>
                        <p className="eyebrow">Invoice</p>
                        <h2>{invoice.invoiceNumber}</h2>
                        <p>
                            {invoice.repair.customer} -{" "}
                            {invoice.repair.ticketNumber || `Repair #${invoice.repair.id}`}
                        </p>
                    </div>

                    <div className="invoice-actions">
                        <Link to="/invoices" className="secondary-invoice-btn">
                            Back
                        </Link>
                        <button
                            type="button"
                            className="secondary-invoice-btn"
                            onClick={() => window.print()}
                        >
                            Print
                        </button>
                        <button
                            type="button"
                            className="delete-invoice-btn"
                            onClick={handleDelete}
                        >
                            Delete
                        </button>
                    </div>
                </header>

                {error && <p className="form-error no-print">{error}</p>}
                {success && <p className="form-success no-print">{success}</p>}

                <div className="invoice-detail-grid">
                    <article className="invoice-document">
                        <div className="invoice-document-header">
                            <div>
                                <span>FIXHUB</span>
                                <h1>Invoice</h1>
                            </div>
                            <div>
                                <strong>{invoice.invoiceNumber}</strong>
                                <p>
                                    Issued{" "}
                                    {new Date(invoice.createdAt).toLocaleDateString()}
                                </p>
                            </div>
                        </div>

                        <section className="invoice-parties">
                            <div>
                                <span>Bill to</span>
                                <strong>{invoice.repair.customer}</strong>
                                <p>{invoice.repair.customerPhone || "No phone saved"}</p>
                                <p>{invoice.repair.customerEmail || "No email saved"}</p>
                            </div>
                            <div>
                                <span>Repair</span>
                                <strong>{invoice.repair.device}</strong>
                                <p>
                                    {[invoice.repair.deviceBrand, invoice.repair.deviceModel]
                                        .filter(Boolean)
                                        .join(" ") || "Device details not specified"}
                                </p>
                                <p>Status: {invoice.repair.status}</p>
                            </div>
                        </section>

                        <section className="invoice-line-table">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Description</th>
                                        <th>Qty</th>
                                        <th>Unit</th>
                                        <th>Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {invoice.labourCost > 0 && (
                                        <tr>
                                            <td>Labour</td>
                                            <td>1</td>
                                            <td>{money(invoice.labourCost)}</td>
                                            <td>{money(invoice.labourCost)}</td>
                                        </tr>
                                    )}
                                    {invoice.items.map((item) => (
                                        <tr key={item.id}>
                                            <td>{item.description}</td>
                                            <td>{item.quantity}</td>
                                            <td>{money(item.unitPrice)}</td>
                                            <td>{money(item.total)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </section>

                        <section className="invoice-totals">
                            <dl>
                                <div>
                                    <dt>Subtotal</dt>
                                    <dd>{money(invoice.subtotal)}</dd>
                                </div>
                                <div>
                                    <dt>Discount</dt>
                                    <dd>{money(invoice.discount)}</dd>
                                </div>
                                <div>
                                    <dt>Tax/charges</dt>
                                    <dd>{money(invoice.tax)}</dd>
                                </div>
                                <div>
                                    <dt>Total</dt>
                                    <dd>{money(invoice.total)}</dd>
                                </div>
                                <div>
                                    <dt>Paid</dt>
                                    <dd>{money(invoice.amountPaid)}</dd>
                                </div>
                                <div className="invoice-balance-row">
                                    <dt>Balance</dt>
                                    <dd>{money(invoice.balance)}</dd>
                                </div>
                            </dl>
                        </section>

                        {invoice.notes && (
                            <section className="invoice-notes">
                                <span>Notes</span>
                                <p>{invoice.notes}</p>
                            </section>
                        )}
                    </article>

                    <aside className="payment-panel no-print">
                        <div className="payment-status-card">
                            <span
                                className={`invoice-status invoice-status-${invoice.paymentStatus
                                    .toLowerCase()
                                    .replaceAll(" ", "-")}`}
                            >
                                {invoice.paymentStatus}
                            </span>
                            <strong>{money(invoice.balance)}</strong>
                            <p>Outstanding balance</p>
                        </div>

                        <form onSubmit={handlePaymentSubmit}>
                            <h3>Record payment</h3>

                            <label>
                                Amount
                                <input
                                    type="number"
                                    min="0.01"
                                    step="0.01"
                                    value={payment.amount}
                                    onChange={(event) =>
                                        setPayment((current) => ({
                                            ...current,
                                            amount: event.target.value,
                                        }))
                                    }
                                    required
                                />
                            </label>

                            <label>
                                Method
                                <select
                                    value={payment.method}
                                    onChange={(event) =>
                                        setPayment((current) => ({
                                            ...current,
                                            method: event.target.value as PaymentMethod | "",
                                        }))
                                    }
                                    required
                                >
                                    <option value="">Select method</option>
                                    {PAYMENT_METHODS.map((method) => (
                                        <option key={method} value={method}>
                                            {method}
                                        </option>
                                    ))}
                                </select>
                            </label>

                            <label>
                                Payment date
                                <input
                                    type="date"
                                    value={payment.paidAt}
                                    onChange={(event) =>
                                        setPayment((current) => ({
                                            ...current,
                                            paidAt: event.target.value,
                                        }))
                                    }
                                    required
                                />
                            </label>

                            <label>
                                Reference
                                <input
                                    value={payment.reference}
                                    onChange={(event) =>
                                        setPayment((current) => ({
                                            ...current,
                                            reference: event.target.value,
                                        }))
                                    }
                                    placeholder="Transfer or POS reference"
                                />
                            </label>

                            <label>
                                Notes
                                <textarea
                                    rows={3}
                                    value={payment.notes}
                                    onChange={(event) =>
                                        setPayment((current) => ({
                                            ...current,
                                            notes: event.target.value,
                                        }))
                                    }
                                    placeholder="Optional note"
                                />
                            </label>

                            <button className="new-invoice-btn" disabled={saving}>
                                {saving ? "Recording..." : "Record payment"}
                            </button>
                        </form>

                        <section className="payment-history">
                            <h3>Payment history</h3>
                            {invoice.payments.length === 0 ? (
                                <p>No payments recorded yet.</p>
                            ) : (
                                <ol>
                                    {invoice.payments.map((entry) => (
                                        <li key={entry.id}>
                                            <strong>{money(entry.amount)}</strong>
                                            <span>
                                                {entry.method} -{" "}
                                                {new Date(entry.paidAt).toLocaleDateString()}
                                            </span>
                                            {entry.reference && <p>{entry.reference}</p>}
                                        </li>
                                    ))}
                                </ol>
                            )}
                        </section>
                    </aside>
                </div>
            </section>
        </DashboardLayout>
    );
}

export default InvoiceDetails;
