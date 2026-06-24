import "./TrackRepair.css";

import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

import { trackRepair } from "../../services/trackingService";
import type { PublicRepair } from "../../types/tracking";

function formatMoney(value: number | null) {
    if (value === null) {
        return "Not available";
    }

    return new Intl.NumberFormat("en-NG", {
        style: "currency",
        currency: "NGN",
        maximumFractionDigits: 0,
    }).format(value);
}

function statusClass(status: string) {
    return `status status-${status.toLowerCase().replaceAll(" ", "-")}`;
}

function TrackRepair() {
    const [searchParams] = useSearchParams();
    const [ticketNumber, setTicketNumber] = useState(
        searchParams.get("ticket")?.toUpperCase() ?? ""
    );
    const [contact, setContact] = useState("");
    const [repair, setRepair] = useState<PublicRepair | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setLoading(true);
        setError("");
        setRepair(null);

        try {
            setRepair(await trackRepair(ticketNumber, contact));
        } catch (requestError) {
            setError(
                requestError instanceof Error
                    ? requestError.message
                    : "Unable to track this repair."
            );
        } finally {
            setLoading(false);
        }
    }

    return (
        <main className="tracking-page">
            <nav className="tracking-nav">
                <Link className="tracking-brand" to="/">
                    FixHub
                </Link>
                <Link className="tracking-login" to="/login">
                    Business login
                </Link>
            </nav>

            <section className="tracking-shell">
                <header className="tracking-intro">
                    <p className="eyebrow">Customer repair tracking</p>
                    <h1>Check your repair progress</h1>
                    <p>
                        Enter the ticket number from your repair shop and the
                        phone number or email used at intake.
                    </p>
                </header>

                <form className="tracking-form" onSubmit={handleSubmit}>
                    <label>
                        <span>Ticket number</span>
                        <input
                            value={ticketNumber}
                            onChange={(event) =>
                                setTicketNumber(event.target.value.toUpperCase())
                            }
                            placeholder="FH-20260624-ABC123"
                            autoComplete="off"
                            required
                        />
                    </label>
                    <label>
                        <span>Phone number or email</span>
                        <input
                            value={contact}
                            onChange={(event) => setContact(event.target.value)}
                            placeholder="+234... or name@example.com"
                            autoComplete="email"
                            required
                        />
                    </label>
                    <button type="submit" disabled={loading}>
                        {loading ? "Checking..." : "Track repair"}
                    </button>
                </form>

                <p className="tracking-privacy">
                    Contact verification keeps repair details private.
                </p>

                {error && <p className="tracking-error">{error}</p>}

                {repair && (
                    <section className="tracking-result" aria-live="polite">
                        <div className="tracking-result-header">
                            <div>
                                <span>{repair.ticketNumber}</span>
                                <h2>
                                    {[repair.deviceBrand, repair.deviceModel]
                                        .filter(Boolean)
                                        .join(" ") || repair.device}
                                </h2>
                                <p>Repair for {repair.customer}</p>
                            </div>
                            <strong className={statusClass(repair.status)}>
                                {repair.status}
                            </strong>
                        </div>

                        <div className="tracking-facts">
                            <div>
                                <span>Current status</span>
                                <strong>{repair.status}</strong>
                            </div>
                            <div>
                                <span>Expected date</span>
                                <strong>
                                    {repair.dueDate
                                        ? new Date(
                                              repair.dueDate
                                          ).toLocaleDateString()
                                        : "To be confirmed"}
                                </strong>
                            </div>
                            <div>
                                <span>Estimate</span>
                                <strong>{formatMoney(repair.estimatedCost)}</strong>
                            </div>
                            <div>
                                <span>Final cost</span>
                                <strong>{formatMoney(repair.finalCost)}</strong>
                            </div>
                        </div>

                        {repair.issue && (
                            <div className="tracking-issue">
                                <span>Reported issue</span>
                                <p>{repair.issue}</p>
                            </div>
                        )}

                        <div className="public-timeline">
                            <h3>Progress timeline</h3>
                            <ol>
                                {repair.statusHistory.map((entry) => (
                                    <li key={entry.id}>
                                        <span className="public-timeline-marker" />
                                        <div>
                                            <strong>{entry.status}</strong>
                                            <time>
                                                {new Date(
                                                    entry.createdAt
                                                ).toLocaleString()}
                                            </time>
                                        </div>
                                    </li>
                                ))}
                            </ol>
                        </div>

                        <p className="tracking-updated">
                            Last updated{" "}
                            {new Date(repair.updatedAt).toLocaleString()}
                        </p>
                    </section>
                )}
            </section>
        </main>
    );
}

export default TrackRepair;
