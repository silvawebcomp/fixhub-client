import "./InvoiceList.css";

import { Link } from "react-router-dom";

import DashboardLayout from "../../layouts/DashboardLayout";

import InvoiceTable from "./InvoiceTable";

function InvoiceList() {
    return (
        <DashboardLayout>
            <main className="invoice-page">
                <div className="invoice-header">
                    <div>
                        <p className="eyebrow">Finance</p>

                        <h2>Invoices</h2>

                        <p>
                            Manage customer invoices,
                            payments and outstanding
                            balances.
                        </p>
                    </div>

                    <Link
                        to="/invoices/new"
                        className="new-invoice-btn"
                    >
                        New Invoice
                    </Link>
                </div>

                <InvoiceTable />
            </main>
        </DashboardLayout>
    );
}

export default InvoiceList;