const API_URL = "http://localhost:5000/api/repairs";

export async function getRepairs() {

    const response = await fetch(API_URL);

    if (!response.ok) {

        throw new Error("Failed to fetch repairs");

    }

    return await response.json();

}

export async function createRepair(repair: {

    customer: string;

    device: string;

    status: string;

    date: string;

}) {

    const response = await fetch(API_URL, {

        method: "POST",

        headers: {

            "Content-Type": "application/json",

        },

        body: JSON.stringify(repair),

    });

    if (!response.ok) {

        throw new Error("Failed to create repair");

    }

    return await response.json();

}

export async function updateRepair(

    id: number,

    repair: {

        customer: string;

        device: string;

        status: string;

        date: string;

    }

) {

    const response = await fetch(

        `${API_URL}/${id}`,

        {

            method: "PUT",

            headers: {

                "Content-Type": "application/json",

            },

            body: JSON.stringify(repair),

        }

    );

    if (!response.ok) {

        throw new Error("Failed to update repair");

    }

    return await response.json();

}

export async function deleteRepair(id: number) {

    const response = await fetch(

        `${API_URL}/${id}`,

        {

            method: "DELETE",

        }

    );

    if (!response.ok) {

        throw new Error("Failed to delete repair");

    }

    return await response.json();

}