import "./Customers.css";

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import DashboardLayout from "../../layouts/DashboardLayout";
import {
    deleteCustomer,
    getCustomers,
} from "../../services/customerService";

import { useSearch } from "../../hooks/useSearch";

import type { Customer } from "../../types/customer";

function Customers() {

    const [customers, setCustomers] = useState<Customer[]>([]);

    const [loading, setLoading] = useState(true);

    const {

        query,

        setQuery,

        filteredData,

    } = useSearch(

        customers,

        (customer) =>

            `${customer.name} ${customer.phone} ${customer.email ?? ""}`

    );

    async function handleDelete(id: number) {
        const confirmed = window.confirm("Delete this customer?");

        if (!confirmed) {
            return;
        }

        try {
            await deleteCustomer(id);
            setCustomers((current) =>
                current.filter((customer) => customer.id !== id)
            );
        } catch (error) {
            console.error(error);
            alert("Unable to delete customer.");
        }
    }

    useEffect(() => {

        let active = true;

        getCustomers()
            .then((data) => {
                if (active) {
                    setCustomers(data);
                }
            })
            .catch((error) => {
                console.error(error);
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

    if (loading) {

        return (
            <DashboardLayout>
                <p className="loading-state">Loading customers...</p>
            </DashboardLayout>
        );

    }

    return (

        <DashboardLayout>

        <main className="customers-page">

            <header className="customers-header">

                <div>
                    <p className="eyebrow">Client Directory</p>
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

                                <td>{customer.email || "Not provided"}</td>

                                <td>
                                    <button
                                        className="danger-button"
                                        onClick={() =>
                                            void handleDelete(customer.id)
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
