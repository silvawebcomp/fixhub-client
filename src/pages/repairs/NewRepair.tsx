import "./NewRepair.css";

import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { createRepair } from "../../services/repairService";

function NewRepair() {

    const navigate = useNavigate();

    const [customer, setCustomer] = useState("");

    const [device, setDevice] = useState("");

    const [status, setStatus] = useState("Pending");

    const [loading, setLoading] = useState(false);

    async function handleSubmit(
        event: React.FormEvent<HTMLFormElement>
    ) {

        event.preventDefault();

        setLoading(true);

        try {

            await createRepair({

    customer,

    device,

    status,

    notes: "",

    userId: 1,

});

            navigate("/repairs");

        } catch (error) {

            console.error(error);

            alert("Unable to save repair.");

        } finally {

            setLoading(false);

        }

    }

    return (

        <main className="new-repair-page">

            <h1>New Repair</h1>

            <form
                className="repair-form"
                onSubmit={handleSubmit}
            >

                <input
                    type="text"
                    placeholder="Customer Name"
                    value={customer}
                    onChange={(e) =>
                        setCustomer(e.target.value)
                    }
                    required
                />

                <input
                    type="text"
                    placeholder="Device"
                    value={device}
                    onChange={(e) =>
                        setDevice(e.target.value)
                    }
                    required
                />

                <select
                    value={status}
                    onChange={(e) =>
                        setStatus(e.target.value)
                    }
                >

                    <option>Pending</option>

                    <option>In Progress</option>

                    <option>Completed</option>

                    <option>Waiting Parts</option>

                </select>

                <button
                    type="submit"
                    disabled={loading}
                >

                    {loading
                        ? "Saving..."
                        : "Save Repair"}

                </button>

            </form>

        </main>

    );

}

export default NewRepair;