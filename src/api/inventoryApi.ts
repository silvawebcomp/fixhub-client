import axiosClient from "./axiosClient";

export async function getInventory() {
    const response = await axiosClient.get("/inventory");
    return response.data;
}

export async function getInventorySummary() {
    const response = await axiosClient.get("/inventory/summary");
    return response.data;
}

export async function createInventoryItem(data: unknown) {
    const response = await axiosClient.post(
        "/inventory",
        data
    );

    return response.data;
}

export async function updateInventoryItem(
    id: number,
    data: unknown
) {
    const response = await axiosClient.put(
        `/inventory/${id}`,
        data
    );

    return response.data;
}

export async function adjustInventoryItem(
    id: number,
    data: unknown
) {
    const response = await axiosClient.patch(
        `/inventory/${id}/adjust`,
        data
    );

    return response.data;
}

export async function deleteInventoryItem(id: number) {
    const response = await axiosClient.delete(
        `/inventory/${id}`
    );

    return response.data;
}