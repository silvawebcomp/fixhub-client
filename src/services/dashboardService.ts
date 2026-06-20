const API_URL = "http://localhost:5000/api/dashboard";

export interface DashboardStats {

    totalRepairs: number;

    activeRepairs: number;

    customers: number;

    inventoryItems: number;

}

export async function getDashboardStats(): Promise<DashboardStats> {

    const response = await fetch(

        `${API_URL}/stats`

    );

    if (!response.ok) {

        throw new Error(

            "Failed to load dashboard statistics"

        );

    }

    return await response.json();

}