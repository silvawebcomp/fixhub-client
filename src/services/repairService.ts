const API_URL = "http://localhost:5000/api/repairs";

import type { Repair } from "../types/repair";

export async function getRepairs(): Promise<Repair[]> {

    const response = await fetch(API_URL);

    if (!response.ok) {

        throw new Error("Failed to fetch repairs");

    }

    return await response.json();

}

export async function createRepair(

    repair: {

        customer: string;

        device: string;

        status: string;

        notes?: string;

        userId: number;

    }

): Promise<Repair> {

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

        notes?: string;

    }

): Promise<Repair> {

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

export async function deleteRepair(

    id: number

): Promise<void> {

    const response = await fetch(

        `${API_URL}/${id}`,

        {

            method: "DELETE",

        }

    );

    if (!response.ok) {

        throw new Error("Failed to delete repair");

    }

}