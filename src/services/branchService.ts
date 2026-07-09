import { apiRequest } from "./api";
import type { Branch, BranchPayload } from "../types/branch";

export async function getBranches() {
    return apiRequest<Branch[]>("/branches");
}

export async function createBranch(payload: BranchPayload) {
    return apiRequest<Branch>("/branches", {
        method: "POST",
        body: JSON.stringify(payload),
    });
}

export async function updateBranch(id: number, payload: BranchPayload) {
    return apiRequest<Branch>(`/branches/${id}`, {
        method: "PUT",
        body: JSON.stringify(payload),
    });
}

export async function deleteBranch(id: number) {
    await apiRequest(`/branches/${id}`, {
        method: "DELETE",
    });
}
