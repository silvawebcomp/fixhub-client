import axiosClient from "./axiosClient";

export async function login(data: {
    email: string;
    password: string;
}) {
    const response = await axiosClient.post(
        "/auth/login",
        data
    );

    return response.data;
}

export async function register(data: {
    name: string;
    email: string;
    password: string;
}) {
    const response = await axiosClient.post(
        "/auth/register",
        data
    );

    return response.data;
}