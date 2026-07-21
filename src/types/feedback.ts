export const FEEDBACK_CATEGORIES = [
    "Bug",
    "Confusing",
    "Feature request",
    "Praise",
    "General",
] as const;

export const FEEDBACK_STATUSES = [
    "New",
    "Reviewing",
    "Planned",
    "Resolved",
    "Archived",
] as const;

export type FeedbackCategory = (typeof FEEDBACK_CATEGORIES)[number];
export type FeedbackStatus = (typeof FEEDBACK_STATUSES)[number];

export interface BetaFeedback {
    id: number;
    authorName: string | null;
    authorEmail: string | null;
    category: FeedbackCategory;
    rating: number | null;
    message: string;
    page: string | null;
    status: FeedbackStatus;
    contactConsent: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface FeedbackPayload {
    category: FeedbackCategory;
    rating?: number | null;
    message: string;
    page?: string;
    contactConsent: boolean;
}
