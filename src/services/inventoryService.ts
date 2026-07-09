import type {
    InventoryItem,
    InventoryPayload,
    InventorySummary,
    StockAdjustmentPayload,
} from "../types/inventory";
import { apiRequest } from "./api";

function branchQuery(branchId?: string) {
    return branchId ? `?branchId=${encodeURIComponent(branchId)}` : "";
}

export async function getInventory(branchId?: string) {
    return apiRequest<InventoryItem[]>(`/inventory${branchQuery(branchId)}`);
}

export async function getInventorySummary(branchId?: string) {
    return apiRequest<InventorySummary>(`/inventory/summary${branchQuery(branchId)}`);
}

export async function createInventoryItem(item: InventoryPayload) {
    return apiRequest<InventoryItem>("/inventory", {
        method: "POST",
        body: JSON.stringify(item),
    });
}

export async function updateInventoryItem(id: number, item: InventoryPayload) {
    return apiRequest<InventoryItem>(`/inventory/${id}`, {
        method: "PUT",
        body: JSON.stringify(item),
    });
}

export async function adjustInventoryItem(
    id: number,
    adjustment: StockAdjustmentPayload
) {
    return apiRequest<InventoryItem>(`/inventory/${id}/adjust`, {
        method: "POST",
        body: JSON.stringify(adjustment),
    });
}

export async function deleteInventoryItem(id: number) {
    await apiRequest(`/inventory/${id}`, {
        method: "DELETE",
    });
}
