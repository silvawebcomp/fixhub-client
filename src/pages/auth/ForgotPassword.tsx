import "./PasswordReset.css";

import {
    type FormEvent,
    useState,
} from "react";
import {
    Link,
    useNavigate,
} from "react-router-dom";

import { requestPasswordReset } from "../../services/authService";

function ForgotPassword() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        setLoading(true);
        setMessage("");
        setErrorMessage("");

        try {
            const result = await requestPasswordReset({
                email,
            });

            setMessage(result.message);
            navigate(
                `/reset-password?email=${encodeURIComponent(email)}`,
                {
                    state: {
                        maskedEmail: result.maskedEmail,
                        expiresInMinutes: result.expiresInMinutes,
                    },
                }
            );
        } catch (error) {
            setErrorMessage(
                error instanceof Error
                    ? error.message
                    : "Unable to send reset code."
            );
        } finally {
            setLoading(false);
        }
    }

    return (
        <main className="password-reset-page">
            <section className="password-reset-card">
                <Link
                    className="password-reset-back"
                    to="/login"
                >
                    Back to login
                </Link>

                <div className="password-reset-brand">
                    FIXHUB
                </div>

                <h1>Forgot your password?</h1>

                <p>
                    Enter your FixHub email address and we will send you a
                    six-digit reset code.
                </p>

                <div className="password-reset-divider" />

                {message && (
                    <div className="password-reset-success">
                        {message}
                    </div>
                )}

                {errorMessage && (
                    <div className="password-reset-error">
                        {errorMessage}
                    </div>
                )}

                <form
                    className="password-reset-form"
                    onSubmit={handleSubmit}
                >
                    <label htmlFor="reset-email">
                        Email Address *
                    </label>
                    <input
                        id="reset-email"
                        type="email"
                        value={email}
                        onChange={(event) =>
                            setEmail(event.target.value)
                        }
                        required
                    />

                    <div className="password-reset-notice">
                        The code expires soon. Requesting another code will
                        invalidate the previous one.
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                    >
                        {loading ? "Sending..." : "Send reset code"}
                    </button>
                </form>

                <div className="password-reset-secure">
                    Your data is protected with industry-standard security.
                </div>
            </section>
        </main>
    );
}

export default ForgotPassword;
