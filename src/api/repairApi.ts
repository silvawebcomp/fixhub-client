import axiosClient from "./axiosClient";

function branchParams(branchId?: string) {
    return branchId
        ? {
              branchId,
          }
        : undefined;
}

export async function getRepairs(branchId?: string) {
    const response = await axiosClient.get("/repairs", {
        params: branchParams(branchId),
    });
    return response.data;
}

export async function getRepair(id: number) {
    const response = await axiosClient.get(
        `/repairs/${id}`
    );

    return response.data;
}

export async function createRepair(data: unknown) {
    const response = await axiosClient.post(
        "/repairs",
        data
    );

    return response.data;
}

export async function updateRepair(
    id: number,
    data: unknown
) {
    const response = await axiosClient.put(
        `/repairs/${id}`,
        data
    );

    return response.data;
}

export async function deleteRepair(id: number) {
    const response = await axiosClient.delete(
        `/repairs/${id}`
    );

    return response.data;
}
