import "./AddInventory.css";

import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    createInventoryItem,
} from "../../services/inventoryService";
import DashboardLayout from "../../layouts/DashboardLayout";

function AddInventory() {

    const navigate = useNavigate();

    const [name, setName] = useState("");

    const [quantity, setQuantity] = useState("");

    const [price, setPrice] = useState("");

    const [loading, setLoading] = useState(false);

    async function handleSubmit(
        event: React.FormEvent<HTMLFormElement>
    ) {

        event.preventDefault();

        setLoading(true);

        try {

            await createInventoryItem({

                name,

                quantity: Number(quantity),

                price: Number(price),

            });

            navigate("/inventory");

        } catch (error) {

            console.error("ERROR:", error);

            alert("Unable to save inventory item.");

        } finally {

            setLoading(false);

        }

    }

    return (

        <DashboardLayout>

        <main className="add-inventory-page">

            <section className="add-inventory-card">

                <h1>Add Inventory Item</h1>

                <form
                    onSubmit={handleSubmit}
                    className="inventory-form"
                >

                    <input
                        type="text"
                        placeholder="Item Name"
                        value={name}
                        onChange={(event) =>
                            setName(event.target.value)
                        }
                        required
                    />

                    <input
                        type="number"
                        placeholder="Quantity"
                        value={quantity}
                        onChange={(event) =>
                            setQuantity(event.target.value)
                        }
                        required
                    />

                    <input
                        type="number"
                        placeholder="Price"
                        value={price}
                        onChange={(event) =>
                            setPrice(event.target.value)
                        }
                        required
                    />

                    <button
                        type="submit"
                        disabled={loading}
                    >

                        {
                            loading
                                ? "Saving..."
                                : "Save Item"
                        }

                    </button>

                </form>

            </section>

        </main>

        </DashboardLayout>

    );

}

export default AddInventory;
