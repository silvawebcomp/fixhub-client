import "./RepairCommunicationPanel.css";

import { useEffect, useState } from "react";

import {
    NOTIFICATION_CHANNELS,
    NOTIFICATION_TEMPLATES,
    createNotificationLog,
    getNotificationDraft,
    getNotificationLogs,
    type NotificationChannel,
    type NotificationLog,
    type NotificationTemplate,
} from "../../services/notificationService";
import type { Repair } from "../../types/repair";

type CommunicationPanelProps = {
    repair: Repair;
};

const TEMPLATE_LABELS: Record<NotificationTemplate, string> = {
    status: "Status update",
    approval: "Approval request",
    ready: "Ready for pickup",
    payment: "Payment reminder",
};

function channelUrl(channel: NotificationChannel, recipient: string, subject: string, message: string) {
    const encodedMessage = encodeURIComponent(message);
    const encodedSubject = encodeURIComponent(subject || "FixHub update");
    const normalizedPhone = recipient.replace(/[^\d+]/g, "");

    if (channel === "WhatsApp") {
        return `https://wa.me/${normalizedPhone.replace(/^\+/, "")}?text=${encodedMessage}`;
    }

    if (channel === "SMS") {
        return `sms:${normalizedPhone}?&body=${encodedMessage}`;
    }

    return `mailto:${recipient}?subject=${encodedSubject}&body=${encodedMessage}`;
}

function RepairCommunicationPanel({ repair }: CommunicationPanelProps) {
    const [template, setTemplate] = useState<NotificationTemplate>("status");
    const [channel, setChannel] = useState<NotificationChannel>("WhatsApp");
    const [recipient, setRecipient] = useState("");
    const [subject, setSubject] = useState("");
    const [message, setMessage] = useState("");
    const [logs, setLogs] = useState<NotificationLog[]>([]);
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    useEffect(() => {
        let active = true;

        async function loadDraft() {
            setLoading(true);
            setError("");

            try {
                const [draft, logData] = await Promise.all([
                    getNotificationDraft(repair.id, template),
                    getNotificationLogs(repair.id),
                ]);

                if (!active) {
                    return;
                }

                setSubject(draft.subject);
                setMessage(draft.message);
                setRecipient(draft.recipients[channel] || "");
                setLogs(logData);
            } catch (requestError) {
                if (active) {
                    setError(
                        requestError instanceof Error
                            ? requestError.message
                            : "Unable to prepare customer message."
                    );
                }
            } finally {
                if (active) {
                    setLoading(false);
                }
            }
        }

        loadDraft();

        return () => {
            active = false;
        };
    }, [channel, repair.id, template]);

    async function handleLaunch(status: "Prepared" | "Sent") {
        setError("");
        setSuccess("");
        setSending(true);

        try {
            const log = await createNotificationLog({
                repairId: repair.id,
                channel,
                recipient,
                subject,
                message,
                status,
            });

            setLogs((current) => [log, ...current]);

            if (status === "Sent") {
                window.open(channelUrl(channel, recipient, subject, message), "_blank", "noopener,noreferrer");
                setSuccess(
                    log.persisted === false
                        ? `${channel} opened. Run the database migration to save communication history.`
                        : `${channel} message opened and logged.`
                );
            } else {
                setSuccess(
                    log.persisted === false
                        ? "Draft prepared. Run the database migration to save communication history."
                        : "Message saved to the communication log."
                );
            }
        } catch (requestError) {
            setError(
                requestError instanceof Error
                    ? requestError.message
                    : "Unable to log customer message."
            );
        } finally {
            setSending(false);
        }
    }

    return (
        <section className="communication-panel">
            <div className="form-section-heading">
                <h2>Customer updates</h2>
                <p>Prepare WhatsApp, SMS, or email messages and keep a record.</p>
            </div>

            {error && <p className="form-error">{error}</p>}
            {success && <p className="form-success">{success}</p>}

            <div className="communication-controls">
                <label>
                    Template
                    <select
                        value={template}
                        onChange={(event) =>
                            setTemplate(event.target.value as NotificationTemplate)
                        }
                    >
                        {NOTIFICATION_TEMPLATES.map((option) => (
                            <option key={option} value={option}>
                                {TEMPLATE_LABELS[option]}
                            </option>
                        ))}
                    </select>
                </label>

                <label>
                    Channel
                    <select
                        value={channel}
                        onChange={(event) =>
                            setChannel(event.target.value as NotificationChannel)
                        }
                    >
                        {NOTIFICATION_CHANNELS.map((option) => (
                            <option key={option} value={option}>
                                {option}
                            </option>
                        ))}
                    </select>
                </label>
            </div>

            {loading ? (
                <p className="loading-state">Preparing message...</p>
            ) : (
                <div className="message-composer">
                    <label>
                        Recipient
                        <input
                            value={recipient}
                            onChange={(event) => setRecipient(event.target.value)}
                            placeholder={channel === "Email" ? "customer@email.com" : "+234..."}
                        />
                    </label>

                    <label>
                        Subject
                        <input
                            value={subject}
                            onChange={(event) => setSubject(event.target.value)}
                        />
                    </label>

                    <label>
                        Message
                        <textarea
                            rows={7}
                            value={message}
                            onChange={(event) => setMessage(event.target.value)}
                        />
                    </label>

                    <div className="communication-actions">
                        <button
                            type="button"
                            className="secondary-action"
                            onClick={() => handleLaunch("Prepared")}
                            disabled={sending}
                        >
                            Save draft
                        </button>
                        <button
                            type="button"
                            className="primary-message-action"
                            onClick={() => handleLaunch("Sent")}
                            disabled={sending}
                        >
                            {sending ? "Opening..." : `Open ${channel}`}
                        </button>
                    </div>
                </div>
            )}

            <div className="communication-log">
                <h3>Recent messages</h3>
                {logs.length === 0 ? (
                    <p>No customer messages logged yet.</p>
                ) : (
                    <ol>
                        {logs.slice(0, 5).map((entry) => (
                            <li key={entry.id}>
                                <span>{entry.channel}</span>
                                <strong>{entry.status}</strong>
                                <time>{new Date(entry.createdAt).toLocaleString()}</time>
                            </li>
                        ))}
                    </ol>
                )}
            </div>
        </section>
    );
}

export default RepairCommunicationPanel;
