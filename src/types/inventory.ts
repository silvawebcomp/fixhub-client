import type { Branch } from "./branch";

export type StockMovementType =
    | "Stock In"
    | "Stock Out"
    | "Adjustment"
    | "Used for Repair";

export interface StockMovement {
    id: number;
    inventoryId: number;
    userId: number;
    type: StockMovementType;
    quantity: number;
    previousQty: number;
    newQty: number;
    unitCost: number | null;
    reason: string | null;
    createdAt: string;
}

export interface InventoryItem {
    id: number;
    name: string;
    quantity: number;
    price: number;
    sku: string | null;
    category: string | null;
    supplier: string | null;
    location: string | null;
    reorderLevel: number;
    createdAt: string;
    updatedAt: string;
    userId: number;
    branchId: number | null;
    branch?: Branch | null;
    movements?: StockMovement[];
}

export interface InventoryPayload {
    name: string;
    quantity: number;
    price: number;
    sku?: string;
    category?: string;
    supplier?: string;
    location?: string;
    reorderLevel?: number;
    branchId?: number | "";
}

export interface InventorySummary {
    totalItems: number;
    stockUnits: number;
    inventoryValue: number;
    lowStockItems: number;
    categories: number;
}

export interface StockAdjustmentPayload {
    type: StockMovementType;
    quantity: number;
    unitCost?: number | "";
    reason?: string;
}
