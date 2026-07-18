import "./Customers.css";

import { Link } from "react-router-dom";

import DashboardLayout from "../../layouts/DashboardLayout";

import { deleteCustomer } from "../../services/customerService";
import { useCustomers } from "../../hooks/useCustomers";
import { useSearch } from "../../hooks/useSearch";

import type { Customer } from "../../types/customer";

function Customers() {
    const {
        data: customers = [],
        isLoading,
        refetch,
    } = useCustomers();

    const {
        query,
        setQuery,
        filteredData,
    } = useSearch(
        customers,
        (customer: Customer) =>
            `${customer.name} ${customer.phone} ${customer.email ?? ""}`
    );

    async function handleDelete(id: number) {
        const confirmed = window.confirm(
            "Delete this customer?"
        );

        if (!confirmed) {
            return;
        }

        try {
            await deleteCustomer(id);
            await refetch();
        } catch (error) {
            console.error(error);
            alert("Unable to delete customer.");
        }
    }

    if (isLoading) {
        return (
            <DashboardLayout>
                <p className="loading-state">
                    Loading customers...
                </p>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <main className="customers-page">
                <header className="customers-header">
                    <div>
                        <p className="eyebrow">
                            Client Directory
                        </p>
                        <h1>Customers</h1>
                    </div>

                    <Link
                        to="/customers/new"
                        className="add-customer-btn"
                    >
                        Add Customer
                    </Link>
                </header>

                <section className="customers-search">
                    <input
                        type="text"
                        placeholder="Search customers..."
                        value={query}
                        onChange={(event) =>
                            setQuery(event.target.value)
                        }
                    />
                </section>

                <section className="customers-table">
                    <table>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Phone</th>
                                <th>Email</th>
                                <th>Action</th>
                            </tr>
                        </thead>

                        <tbody>
                            {filteredData.map((customer) => (
                                <tr key={customer.id}>
                                    <td>{customer.name}</td>
                                    <td>{customer.phone}</td>
                                    <td>
                                        {customer.email ??
                                            "Not provided"}
                                    </td>
                                    <td>
                                        <button
                                            className="danger-button"
                                            onClick={() =>
                                                void handleDelete(
                                                    customer.id
                                                )
                                            }
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </section>
            </main>
        </DashboardLayout>
    );
}

export default Customers;