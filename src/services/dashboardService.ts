import { apiRequest } from "./api";

export interface DashboardStats {

    totalRepairs: number;

    activeRepairs: number;

    customers: number;

    inventoryItems: number;

}

export async function getDashboardStats(): Promise<DashboardStats> {

    return apiRequest<DashboardStats>("/dashboard/stats");

}
