import "./Inventory.css";

import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import DashboardLayout from "../../layouts/DashboardLayout";
import { getBranches } from "../../services/branchService";
import {
    adjustInventoryItem,
    deleteInventoryItem,
    getInventory,
    getInventorySummary,
} from "../../services/inventoryService";
import { useSearch } from "../../hooks/useSearch";
import type { Branch } from "../../types/branch";
import type {
    InventoryItem,
    InventorySummary,
    StockMovementType,
} from "../../types/inventory";

const EMPTY_SUMMARY: InventorySummary = {
    totalItems: 0,
    stockUnits: 0,
    inventoryValue: 0,
    lowStockItems: 0,
    categories: 0,
};

const MOVEMENT_TYPES: StockMovementType[] = [
    "Stock In",
    "Stock Out",
    "Adjustment",
    "Used for Repair",
];

function money(value: number) {
    return `NGN ${value.toLocaleString()}`;
}

function Inventory() {
    const [items, setItems] = useState<InventoryItem[]>([]);
    const [branches, setBranches] = useState<Branch[]>([]);
    const [branchId, setBranchId] = useState("");
    const [summary, setSummary] = useState<InventorySummary>(EMPTY_SUMMARY);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [activeItem, setActiveItem] = useState<InventoryItem | null>(null);
    const [movementType, setMovementType] = useState<StockMovementType>("Stock In");
    const [movementQuantity, setMovementQuantity] = useState("");
    const [movementReason, setMovementReason] = useState("");
    const [savingMovement, setSavingMovement] = useState(false);

    const { query, setQuery, filteredData } = useSearch(
        items,
        (item) =>
            `${item.name} ${item.sku ?? ""} ${item.category ?? ""} ${
                item.supplier ?? ""
            } ${item.location ?? ""} ${item.branch?.name ?? ""}`
    );

    const lowStockItems = useMemo(
        () => filteredData.filter((item) => item.quantity <= item.reorderLevel),
        [filteredData]
    );

    async function loadInventory(nextBranchId = branchId) {
        setLoading(true);
        setError("");

        try {
            const [inventoryData, summaryData] = await Promise.all([
                getInventory(nextBranchId),
                getInventorySummary(nextBranchId),
            ]);

            setItems(inventoryData);
            setSummary(summaryData);
        } catch (requestError) {
            setError(
                requestError instanceof Error
                    ? requestError.message
                    : "Unable to load inventory."
            );
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        let active = true;

        Promise.all([
            getBranches(),
            getInventory(branchId),
            getInventorySummary(branchId),
        ])
            .then(([branchData, inventoryData, summaryData]) => {
                if (!active) {
                    return;
                }

                setBranches(branchData);
                setItems(inventoryData);
                setSummary(summaryData);
            })
            .catch((requestError) => {
                if (!active) {
                    return;
                }

                setError(
                    requestError instanceof Error
                        ? requestError.message
                        : "Unable to load inventory."
                );
            })
            .finally(() => {
                if (active) {
                    setLoading(false);
                }
            });

        return () => {
            active = false;
        };
    }, [branchId]);

    async function handleDelete(id: number) {
        const confirmed = window.confirm("Delete this inventory item?");

        if (!confirmed) {
            return;
        }

        try {
            await deleteInventoryItem(id);
            await loadInventory();
        } catch (requestError) {
            setError(
                requestError instanceof Error
                    ? requestError.message
                    : "Unable to delete inventory item."
            );
        }
    }

    async function handleMovement(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (!activeItem) {
            return;
        }

        setSavingMovement(true);
        setError("");

        try {
            await adjustInventoryItem(activeItem.id, {
                type: movementType,
                quantity: Number(movementQuantity),
                reason: movementReason,
            });

            setActiveItem(null);
            setMovementQuantity("");
            setMovementReason("");
            await loadInventory();
        } catch (requestError) {
            setError(
                requestError instanceof Error
                    ? requestError.message
                    : "Unable to update stock."
            );
        } finally {
            setSavingMovement(false);
        }
    }

    return (
        <DashboardLayout>
            <main className="inventory-page">
                <header className="page-header">
                    <div>
                        <p className="eyebrow">Stock Control</p>
                        <h1>Inventory</h1>
                        <p>Track parts, suppliers, reorder levels, stock movements, and branches.</p>
                    </div>

                    <Link to="/inventory/new" className="primary-action">
                        Add Item
                    </Link>
                </header>

                <section className="summary-strip inventory-summary-strip">
                    <div>
                        <span>Total items</span>
                        <strong>{summary.totalItems}</strong>
                    </div>
                    <div>
                        <span>Stock units</span>
                        <strong>{summary.stockUnits}</strong>
                    </div>
                    <div>
                        <span>Inventory value</span>
                        <strong>{money(summary.inventoryValue)}</strong>
                    </div>
                    <div>
                        <span>Low stock</span>
                        <strong>{summary.lowStockItems}</strong>
                    </div>
                    <div>
                        <span>Categories</span>
                        <strong>{summary.categories}</strong>
                    </div>
                </section>

                <section className="inventory-toolbar">
                    <input
                        className="search-input"
                        type="text"
                        placeholder="Search by item, branch, SKU, category, supplier, or location..."
                        value={query}
                        onChange={(event) => setQuery(event.target.value)}
                    />
                    <label className="branch-select-inline">
                        <span>Branch</span>
                        <select
                            value={branchId}
                            onChange={(event) => setBranchId(event.target.value)}
                        >
                            <option value="">All branches</option>
                            {branches.map((branch) => (
                                <option key={branch.id} value={branch.id}>
                                    {branch.name}
                                </option>
                            ))}
                        </select>
                    </label>
                    <div className="low-stock-callout">
                        <span>Needs attention</span>
                        <strong>{lowStockItems.length} item(s)</strong>
                    </div>
                </section>

                {error && <p className="form-error">{error}</p>}

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
                                    <th>Branch</th>
                                    <th>SKU</th>
                                    <th>Category</th>
                                    <th>Supplier</th>
                                    <th>Location</th>
                                    <th>Stock</th>
                                    <th>Unit price</th>
                                    <th>Value</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredData.map((item) => {
                                    const lowStock = item.quantity <= item.reorderLevel;

                                    return (
                                        <tr key={item.id}>
                                            <td>
                                                <strong>{item.name}</strong>
                                                {lowStock && (
                                                    <span className="stock-warning">
                                                        Low stock
                                                    </span>
                                                )}
                                            </td>
                                            <td>{item.branch?.name ?? "Default"}</td>
                                            <td>{item.sku || "-"}</td>
                                            <td>{item.category || "-"}</td>
                                            <td>{item.supplier || "-"}</td>
                                            <td>{item.location || "-"}</td>
                                            <td>
                                                <strong>{item.quantity}</strong>
                                                <small>Reorder at {item.reorderLevel}</small>
                                            </td>
                                            <td>{money(item.price)}</td>
                                            <td>{money(item.quantity * item.price)}</td>
                                            <td>
                                                <div className="inventory-actions">
                                                    <button
                                                        className="secondary-action"
                                                        onClick={() => setActiveItem(item)}
                                                    >
                                                        Adjust
                                                    </button>
                                                    <button
                                                        className="danger-button"
                                                        onClick={() =>
                                                            void handleDelete(item.id)
                                                        }
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </section>
                )}

                {activeItem && (
                    <div className="stock-modal-backdrop">
                        <section className="stock-modal">
                            <header>
                                <div>
                                    <p className="eyebrow">Stock movement</p>
                                    <h2>{activeItem.name}</h2>
                                    <p>
                                        {activeItem.branch?.name ?? "Default branch"} - Current stock: {activeItem.quantity}
                                    </p>
                                </div>
                                <button
                                    type="button"
                                    className="secondary-action"
                                    onClick={() => setActiveItem(null)}
                                >
                                    Close
                                </button>
                            </header>

                            <form onSubmit={handleMovement}>
                                <label>
                                    Movement type
                                    <select
                                        value={movementType}
                                        onChange={(event) =>
                                            setMovementType(
                                                event.target.value as StockMovementType
                                            )
                                        }
                                    >
                                        {MOVEMENT_TYPES.map((type) => (
                                            <option key={type} value={type}>
                                                {type}
                                            </option>
                                        ))}
                                    </select>
                                </label>

                                <label>
                                    Quantity
                                    <input
                                        type="number"
                                        min="1"
                                        step="1"
                                        value={movementQuantity}
                                        onChange={(event) =>
                                            setMovementQuantity(event.target.value)
                                        }
                                        required
                                    />
                                </label>

                                <label>
                                    Reason
                                    <textarea
                                        rows={3}
                                        value={movementReason}
                                        onChange={(event) =>
                                            setMovementReason(event.target.value)
                                        }
                                        placeholder="Restock, used for repair, damaged, count correction..."
                                    />
                                </label>

                                <button className="primary-action" disabled={savingMovement}>
                                    {savingMovement ? "Saving..." : "Save movement"}
                                </button>
                            </form>

                            <div className="movement-history">
                                <h3>Recent movement history</h3>
                                {activeItem.movements?.length ? (
                                    <ol>
                                        {activeItem.movements.map((movement) => (
                                            <li key={movement.id}>
                                                <strong>{movement.type}</strong>
                                                <span>
                                                    {movement.previousQty} to{" "}
                                                    {movement.newQty}
                                                </span>
                                                <time>
                                                    {new Date(
                                                        movement.createdAt
                                                    ).toLocaleString()}
                                                </time>
                                            </li>
                                        ))}
                                    </ol>
                                ) : (
                                    <p>No movements recorded yet.</p>
                                )}
                            </div>
                        </section>
                    </div>
                )}
            </main>
        </DashboardLayout>
    );
}

export default Inventory;
