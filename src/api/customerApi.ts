import axiosClient from "./axiosClient";

export async function getCustomers() {
    const response = await axiosClient.get("/customers");
    return response.data;
}

export async function createCustomer(data: unknown) {
    const response = await axiosClient.post(
        "/customers",
        data
    );

    return response.data;
}

export async function updateCustomer(
    id: number,
    data: unknown
) {
    const response = await axiosClient.put(
        `/customers/${id}`,
        data
    );

    return response.data;
}

export async function deleteCustomer(id: number) {
    const response = await axiosClient.delete(
        `/customers/${id}`
    );

    return response.data;
}