const API_URL = "http://localhost:5000/api/customers";

export async function getCustomers() {

    const response = await fetch(API_URL);

    if (!response.ok) {

        throw new Error("Failed to fetch customers");

    }

    return await response.json();

}