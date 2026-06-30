import "./AddInventory.css";

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { createInventoryItem } from "../../services/inventoryService";
import DashboardLayout from "../../layouts/DashboardLayout";

function AddInventory() {
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [sku, setSku] = useState("");
    const [category, setCategory] = useState("");
    const [supplier, setSupplier] = useState("");
    const [location, setLocation] = useState("");
    const [quantity, setQuantity] = useState("");
    const [reorderLevel, setReorderLevel] = useState("");
    const [price, setPrice] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setLoading(true);
        setError("");

        try {
            await createInventoryItem({
                name,
                sku,
                category,
                supplier,
                location,
                quantity: Number(quantity),
                reorderLevel: Number(reorderLevel || 0),
                price: Number(price),
            });

            navigate("/inventory");
        } catch (requestError) {
            setError(
                requestError instanceof Error
                    ? requestError.message
                    : "Unable to save inventory item."
            );
        } finally {
            setLoading(false);
        }
    }

    return (
        <DashboardLayout>
            <main className="add-inventory-page">
                <header className="inventory-form-header">
                    <div>
                        <p className="eyebrow">Stock intake</p>
                        <h1>Add Inventory Item</h1>
                        <p>Add part details, reorder rules, and storage information.</p>
                    </div>
                    <Link to="/inventory" className="secondary-action">
                        Back to inventory
                    </Link>
                </header>

                {error && <p className="form-error">{error}</p>}

                <form onSubmit={handleSubmit} className="inventory-form">
                    <label>
                        Item name
                        <input
                            type="text"
                            placeholder="iPhone 12 screen"
                            value={name}
                            onChange={(event) => setName(event.target.value)}
                            required
                        />
                    </label>

                    <div className="inventory-form-grid">
                        <label>
                            SKU
                            <input
                                type="text"
                                placeholder="SCR-IP12-BLK"
                                value={sku}
                                onChange={(event) => setSku(event.target.value)}
                            />
                        </label>

                        <label>
                            Category
                            <input
                                type="text"
                                placeholder="Screens"
                                value={category}
                                onChange={(event) => setCategory(event.target.value)}
                            />
                        </label>
                    </div>

                    <div className="inventory-form-grid">
                        <label>
                            Supplier
                            <input
                                type="text"
                                placeholder="Supplier name"
                                value={supplier}
                                onChange={(event) => setSupplier(event.target.value)}
                            />
                        </label>

                        <label>
                            Storage location
                            <input
                                type="text"
                                placeholder="Shelf A2"
                                value={location}
                                onChange={(event) => setLocation(event.target.value)}
                            />
                        </label>
                    </div>

                    <div className="inventory-form-grid">
                        <label>
                            Quantity
                            <input
                                type="number"
                                min="0"
                                step="1"
                                placeholder="10"
                                value={quantity}
                                onChange={(event) => setQuantity(event.target.value)}
                                required
                            />
                        </label>

                        <label>
                            Reorder level
                            <input
                                type="number"
                                min="0"
                                step="1"
                                placeholder="3"
                                value={reorderLevel}
                                onChange={(event) => setReorderLevel(event.target.value)}
                            />
                        </label>
                    </div>

                    <label>
                        Unit cost (NGN)
                        <input
                            type="number"
                            min="0"
                            step="0.01"
                            placeholder="25000"
                            value={price}
                            onChange={(event) => setPrice(event.target.value)}
                            required
                        />
                    </label>

                    <button type="submit" disabled={loading}>
                        {loading ? "Saving..." : "Save item"}
                    </button>
                </form>
            </main>
        </DashboardLayout>
    );
}

export default AddInventory;
