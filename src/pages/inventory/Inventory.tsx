import "./Inventory.css";

import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import DashboardLayout from "../../layouts/DashboardLayout";
import {
    deleteInventoryItem,
    getInventory,
} from "../../services/inventoryService";
import { useSearch } from "../../hooks/useSearch";
import type { InventoryItem } from "../../types/inventory";

function Inventory() {
    const [items, setItems] = useState<InventoryItem[]>([]);
    const [loading, setLoading] = useState(true);

    const { query, setQuery, filteredData } = useSearch(
        items,
        (item) => `${item.name} ${item.quantity} ${item.price}`
    );

    const inventoryValue = useMemo(
        () => items.reduce((total, item) => total + item.quantity * item.price, 0),
        [items]
    );

    async function handleDelete(id: number) {
        const confirmed = window.confirm("Delete this inventory item?");

        if (!confirmed) {
            return;
        }

        try {
            await deleteInventoryItem(id);
            setItems((current) => current.filter((item) => item.id !== id));
        } catch (error) {
            console.error(error);
            alert("Unable to delete inventory item.");
        }
    }

    useEffect(() => {
        let active = true;

        getInventory()
            .then((data) => {
                if (active) {
                    setItems(data);
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

    return (
        <DashboardLayout>
            <main className="inventory-page">
                <header className="page-header">
                    <div>
                        <p className="eyebrow">Stock Control</p>
                        <h1>Inventory</h1>
                    </div>

                    <Link to="/inventory/new" className="primary-action">
                        Add Item
                    </Link>
                </header>

                <section className="summary-strip">
                    <div>
                        <span>Total Items</span>
                        <strong>{items.length}</strong>
                    </div>
                    <div>
                        <span>Stock Units</span>
                        <strong>
                            {items.reduce((total, item) => total + item.quantity, 0)}
                        </strong>
                    </div>
                    <div>
                        <span>Inventory Value</span>
                        <strong>
                            {inventoryValue.toLocaleString(undefined, {
                                style: "currency",
                                currency: "USD",
                            })}
                        </strong>
                    </div>
                </section>

                <input
                    className="search-input"
                    type="text"
                    placeholder="Search inventory..."
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                />

                {loading ? (
                    <p className="loading-state">Loading inventory...</p>
                ) : filteredData.length === 0 ? (
                    <p className="empty-state">No inventory items found.</p>
                ) : (
                    <section className="inventory-table">
                        <table>
                            <thead>
                                <tr>
                                    <th>Item</th>
                                    <th>Quantity</th>
                                    <th>Unit Price</th>
                                    <th>Total Value</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredData.map((item) => (
                                    <tr key={item.id}>
                                        <td>{item.name}</td>
                                        <td>{item.quantity}</td>
                                        <td>
                                            {item.price.toLocaleString(undefined, {
                                                style: "currency",
                                                currency: "USD",
                                            })}
                                        </td>
                                        <td>
                                            {(item.quantity * item.price).toLocaleString(
                                                undefined,
                                                {
                                                    style: "currency",
                                                    currency: "USD",
                                                }
                                            )}
                                        </td>
                                        <td>
                                            <button
                                                className="danger-button"
                                                onClick={() => void handleDelete(item.id)}
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </section>
                )}
            </main>
        </DashboardLayout>
    );
}

export default Inventory;
