import axiosClient from "./axiosClient";

export async function getDashboardStats() {
    const response = await axiosClient.get(
        "/dashboard/stats"
    );

    return response.data;
}

export async function getBusinessInsights() {
    const response = await axiosClient.get(
        "/dashboard/insights"
    );

    return response.data;
}