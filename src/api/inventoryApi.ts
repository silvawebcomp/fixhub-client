import axiosClient from "./axiosClient";

function branchParams(branchId?: string) {
    return branchId
        ? {
              branchId,
          }
        : undefined;
}

export async function getInventory(branchId?: string) {
    const response = await axiosClient.get("/inventory", {
        params: branchParams(branchId),
    });
    return response.data;
}

export async function getInventorySummary(branchId?: string) {
    const response = await axiosClient.get("/inventory/summary", {
        params: branchParams(branchId),
    });
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
    const response = await axiosClient.post(
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

