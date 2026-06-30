import { apiRequest } from "./api";
import type { Repair } from "../types/repair";

export const NOTIFICATION_CHANNELS = ["WhatsApp", "SMS", "Email"] as const;
export const NOTIFICATION_TEMPLATES = ["status", "approval", "ready", "payment"] as const;

export type NotificationChannel = (typeof NOTIFICATION_CHANNELS)[number];
export type NotificationTemplate = (typeof NOTIFICATION_TEMPLATES)[number];
export type NotificationStatus = "Prepared" | "Sent" | "Failed";

export type NotificationDraft = {
    repair: Repair;
    subject: string;
    message: string;
    recipients: Record<NotificationChannel, string>;
    trackingUrl: string;
};

export type NotificationLog = {
    id: number;
    userId: number;
    repairId: number | null;
    channel: NotificationChannel;
    recipient: string;
    subject: string | null;
    message: string;
    status: NotificationStatus;
    createdAt: string;
    launchUrl?: string;
    persisted?: boolean;
    repair?: {
        id: number;
        customer: string;
        device: string;
        ticketNumber: string | null;
        status: string;
    } | null;
};

export type NotificationPayload = {
    repairId?: number;
    channel: NotificationChannel;
    recipient: string;
    subject?: string;
    message: string;
    status: NotificationStatus;
};

export async function getNotificationDraft(
    repairId: number,
    template: NotificationTemplate
): Promise<NotificationDraft> {
    return apiRequest<NotificationDraft>(
        `/notifications/repairs/${repairId}/draft?template=${template}`
    );
}

export async function getNotificationLogs(repairId?: number): Promise<NotificationLog[]> {
    const query = repairId ? `?repairId=${repairId}` : "";

    return apiRequest<NotificationLog[]>(`/notifications${query}`);
}

export async function createNotificationLog(
    payload: NotificationPayload
): Promise<NotificationLog> {
    return apiRequest<NotificationLog>("/notifications", {
        method: "POST",
        body: JSON.stringify(payload),
    });
}
