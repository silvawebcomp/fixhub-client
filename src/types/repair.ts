export const REPAIR_STATUSES = [
    "Received",
    "Diagnosing",
    "Awaiting Approval",
    "Awaiting Parts",
    "Repairing",
    "Ready",
    "Collected",
    "Cancelled",
] as const;

export const REPAIR_PRIORITIES = ["Low", "Normal", "High", "Urgent"] as const;

export type RepairStatus = (typeof REPAIR_STATUSES)[number];
export type RepairPriority = (typeof REPAIR_PRIORITIES)[number];

export interface RepairStatusHistory {
    id: number;
    status: RepairStatus;
    note: string | null;
    createdAt: string;
    repairId: number;
}

export interface Repair {
    id: number;
    ticketNumber: string | null;
    customer: string;
    customerPhone: string | null;
    customerEmail: string | null;
    device: string;
    deviceBrand: string | null;
    deviceModel: string | null;
    serialNumber: string | null;
    issue: string | null;
    status: RepairStatus;
    priority: RepairPriority;
    assignedTechnician: string | null;
    estimatedCost: number | null;
    finalCost: number | null;
    dueDate: string | null;
    completedAt: string | null;
    notes: string | null;
    createdAt: string;
    updatedAt: string;
    userId: number;
    statusHistory?: RepairStatusHistory[];
}

export interface RepairPayload {
    customer: string;
    customerPhone: string;
    customerEmail: string;
    device: string;
    deviceBrand: string;
    deviceModel: string;
    serialNumber: string;
    issue: string;
    status: RepairStatus;
    priority: RepairPriority;
    assignedTechnician: string;
    estimatedCost: string;
    finalCost: string;
    dueDate: string;
    notes: string;
    statusNote?: string;
}
