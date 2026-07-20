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

type StockFilter = "All" | "In stock" | "Low stock" | "Out of stock";

type SortKey = "updated" | "name" | "value" | "quantity" | "attention";

function money(value: number) {
    return `NGN ${value.toLocaleString()}`;
}

function stockStatus(item: InventoryItem): Exclude<StockFilter, "All"> {
    if (item.quantity <= 0) {
        return "Out of stock";
    }

    if (item.quantity <= item.reorderLevel) {
        return "Low stock";
    }

    return "In stock";
}

function stockRatio(item: InventoryItem) {
    if (item.reorderLevel <= 0) {
        return item.quantity > 0 ? 100 : 0;
    }

    return Math.min(100, Math.round((item.quantity / (item.reorderLevel * 2)) * 100));
}

function newestMovement(item: InventoryItem) {
    return item.movements?.[0];
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
    const [categoryFilter, setCategoryFilter] = useState("");
    const [stockFilter, setStockFilter] = useState<StockFilter>("All");
    const [sortKey, setSortKey] = useState<SortKey>("attention");

    const { query, setQuery, filteredData } = useSearch(
        items,
        (item) =>
            `${item.name} ${item.sku ?? ""} ${item.category ?? ""} ${
                item.supplier ?? ""
            } ${item.location ?? ""} ${item.branch?.name ?? ""}`
    );

    const categories = useMemo(
        () =>
            Array.from(
                new Set(items.map((item) => item.category).filter(Boolean))
            ).sort() as string[],
        [items]
    );

    const tableItems = useMemo(() => {
        const filtered = filteredData.filter((item) => {
            const matchesCategory =
                !categoryFilter || item.category === categoryFilter;
            const status = stockStatus(item);
            const matchesStatus =
                stockFilter === "All" || status === stockFilter;

            return matchesCategory && matchesStatus;
        });

        return [...filtered].sort((first, second) => {
            if (sortKey === "name") {
                return first.name.localeCompare(second.name);
            }

            if (sortKey === "value") {
                return second.quantity * second.price - first.quantity * first.price;
            }

            if (sortKey === "quantity") {
                return second.quantity - first.quantity;
            }

            if (sortKey === "attention") {
                const rank = {
                    "Out of stock": 0,
                    "Low stock": 1,
                    "In stock": 2,
                };

                return rank[stockStatus(first)] - rank[stockStatus(second)];
            }

            return (
                new Date(second.updatedAt).getTime() -
                new Date(first.updatedAt).getTime()
            );
        });
    }, [categoryFilter, filteredData, sortKey, stockFilter]);

    const allAttentionItems = useMemo(
        () =>
            items
                .filter((item) => stockStatus(item) !== "In stock")
                .sort((first, second) => {
                    if (first.quantity === second.quantity) {
                        return second.price - first.price;
                    }

                    return first.quantity - second.quantity;
                }),
        [items]
    );

    const topCategories = useMemo(() => {
        const categoryMap = new Map<
            string,
            { name: string; units: number; value: number; items: number; low: number }
        >();

        items.forEach((item) => {
            const name = item.category || "Uncategorized";
            const current =
                categoryMap.get(name) || {
                    name,
                    units: 0,
                    value: 0,
                    items: 0,
                    low: 0,
                };

            current.units += item.quantity;
            current.value += item.quantity * item.price;
            current.items += 1;
            current.low += stockStatus(item) === "In stock" ? 0 : 1;
            categoryMap.set(name, current);
        });

        return Array.from(categoryMap.values())
            .sort((first, second) => second.value - first.value)
            .slice(0, 5);
    }, [items]);

    const statusCounts = useMemo(
        () =>
            items.reduce(
                (counts, item) => {
                    counts[stockStatus(item)] += 1;
                    return counts;
                },
                {
                    "In stock": 0,
                    "Low stock": 0,
                    "Out of stock": 0,
                }
            ),
        [items]
    );

    const visibleInventoryValue = useMemo(
        () =>
            tableItems.reduce(
                (total, item) => total + item.quantity * item.price,
                0
            ),
        [tableItems]
    );

    const inventoryHealth = useMemo(
        () =>
            summary.totalItems
                ? Math.round(
                      ((summary.totalItems - summary.lowStockItems) /
                          summary.totalItems) *
                          100
                  )
                : 100,
        [summary.lowStockItems, summary.totalItems]
    );

    const selectedBranchName = useMemo(
        () =>
            branchId
                ? branches.find((branch) => String(branch.id) === branchId)?.name ||
                  "Selected branch"
                : "All branches",
        [branchId, branches]
    );

    const lastMovement = useMemo(
        () =>
            items
                .map(newestMovement)
                .filter(Boolean)
                .sort(
                    (first, second) =>
                        new Date(second!.createdAt).getTime() -
                        new Date(first!.createdAt).getTime()
                )[0],
        [items]
    );

    const filteredCountLabel = useMemo(
        () =>
            `${tableItems.length.toLocaleString()} of ${items.length.toLocaleString()} item${
                items.length === 1 ? "" : "s"
            }`,
        [items.length, tableItems.length]
    );

    const stockFilterOptions: StockFilter[] = [
        "All",
        "In stock",
        "Low stock",
        "Out of stock",
    ];

    const sortOptions: { value: SortKey; label: string }[] = [
        { value: "attention", label: "Needs attention first" },
        { value: "updated", label: "Recently updated" },
        { value: "value", label: "Highest value" },
        { value: "quantity", label: "Highest quantity" },
        { value: "name", label: "Item name" },
    ];

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
                <header className="inventory-hero">
                    <div>
                        <p className="eyebrow">Stock command</p>
                        <h1>Inventory</h1>
                        <p>
                            Track parts, suppliers, reorder levels, stock movements,
                            and branch availability from one operating view.
                        </p>
                        <div className="inventory-hero-meta">
                            <span>{selectedBranchName}</span>
                            <span>{filteredCountLabel}</span>
                            <span>
                                Last movement{" "}
                                {lastMovement
                                    ? new Date(
                                          lastMovement.createdAt
                                      ).toLocaleDateString()
                                    : "not recorded"}
                            </span>
                        </div>
                    </div>

                    <div className="inventory-hero-actions">
                        <button
                            type="button"
                            className="secondary-action"
                            onClick={() => void loadInventory()}
                            disabled={loading}
                        >
                            Refresh
                        </button>
                        <Link to="/inventory/new" className="primary-action">
                            Add Item
                        </Link>
                    </div>
                </header>

                <section className="inventory-kpi-grid">
                    <article className="inventory-kpi-card">
                        <span className="inventory-kpi-icon">IT</span>
                        <div>
                            <span>Total items</span>
                            <strong>{summary.totalItems.toLocaleString()}</strong>
                            <small>Active SKUs in stock control</small>
                        </div>
                    </article>
                    <article className="inventory-kpi-card">
                        <span className="inventory-kpi-icon success">UN</span>
                        <div>
                            <span>Stock units</span>
                            <strong>{summary.stockUnits.toLocaleString()}</strong>
                            <small>Total units on hand</small>
                        </div>
                    </article>
                    <article className="inventory-kpi-card">
                        <span className="inventory-kpi-icon value">NG</span>
                        <div>
                            <span>Inventory value</span>
                            <strong>{money(summary.inventoryValue)}</strong>
                            <small>{money(visibleInventoryValue)} in current view</small>
                        </div>
                    </article>
                    <article className="inventory-kpi-card attention">
                        <span className="inventory-kpi-icon warning">LO</span>
                        <div>
                            <span>Low stock</span>
                            <strong>{summary.lowStockItems.toLocaleString()}</strong>
                            <small>At or below reorder level</small>
                        </div>
                    </article>
                    <article className="inventory-kpi-card">
                        <span className="inventory-kpi-icon category">CA</span>
                        <div>
                            <span>Categories</span>
                            <strong>{summary.categories.toLocaleString()}</strong>
                            <small>Stock families represented</small>
                        </div>
                    </article>
                </section>

                <section className="inventory-attention-strip">
                    <div className="attention-label">
                        <span>Attention required</span>
                        <strong>{allAttentionItems.length.toLocaleString()} item(s)</strong>
                    </div>
                    <div>
                        <span>Low stock</span>
                        <strong>{statusCounts["Low stock"].toLocaleString()}</strong>
                    </div>
                    <div>
                        <span>Out of stock</span>
                        <strong>{statusCounts["Out of stock"].toLocaleString()}</strong>
                    </div>
                    <div>
                        <span>At-risk value</span>
                        <strong>
                            {money(
                                allAttentionItems.reduce(
                                    (total, item) => total + item.quantity * item.price,
                                    0
                                )
                            )}
                        </strong>
                    </div>
                </section>

                <div className="inventory-workspace">
                    <section className="inventory-main-panel">
                        <div className="inventory-toolbar">
                            <input
                                className="search-input"
                                type="text"
                                placeholder="Search by item, branch, SKU, category, supplier, or location..."
                                value={query}
                                onChange={(event) => setQuery(event.target.value)}
                            />
                            <label className="inventory-control">
                                <span>Branch</span>
                                <select
                                    value={branchId}
                                    onChange={(event) =>
                                        setBranchId(event.target.value)
                                    }
                                >
                                    <option value="">All branches</option>
                                    {branches.map((branch) => (
                                        <option key={branch.id} value={branch.id}>
                                            {branch.name}
                                        </option>
                                    ))}
                                </select>
                            </label>
                            <label className="inventory-control">
                                <span>Category</span>
                                <select
                                    value={categoryFilter}
                                    onChange={(event) =>
                                        setCategoryFilter(event.target.value)
                                    }
                                >
                                    <option value="">All categories</option>
                                    {categories.map((category) => (
                                        <option key={category} value={category}>
                                            {category}
                                        </option>
                                    ))}
                                </select>
                            </label>
                            <label className="inventory-control">
                                <span>Sort</span>
                                <select
                                    value={sortKey}
                                    onChange={(event) =>
                                        setSortKey(event.target.value as SortKey)
                                    }
                                >
                                    {sortOptions.map((option) => (
                                        <option
                                            key={option.value}
                                            value={option.value}
                                        >
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                            </label>
                        </div>

                        <div className="inventory-status-tabs">
                            {stockFilterOptions.map((option) => (
                                <button
                                    key={option}
                                    type="button"
                                    className={
                                        stockFilter === option ? "is-active" : ""
                                    }
                                    onClick={() => setStockFilter(option)}
                                >
                                    {option}
                                    <span>
                                        {option === "All"
                                            ? items.length
                                            : statusCounts[option]}
                                    </span>
                                </button>
                            ))}
                        </div>

                        {error && (
                            <div className="inventory-error">
                                <strong>Inventory could not load</strong>
                                <span>{error}</span>
                                <button
                                    type="button"
                                    onClick={() => void loadInventory()}
                                >
                                    Try again
                                </button>
                            </div>
                        )}

                        {loading ? (
                            <section className="inventory-loading-grid">
                                {Array.from({ length: 6 }).map((_, index) => (
                                    <span key={index} />
                                ))}
                            </section>
                        ) : tableItems.length === 0 ? (
                            <section className="inventory-empty-state">
                                <strong>No inventory items match this view.</strong>
                                <p>
                                    Clear filters or add the first stock item for this
                                    branch.
                                </p>
                                <Link to="/inventory/new" className="primary-action">
                                    Add Inventory Item
                                </Link>
                            </section>
                        ) : (
                            <section className="inventory-table">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Item</th>
                                            <th>SKU</th>
                                            <th>Category</th>
                                            <th>Branch</th>
                                            <th>Location</th>
                                            <th>Supplier</th>
                                            <th>Qty</th>
                                            <th>Reorder</th>
                                            <th>Unit price</th>
                                            <th>Total value</th>
                                            <th>Status</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {tableItems.map((item) => {
                                            const status = stockStatus(item);
                                            const movement = newestMovement(item);

                                            return (
                                                <tr key={item.id}>
                                                    <td className="inventory-item-cell">
                                                        <span className="item-avatar">
                                                            {item.name
                                                                .slice(0, 2)
                                                                .toUpperCase()}
                                                        </span>
                                                        <div>
                                                            <strong>{item.name}</strong>
                                                            <small>
                                                                Updated{" "}
                                                                {new Date(
                                                                    item.updatedAt
                                                                ).toLocaleDateString()}
                                                            </small>
                                                        </div>
                                                    </td>
                                                    <td>{item.sku || "-"}</td>
                                                    <td>{item.category || "-"}</td>
                                                    <td>
                                                        {item.branch?.name ?? "Default"}
                                                    </td>
                                                    <td>{item.location || "-"}</td>
                                                    <td>{item.supplier || "-"}</td>
                                                    <td>
                                                        <strong>
                                                            {item.quantity.toLocaleString()}
                                                        </strong>
                                                        <div className="stock-meter">
                                                            <span
                                                                style={{
                                                                    width: `${stockRatio(
                                                                        item
                                                                    )}%`,
                                                                }}
                                                            />
                                                        </div>
                                                    </td>
                                                    <td>{item.reorderLevel}</td>
                                                    <td>{money(item.price)}</td>
                                                    <td>
                                                        {money(
                                                            item.quantity * item.price
                                                        )}
                                                    </td>
                                                    <td>
                                                        <span
                                                            className={`stock-status stock-status-${status
                                                                .toLowerCase()
                                                                .replaceAll(" ", "-")}`}
                                                        >
                                                            {status}
                                                        </span>
                                                        {movement && (
                                                            <small className="movement-note">
                                                                {movement.type}
                                                            </small>
                                                        )}
                                                    </td>
                                                    <td>
                                                        <div className="inventory-actions">
                                                            <button
                                                                className="secondary-action"
                                                                onClick={() =>
                                                                    setActiveItem(item)
                                                                }
                                                            >
                                                                Adjust
                                                            </button>
                                                            <button
                                                                className="danger-button"
                                                                onClick={() =>
                                                                    void handleDelete(
                                                                        item.id
                                                                    )
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
                    </section>

                    <aside className="inventory-side-panel">
                        <section className="inventory-health-card">
                            <div>
                                <span>Inventory health</span>
                                <strong>{inventoryHealth}%</strong>
                            </div>
                            <div className="health-meter">
                                <span style={{ width: `${inventoryHealth}%` }} />
                            </div>
                            <p>
                                {summary.lowStockItems
                                    ? `${summary.lowStockItems} item(s) need reorder attention.`
                                    : "All tracked stock is above reorder level."}
                            </p>
                        </section>

                        <section className="inventory-insight-card">
                            <header>
                                <h2>Top categories</h2>
                                <span>{topCategories.length}</span>
                            </header>
                            {topCategories.length ? (
                                <ol>
                                    {topCategories.map((category) => (
                                        <li key={category.name}>
                                            <div>
                                                <strong>{category.name}</strong>
                                                <span>
                                                    {category.items} item(s) -{" "}
                                                    {category.units} units
                                                </span>
                                            </div>
                                            <em>{money(category.value)}</em>
                                        </li>
                                    ))}
                                </ol>
                            ) : (
                                <p>No category data yet.</p>
                            )}
                        </section>

                        <section className="inventory-insight-card reorder-card">
                            <header>
                                <h2>Reorder queue</h2>
                                <span>{allAttentionItems.length}</span>
                            </header>
                            {allAttentionItems.length ? (
                                <ol>
                                    {allAttentionItems.slice(0, 6).map((item) => (
                                        <li key={item.id}>
                                            <div>
                                                <strong>{item.name}</strong>
                                                <span>
                                                    {item.sku || "No SKU"} -{" "}
                                                    {item.branch?.name ?? "Default"}
                                                </span>
                                            </div>
                                            <em>
                                                {Math.max(
                                                    item.reorderLevel - item.quantity,
                                                    0
                                                )}{" "}
                                                needed
                                            </em>
                                        </li>
                                    ))}
                                </ol>
                            ) : (
                                <p>No reorder items right now.</p>
                            )}
                        </section>
                    </aside>
                </div>

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
