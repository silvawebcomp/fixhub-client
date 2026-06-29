import "./Communications.css";

import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import DashboardLayout from "../../layouts/DashboardLayout";
import {
    getNotificationLogs,
    type NotificationLog,
} from "../../services/notificationService";

function Communications() {
    const [logs, setLogs] = useState<NotificationLog[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        getNotificationLogs()
            .then(setLogs)
            .catch((requestError) => {
                setError(
                    requestError instanceof Error
                        ? requestError.message
                        : "Unable to load communications."
                );
            })
            .finally(() => setLoading(false));
    }, []);

    const totals = useMemo(
        () =>
            logs.reduce(
                (summary, log) => ({
                    WhatsApp: summary.WhatsApp + (log.channel === "WhatsApp" ? 1 : 0),
                    SMS: summary.SMS + (log.channel === "SMS" ? 1 : 0),
                    Email: summary.Email + (log.channel === "Email" ? 1 : 0),
                }),
                {
                    WhatsApp: 0,
                    SMS: 0,
                    Email: 0,
                }
            ),
        [logs]
    );

    return (
        <DashboardLayout>
            <section className="communications-page">
                <header className="communications-header">
                    <div>
                        <p className="eyebrow">Customer care</p>
                        <h2>Communications</h2>
                        <p>Review customer updates sent from repair tickets.</p>
                    </div>
                </header>

                <section className="communication-metrics">
                    <div>
                        <span>WhatsApp</span>
                        <strong>{totals.WhatsApp}</strong>
                    </div>
                    <div>
                        <span>SMS</span>
                        <strong>{totals.SMS}</strong>
                    </div>
                    <div>
                        <span>Email</span>
                        <strong>{totals.Email}</strong>
                    </div>
                </section>

                {loading && <p className="loading-state">Loading messages...</p>}
                {error && <p className="form-error">{error}</p>}

                {!loading && !error && logs.length === 0 && (
                    <div className="empty-state">
                        <p>No customer communications have been logged yet.</p>
                    </div>
                )}

                {!loading && logs.length > 0 && (
                    <section className="communications-table">
                        <table>
                            <thead>
                                <tr>
                                    <th>Channel</th>
                                    <th>Customer</th>
                                    <th>Message</th>
                                    <th>Status</th>
                                    <th>Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {logs.map((log) => (
                                    <tr key={log.id}>
                                        <td>
                                            <span className="channel-pill">
                                                {log.channel}
                                            </span>
                                        </td>
                                        <td>
                                            {log.repair ? (
                                                <Link to={`/repairs/${log.repair.id}`}>
                                                    {log.repair.customer}
                                                </Link>
                                            ) : (
                                                log.recipient
                                            )}
                                            {log.repair?.ticketNumber && (
                                                <small>{log.repair.ticketNumber}</small>
                                            )}
                                        </td>
                                        <td>
                                            <strong>{log.subject || "FixHub update"}</strong>
                                            <p>{log.message}</p>
                                        </td>
                                        <td>{log.status}</td>
                                        <td>{new Date(log.createdAt).toLocaleString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </section>
                )}
            </section>
        </DashboardLayout>
    );
}

export default Communications;
