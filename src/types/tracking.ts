import type { RepairStatus } from "./repair";

export interface PublicRepairStatusHistory {
    id: number;
    status: RepairStatus;
    createdAt: string;
}

export interface PublicRepair {
    ticketNumber: string;
    customer: string;
    device: string;
    deviceBrand: string | null;
    deviceModel: string | null;
    issue: string | null;
    status: RepairStatus;
    estimatedCost: number | null;
    finalCost: number | null;
    dueDate: string | null;
    completedAt: string | null;
    createdAt: string;
    updatedAt: string;
    statusHistory: PublicRepairStatusHistory[];
}
