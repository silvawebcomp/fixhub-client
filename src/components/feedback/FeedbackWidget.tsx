import "./FeedbackWidget.css";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useLocation } from "react-router-dom";

import { createFeedback } from "../../services/feedbackService";
import { FEEDBACK_CATEGORIES } from "../../types/feedback";
import type { FeedbackCategory } from "../../types/feedback";

const DEFAULT_CATEGORY: FeedbackCategory = "Confusing";

function FeedbackWidget() {
    const location = useLocation();
    const [isOpen, setIsOpen] = useState(false);
    const [category, setCategory] = useState<FeedbackCategory>(DEFAULT_CATEGORY);
    const [rating, setRating] = useState<number | null>(4);
    const [message, setMessage] = useState("");
    const [contactConsent, setContactConsent] = useState(true);
    const [successMessage, setSuccessMessage] = useState("");

    const mutation = useMutation({
        mutationFn: createFeedback,
        onSuccess() {
            setMessage("");
            setCategory(DEFAULT_CATEGORY);
            setRating(4);
            setContactConsent(true);
            setSuccessMessage("Thanks. Your feedback was added to the V1 beta queue.");
        },
    });

    function closePanel() {
        setIsOpen(false);
        setSuccessMessage("");
        mutation.reset();
    }

    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setSuccessMessage("");
        mutation.mutate({
            category,
            rating,
            message,
            contactConsent,
            page: `${location.pathname}${location.search}`,
        });
    }

    return (
        <div className="feedback-widget">
            {isOpen && (
                <section className="feedback-panel" aria-label="Send FixHub feedback">
                    <div className="feedback-panel__header">
                        <div>
                            <p>V1 beta feedback</p>
                            <h2>What should we improve?</h2>
                        </div>
                        <button type="button" onClick={closePanel} aria-label="Close feedback">
                            X
                        </button>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <label>
                            Category
                            <select
                                value={category}
                                onChange={(event) =>
                                    setCategory(event.target.value as FeedbackCategory)
                                }
                            >
                                {FEEDBACK_CATEGORIES.map((item) => (
                                    <option key={item} value={item}>
                                        {item}
                                    </option>
                                ))}
                            </select>
                        </label>

                        <label>
                            Usefulness rating
                            <div className="feedback-rating" aria-label="Usefulness rating">
                                {[1, 2, 3, 4, 5].map((value) => (
                                    <button
                                        type="button"
                                        className={rating === value ? "is-selected" : ""}
                                        key={value}
                                        onClick={() => setRating(value)}
                                    >
                                        {value}
                                    </button>
                                ))}
                            </div>
                        </label>

                        <label>
                            Feedback
                            <textarea
                                value={message}
                                onChange={(event) => setMessage(event.target.value)}
                                minLength={10}
                                maxLength={2000}
                                placeholder="Tell us what confused you, what broke, or what would make FixHub easier to use."
                                required
                            />
                        </label>

                        <label className="feedback-consent">
                            <input
                                type="checkbox"
                                checked={contactConsent}
                                onChange={(event) => setContactConsent(event.target.checked)}
                            />
                            You can contact me about this feedback.
                        </label>

                        {mutation.isError && (
                            <p className="feedback-error">{mutation.error.message}</p>
                        )}

                        {successMessage && (
                            <p className="feedback-success">{successMessage}</p>
                        )}

                        <button
                            className="feedback-submit"
                            type="submit"
                            disabled={mutation.isPending}
                        >
                            {mutation.isPending ? "Sending..." : "Send feedback"}
                        </button>
                    </form>
                </section>
            )}

            {!isOpen && (
                <button
                    className="feedback-trigger"
                    type="button"
                    onClick={() => setIsOpen(true)}
                >
                    Send feedback
                </button>
            )}
        </div>
    );
}

export default FeedbackWidget;
