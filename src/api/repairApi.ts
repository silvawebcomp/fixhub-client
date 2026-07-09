import axiosClient from "./axiosClient";

export async function getRepairs() {
    const response = await axiosClient.get("/repairs");
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