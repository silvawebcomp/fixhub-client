import "./Customers.css";

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { getCustomers } from "../../services/customerService";

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

    useEffect(() => {

        async function loadCustomers() {

            try {

                const data = await getCustomers();

                setCustomers(data);

            } catch (error) {

                console.error(error);

            } finally {

                setLoading(false);

            }

        }

        loadCustomers();

    }, []);

    if (loading) {

        return <p>Loading customers...</p>;

    }

    return (

        <main className="customers-page">

            <header className="customers-header">

                <h1>Customers</h1>

                <Link
                    to="/customers/new"
                    className="add-customer-btn"
                >
                    + Add Customer
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

                        </tr>

                    </thead>

                    <tbody>

                        {filteredData.map((customer) => (

                            <tr key={customer.id}>

                                <td>{customer.name}</td>

                                <td>{customer.phone}</td>

                                <td>{customer.email}</td>

                            </tr>

                        ))}

                    </tbody>

                </table>

            </section>

        </main>

    );

}

export default Customers;