import "./Feedback.css";

import { useMemo } from "react";
import {
    useMutation,
    useQuery,
    useQueryClient,
} from "@tanstack/react-query";

import DashboardLayout from "../../layouts/DashboardLayout";
import {
    getFeedback,
    updateFeedbackStatus,
} from "../../services/feedbackService";
import {
    FEEDBACK_STATUSES,
} from "../../types/feedback";
import type {
    BetaFeedback,
    FeedbackStatus,
} from "../../types/feedback";

function formatDate(value: string) {
    return new Intl.DateTimeFormat(undefined, {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    }).format(new Date(value));
}

function scoreAverage(items: BetaFeedback[]) {
    const scored = items.filter((item) => item.rating);

    if (scored.length === 0) {
        return "No score";
    }

    const total = scored.reduce((sum, item) => sum + (item.rating ?? 0), 0);
    return `${(total / scored.length).toFixed(1)}/5`;
}

function FeedbackPage() {
    const queryClient = useQueryClient();
    const feedbackQuery = useQuery({
        queryKey: ["feedback"],
        queryFn: getFeedback,
    });
    const statusMutation = useMutation({
        mutationFn: ({
            id,
            status,
        }: {
            id: number;
            status: FeedbackStatus;
        }) => updateFeedbackStatus(id, status),
        onSuccess() {
            queryClient.invalidateQueries({
                queryKey: ["feedback"],
            });
        },
    });

    const feedback = useMemo(
        () => feedbackQuery.data ?? [],
        [feedbackQuery.data]
    );
    const summary = useMemo(() => {
        const open = feedback.filter(
            (item) => item.status === "New" || item.status === "Reviewing"
        ).length;
        const planned = feedback.filter((item) => item.status === "Planned").length;
        const bugs = feedback.filter((item) => item.category === "Bug").length;

        return {
            open,
            planned,
            bugs,
            score: scoreAverage(feedback),
        };
    }, [feedback]);

    return (
        <DashboardLayout>
            <section className="feedback-page">
                <header className="feedback-hero">
                    <div>
                        <p className="eyebrow">V1 beta launch kit</p>
                        <h1>Feedback loop</h1>
                        <p>
                            Review what early users are reporting, identify repeated
                            friction, and decide what belongs in the next FixHub sprint.
                        </p>
                    </div>
                </header>

                <section className="feedback-summary" aria-label="Feedback summary">
                    <article>
                        <span>Open feedback</span>
                        <strong>{summary.open}</strong>
                    </article>
                    <article>
                        <span>Planned improvements</span>
                        <strong>{summary.planned}</strong>
                    </article>
                    <article>
                        <span>Bug reports</span>
                        <strong>{summary.bugs}</strong>
                    </article>
                    <article>
                        <span>Usefulness score</span>
                        <strong>{summary.score}</strong>
                    </article>
                </section>

                <section className="beta-kit-panel">
                    <div>
                        <p className="eyebrow">Launch rhythm</p>
                        <h2>Run this every week during beta</h2>
                    </div>
                    <ol>
                        <li>Onboard 5 repair shops manually.</li>
                        <li>Watch each shop create one repair and one invoice.</li>
                        <li>Tag every complaint as bug, confusing, feature request, or praise.</li>
                        <li>Fix repeated blockers before adding large new features.</li>
                    </ol>
                </section>

                {feedbackQuery.isLoading && (
                    <p className="feedback-state">Loading feedback...</p>
                )}

                {feedbackQuery.isError && (
                    <p className="feedback-state feedback-state--error">
                        Unable to load feedback.
                    </p>
                )}

                <section className="feedback-list" aria-label="Submitted feedback">
                    {feedback.length === 0 && !feedbackQuery.isLoading ? (
                        <p className="feedback-state">
                            No feedback yet. Ask beta users to click Send feedback inside
                            their workspace.
                        </p>
                    ) : (
                        feedback.map((item) => (
                            <article className="feedback-card" key={item.id}>
                                <div className="feedback-card__top">
                                    <div>
                                        <span>{item.category}</span>
                                        <h2>{item.authorName || "FixHub user"}</h2>
                                        <p>
                                            {item.authorEmail || "No email"} -{" "}
                                            {formatDate(item.createdAt)}
                                        </p>
                                    </div>
                                    <select
                                        value={item.status}
                                        onChange={(event) =>
                                            statusMutation.mutate({
                                                id: item.id,
                                                status: event.target.value as FeedbackStatus,
                                            })
                                        }
                                    >
                                        {FEEDBACK_STATUSES.map((status) => (
                                            <option value={status} key={status}>
                                                {status}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <p className="feedback-message">{item.message}</p>

                                <dl className="feedback-meta">
                                    <div>
                                        <dt>Page</dt>
                                        <dd>{item.page || "Not captured"}</dd>
                                    </div>
                                    <div>
                                        <dt>Rating</dt>
                                        <dd>{item.rating ? `${item.rating}/5` : "No rating"}</dd>
                                    </div>
                                    <div>
                                        <dt>Contact</dt>
                                        <dd>{item.contactConsent ? "Allowed" : "No follow-up"}</dd>
                                    </div>
                                </dl>
                            </article>
                        ))
                    )}
                </section>
            </section>
        </DashboardLayout>
    );
}

export default FeedbackPage;
