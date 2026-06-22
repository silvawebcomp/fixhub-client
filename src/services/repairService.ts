import type { Repair } from "../types/repair";
import { apiRequest } from "./api";

export async function getRepairs(): Promise<Repair[]> {

    return apiRequest<Repair[]>("/repairs");

}

export async function createRepair(

    repair: {

        customer: string;

        device: string;

        status: string;

        notes?: string;

    }

): Promise<Repair> {

    return apiRequest<Repair>("/repairs", {
        method: "POST",
        body: JSON.stringify(repair),
    });

}

export async function updateRepair(

    id: number,

    repair: {

        customer: string;

        device: string;

        status: string;

        notes?: string;

    }

): Promise<Repair> {

    return apiRequest<Repair>(`/repairs/${id}`, {
        method: "PUT",
        body: JSON.stringify(repair),
    });

}

export async function deleteRepair(

    id: number

): Promise<void> {

    await apiRequest(`/repairs/${id}`, {
        method: "DELETE",
    });

}
