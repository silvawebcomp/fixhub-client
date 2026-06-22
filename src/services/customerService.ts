import type { Customer } from "../types/customer";
import { apiRequest } from "./api";

type CustomerPayload = {
    name: string;
    phone: string;
    email?: string;
};

export async function getCustomers() {
    return apiRequest<Customer[]>("/customers");
}

export async function createCustomer(customer: CustomerPayload) {
    return apiRequest<Customer>("/customers", {
        method: "POST",
        body: JSON.stringify(customer),
    });
}

export async function deleteCustomer(id: number) {
    await apiRequest(`/customers/${id}`, {
        method: "DELETE",
    });
}
