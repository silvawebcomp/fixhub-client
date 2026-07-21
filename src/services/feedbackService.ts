import type {
    BetaFeedback,
    FeedbackPayload,
    FeedbackStatus,
} from "../types/feedback";
import { apiRequest } from "./api";

export async function createFeedback(payload: FeedbackPayload) {
    return apiRequest<BetaFeedback>("/feedback", {
        method: "POST",
        body: JSON.stringify(payload),
    });
}

export async function getFeedback() {
    return apiRequest<BetaFeedback[]>("/feedback");
}

export async function updateFeedbackStatus(
    id: number,
    status: FeedbackStatus
) {
    return apiRequest<BetaFeedback>(`/feedback/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
    });
}
