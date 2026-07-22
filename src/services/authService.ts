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

type RequestPasswordResetPayload = {
    email: string;
};

type RequestPasswordResetResponse = {
    message: string;
    maskedEmail: string;
    expiresInMinutes: number;
};

export async function requestPasswordReset(
    payload: RequestPasswordResetPayload
) {
    return apiRequest<RequestPasswordResetResponse>(
        "/auth/forgot-password",
        {
            method: "POST",
            auth: false,
            body: JSON.stringify(payload),
        }
    );
}

type ResetPasswordPayload = {
    email: string;
    code: string;
    password: string;
};

type ResetPasswordResponse = {
    message: string;
};

export async function resetPassword(
    payload: ResetPasswordPayload
) {
    return apiRequest<ResetPasswordResponse>(
        "/auth/reset-password",
        {
            method: "POST",
            auth: false,
            body: JSON.stringify(payload),
        }
    );
}
