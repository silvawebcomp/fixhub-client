import type { PublicRepair } from "../types/tracking";
import { apiRequest } from "./api";

export async function trackRepair(ticketNumber: string, contact: string) {
    return apiRequest<PublicRepair>("/tracking", {
        method: "POST",
        auth: false,
        body: JSON.stringify({ ticketNumber, contact }),
    });
}
