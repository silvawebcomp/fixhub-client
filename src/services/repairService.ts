import type { Repair, RepairPayload } from "../types/repair";
import { apiRequest } from "./api";

function branchQuery(branchId?: string) {
    return branchId ? `?branchId=${encodeURIComponent(branchId)}` : "";
}

export async function getRepairs(branchId?: string): Promise<Repair[]> {
    return apiRequest<Repair[]>(`/repairs${branchQuery(branchId)}`);
}

export async function getRepair(id: number): Promise<Repair> {
    return apiRequest<Repair>(`/repairs/${id}`);
}

export async function createRepair(repair: RepairPayload): Promise<Repair> {
    return apiRequest<Repair>("/repairs", {
        method: "POST",
        body: JSON.stringify(repair),
    });
}

export async function updateRepair(
    id: number,
    repair: RepairPayload
): Promise<Repair> {
    return apiRequest<Repair>(`/repairs/${id}`, {
        method: "PUT",
        body: JSON.stringify(repair),
    });
}

export async function deleteRepair(id: number): Promise<void> {
    await apiRequest(`/repairs/${id}`, {
        method: "DELETE",
    });
}
