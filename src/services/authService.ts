const API_URL = "http://localhost:5000/api";

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

    if (!response.ok) {

        throw new Error(

            "Invalid email or password"

        );

    }

    return await response.json();

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

    if (!response.ok) {

        throw new Error(

            "Registration failed"

        );

    }

    return await response.json();

}