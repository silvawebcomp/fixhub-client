import { apiRequest } from "./api";
import type { User } from "../types/user";

type AuthResponse = {
    token: string;
    user: User;
};

type LoginPayload = {
    email: string;
    password: string;
};

export async function loginUser(
    payload: LoginPayload
) {

    return apiRequest<AuthResponse>("/auth/login", {
        method: "POST",
        auth: false,
        body: JSON.stringify(payload),
    });
}

type RegisterPayload = {
    name: string;
    email: string;
    password: string;
};

export async function registerUser(
    payload: RegisterPayload
) {

    return apiRequest<AuthResponse>("/auth/register", {
        method: "POST",
        auth: false,
        body: JSON.stringify(payload),
    });
}
