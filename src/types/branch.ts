export interface Branch {
    id: number;
    name: string;
    address: string | null;
    phone: string | null;
    managerName: string | null;
    isDefault: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface BranchPayload {
    name: string;
    address?: string;
    phone?: string;
    managerName?: string;
    isDefault?: boolean;
}
