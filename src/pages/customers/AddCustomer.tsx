import "./AddCustomer.css";

import { useState } from "react";
import { useNavigate } from "react-router-dom";

function AddCustomer() {

    const navigate = useNavigate();

    const [name, setName] = useState("");

    const [phone, setPhone] = useState("");

    const [email, setEmail] = useState("");

    const [loading, setLoading] = useState(false);

    async function handleSubmit(
        event: React.FormEvent<HTMLFormElement>
    ) {

        event.preventDefault();

        setLoading(true);

        try {

            const response = await fetch(
                "http://localhost:5000/api/customers",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        name,
                        phone,
                        email,
                        userId: 1,
                    }),
                }
            );

            if (!response.ok) {

                throw new Error(
                    "Failed to create customer"
                );

            }

            alert("Customer created successfully");

            navigate("/customers");

        } catch (error) {

            console.error(error);

            alert("Unable to create customer");

        } finally {

            setLoading(false);

        }

    }

    return (

        <main className="add-customer-page">

            <h1>Add Customer</h1>

            <form
                className="customer-form"
                onSubmit={handleSubmit}
            >

                <input
                    type="text"
                    placeholder="Customer Name"
                    value={name}
                    onChange={(event) =>
                        setName(event.target.value)
                    }
                    required
                />

                <input
                    type="text"
                    placeholder="Phone Number"
                    value={phone}
                    onChange={(event) =>
                        setPhone(event.target.value)
                    }
                    required
                />

                <input
                    type="email"
                    placeholder="Email Address"
                    value={email}
                    onChange={(event) =>
                        setEmail(event.target.value)
                    }
                />

                <button
                    type="submit"
                    disabled={loading}
                >

                    {
                        loading
                            ? "Saving..."
                            : "Save Customer"
                    }

                </button>

            </form>

        </main>

    );

}

export default AddCustomer;