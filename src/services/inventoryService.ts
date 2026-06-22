import type { InventoryItem } from "../types/inventory";
import { apiRequest } from "./api";

export async function getInventory() {
    return apiRequest<InventoryItem[]>("/inventory");

}

export async function createInventoryItem(item: {

    name: string;

    quantity: number;

    price: number;

}) {

    return apiRequest<InventoryItem>("/inventory", {
        method: "POST",
        body: JSON.stringify(item),
    });

}

export async function deleteInventoryItem(id: number) {
    await apiRequest(`/inventory/${id}`, {
        method: "DELETE",
    });
}
