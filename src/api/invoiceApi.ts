import axiosClient from "./axiosClient";

export async function getInvoices() {
    const response = await axiosClient.get("/invoices");
    return response.data;
}

export async function getInvoice(id: number) {
    const response = await axiosClient.get(
        `/invoices/${id}`
    );

    return response.data;
}

export async function createInvoice(data: unknown) {
    const response = await axiosClient.post(
        "/invoices",
        data
    );

    return response.data;
}

export async function addPayment(
    id: number,
    data: unknown
) {
    const response = await axiosClient.post(
        `/invoices/${id}/payments`,
        data
    );

    return response.data;
}

export async function deleteInvoice(id: number) {
    const response = await axiosClient.delete(
        `/invoices/${id}`
    );

    return response.data;
}