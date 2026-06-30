import { apiRequest } from "./api";

export interface DashboardStats {

    totalRepairs: number;

    activeRepairs: number;

    customers: number;

    inventoryItems: number;

    totalInvoices: number;

    invoiceRevenue: number;

    paymentsReceived: number;

    outstandingBalance: number;

}

export interface InsightPoint {
    label: string;
    value: number;
}

export interface RevenueTrendPoint {
    month: string;
    billed: number;
    collected: number;
    outstanding: number;
}

export interface BusinessInsights {
    repairStatus: InsightPoint[];
    repairPriority: InsightPoint[];
    revenueTrend: RevenueTrendPoint[];
    inventoryHealth: {
        totalItems: number;
        lowStockItems: number;
        stockUnits: number;
        inventoryValue: number;
    };
    communicationTotals: {
        WhatsApp: number;
        SMS: number;
        Email: number;
    };
    kpis: {
        totalRepairs: number;
        activeRepairs: number;
        completedRepairs: number;
        totalRevenue: number;
        collectedRevenue: number;
        outstandingBalance: number;
        collectionRate: number;
    };
}

export async function getDashboardStats(): Promise<DashboardStats> {

    return apiRequest<DashboardStats>("/dashboard/stats");

}

export async function getBusinessInsights(): Promise<BusinessInsights> {

    return apiRequest<BusinessInsights>("/dashboard/insights");

}
