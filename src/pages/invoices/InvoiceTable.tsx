import "./InvoiceTable.css";

import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import { getInvoices, type Invoice } from "../../services/invoiceService";

function money(value: number) {
    return `NGN ${value.toLocaleString()}`;
}

function InvoiceTable() {
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        getInvoices()
            .then(setInvoices)
            .catch((requestError) => {
                setError(
                    requestError instanceof Error
                        ? requestError.message
                        : "Unable to load invoices."
                );
            })
            .finally(() => setLoading(false));
    }, []);

    const totals = useMemo(
        () =>
            invoices.reduce(
                (summary, invoice) => ({
                    total: summary.total + invoice.total,
                    paid: summary.paid + invoice.amountPaid,
                    balance: summary.balance + invoice.balance,
                }),
                {
                    total: 0,
                    paid: 0,
                    balance: 0,
                }
            ),
        [invoices]
    );

    if (loading) {
        return <p className="loading-state">Loading invoices...</p>;
    }

    if (error) {
        return <p className="form-error">{error}</p>;
    }

    if (invoices.length === 0) {
        return (
            <div className="empty-state invoice-empty-state">
                <p>No invoices have been created yet.</p>
                <Link to="/invoices/new" className="new-invoice-btn">
                    Create first invoice
                </Link>
            </div>
        );
    }

    return (
        <>
            <section className="invoice-metrics">
                <div>
                    <span>Total billed</span>
                    <strong>{money(totals.total)}</strong>
                </div>
                <div>
                    <span>Payments received</span>
                    <strong>{money(totals.paid)}</strong>
                </div>
                <div>
                    <span>Outstanding balance</span>
                    <strong>{money(totals.balance)}</strong>
                </div>
            </section>

            <section className="invoice-table">
                <table>
                    <thead>
                        <tr>
                            <th>Invoice</th>
                            <th>Customer</th>
                            <th>Device</th>
                            <th>Status</th>
                            <th>Total</th>
                            <th>Balance</th>
                        </tr>
                    </thead>

                    <tbody>
                        {invoices.map((invoice) => (
                            <tr key={invoice.id}>
                                <td>
                                    <Link
                                        to={`/invoices/${invoice.id}`}
                                        className="ticket-link"
                                    >
                                        {invoice.invoiceNumber}
                                    </Link>

                                    <small>
                                        {new Date(
                                            invoice.createdAt
                                        ).toLocaleDateString()}
                                    </small>
                                </td>

                                <td>{invoice.repair.customer}</td>
                                <td>{invoice.repair.device}</td>

                                <td>
                                    <span
                                        className={`invoice-status invoice-status-${invoice.paymentStatus
                                            .toLowerCase()
                                            .replaceAll(" ", "-")}`}
                                    >
                                        {invoice.paymentStatus}
                                    </span>
                                </td>

                                <td>{money(invoice.total)}</td>
                                <td>{money(invoice.balance)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </section>
        </>
    );
}

export default InvoiceTable;
