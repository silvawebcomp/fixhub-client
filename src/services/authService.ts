const API_URL = "http://localhost:5000/api/auth";

type LoginPayload = {
    email: string;
    password: string;
};

export async function loginUser(
    payload: LoginPayload
) {

    const response = await fetch(
        `${API_URL}/login`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.message || "Login failed"
        );
    }

    return data;
}

type RegisterPayload = {
    name: string;
    email: string;
    password: string;
};

export async function registerUser(
    payload: RegisterPayload
) {

    const response = await fetch(
        `${API_URL}/register`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.message || "Registration failed"
        );
    }

    return data;
}