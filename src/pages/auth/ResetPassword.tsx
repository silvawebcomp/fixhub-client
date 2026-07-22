import "./PasswordReset.css";

import {
    type ChangeEvent,
    type FormEvent,
    useMemo,
    useRef,
    useState,
} from "react";
import {
    Link,
    useLocation,
    useNavigate,
    useSearchParams,
} from "react-router-dom";

import {
    requestPasswordReset,
    resetPassword,
} from "../../services/authService";

type ResetLocationState = {
    maskedEmail?: string;
    expiresInMinutes?: number;
};

const CODE_DIGIT_KEYS = [
    "first",
    "second",
    "third",
    "fourth",
    "fifth",
    "sixth",
];

function ResetPassword() {
    const navigate = useNavigate();
    const location = useLocation();
    const [searchParams] = useSearchParams();
    const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

    const state = (location.state || {}) as ResetLocationState;
    const initialEmail = searchParams.get("email") || "";

    const [email, setEmail] = useState(initialEmail);
    const [codeDigits, setCodeDigits] = useState<string[]>(
        Array.from({ length: 6 }, () => "")
    );
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [resending, setResending] = useState(false);
    const [message, setMessage] = useState(
        state.maskedEmail
            ? `If an account exists for ${state.maskedEmail}, a reset code has been sent.`
            : ""
    );
    const [errorMessage, setErrorMessage] = useState("");

    const code = useMemo(
        () => codeDigits.join(""),
        [codeDigits]
    );

    function updateDigit(index: number, value: string) {
        const digit = value.replace(/\D/g, "").slice(-1);

        setCodeDigits((current) =>
            current.map((item, itemIndex) =>
                itemIndex === index ? digit : item
            )
        );

        if (digit && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    }

    function handleDigitChange(
        index: number,
        event: ChangeEvent<HTMLInputElement>
    ) {
        const value = event.target.value.replace(/\D/g, "");

        if (value.length > 1) {
            const nextDigits = Array.from({ length: 6 }, (_, itemIndex) =>
                value[itemIndex] || codeDigits[itemIndex] || ""
            );

            setCodeDigits(nextDigits);
            inputRefs.current[Math.min(value.length, 6) - 1]?.focus();
            return;
        }

        updateDigit(index, value);
    }

    async function handleResend() {
        setResending(true);
        setErrorMessage("");
        setMessage("");

        try {
            const result = await requestPasswordReset({
                email,
            });

            setMessage(result.message);
            setCodeDigits(Array.from({ length: 6 }, () => ""));
            inputRefs.current[0]?.focus();
        } catch (error) {
            setErrorMessage(
                error instanceof Error
                    ? error.message
                    : "Unable to send another code."
            );
        } finally {
            setResending(false);
        }
    }

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        setLoading(true);
        setMessage("");
        setErrorMessage("");

        if (password !== confirmPassword) {
            setErrorMessage("Passwords do not match.");
            setLoading(false);
            return;
        }

        try {
            const result = await resetPassword({
                email,
                code,
                password,
            });

            setMessage(result.message);
            setTimeout(() => navigate("/login"), 900);
        } catch (error) {
            setErrorMessage(
                error instanceof Error
                    ? error.message
                    : "Unable to update password."
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
                    to="/forgot-password"
                >
                    Start again
                </Link>

                <div className="password-reset-brand">
                    FIXHUB
                </div>

                <h1>Reset your password</h1>

                <p>
                    Enter the six-digit code from your email and choose a new
                    password.
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
                    <label htmlFor="reset-confirm-email">
                        Email Address *
                    </label>
                    <input
                        id="reset-confirm-email"
                        type="email"
                        value={email}
                        onChange={(event) =>
                            setEmail(event.target.value)
                        }
                        required
                    />

                    <label>
                        Six-digit reset code
                    </label>
                    <div className="password-reset-code-row">
                        {codeDigits.map((digit, index) => (
                            <input
                                key={CODE_DIGIT_KEYS[index]}
                                ref={(element) => {
                                    inputRefs.current[index] = element;
                                }}
                                type="text"
                                inputMode="numeric"
                                autoComplete="one-time-code"
                                maxLength={1}
                                value={digit}
                                onChange={(event) =>
                                    handleDigitChange(index, event)
                                }
                                aria-label={`Reset code digit ${index + 1}`}
                            />
                        ))}
                    </div>

                    <button
                        className="password-reset-secondary"
                        type="button"
                        onClick={handleResend}
                        disabled={resending || !email}
                    >
                        {resending ? "Sending..." : "Send another code"}
                    </button>

                    <label htmlFor="new-password">
                        New Password *
                    </label>
                    <input
                        id="new-password"
                        type="password"
                        value={password}
                        onChange={(event) =>
                            setPassword(event.target.value)
                        }
                        minLength={8}
                        placeholder="Min. 8 characters"
                        required
                    />

                    <label htmlFor="confirm-new-password">
                        Confirm New Password *
                    </label>
                    <input
                        id="confirm-new-password"
                        type="password"
                        value={confirmPassword}
                        onChange={(event) =>
                            setConfirmPassword(event.target.value)
                        }
                        placeholder="Re-enter password"
                        required
                    />

                    <button
                        type="submit"
                        disabled={loading || code.length !== 6}
                    >
                        {loading ? "Updating..." : "Update password"}
                    </button>
                </form>

                <div className="password-reset-secure">
                    Your data is protected with industry-standard security.
                </div>
            </section>
        </main>
    );
}

export default ResetPassword;
