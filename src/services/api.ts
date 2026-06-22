const API_BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:5000/api";

type RequestOptions = RequestInit & {
    auth?: boolean;
};

export function getToken() {
    return localStorage.getItem("fixhub-token");
}

export async function apiRequest<T>(
    path: string,
    options: RequestOptions = {}
): Promise<T> {
    const { auth = true, headers, ...requestOptions } = options;
    const token = getToken();

    const response = await fetch(`${API_BASE_URL}${path}`, {
        ...requestOptions,
        headers: {
            "Content-Type": "application/json",
            ...(auth && token ? { Authorization: `Bearer ${token}` } : {}),
            ...headers,
        },
    });

    const isJson = response.headers
        .get("content-type")
        ?.includes("application/json");
    const data = isJson ? await response.json() : null;

    if (!response.ok) {
        if (response.status === 401) {
            localStorage.removeItem("fixhub-user");
            localStorage.removeItem("fixhub-token");
        }

        throw new Error(data?.message || "Request failed");
    }

    return data as T;
}
