import "./Register.css";

import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { registerUser } from "../../services/authService";
import { useAuth } from "../../hooks/useAuth";

function Register() {

    const navigate = useNavigate();
    const { login } = useAuth();

    const [name, setName] = useState("");

    const [email, setEmail] = useState("");

    const [password, setPassword] = useState("");

    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    async function handleSubmit(
        event: React.FormEvent<HTMLFormElement>
    ) {

        event.preventDefault();

        setErrorMessage("");
        setLoading(true);

        try {

            const response = await registerUser({
                name,
                email,
                password,
            });

            login(response.user, response.token);

            navigate("/dashboard");

        } catch (error) {

            console.error(error);

            setErrorMessage(
                error instanceof Error
                    ? error.message
                    : "Registration failed."
            );

        } finally {

            setLoading(false);

        }

    }

    return (

        <main className="register-page">

            <form
                className="register-form"
                onSubmit={handleSubmit}
            >

                <h1>Create Account</h1>

                <p className="auth-subtitle">
                    Start tracking repairs, customers, and inventory in minutes.
                </p>

                {errorMessage && (
                    <p className="auth-error">
                        {errorMessage}
                    </p>
                )}

                <input
                    type="text"
                    placeholder="Full Name"
                    value={name}
                    onChange={(event) =>
                        setName(event.target.value)
                    }
                    required
                />

                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(event) =>
                        setEmail(event.target.value)
                    }
                    required
                />

                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(event) =>
                        setPassword(event.target.value)
                    }
                    required
                />

                <button
                    type="submit"
                    disabled={loading}
                >

                    {

                        loading

                            ? "Creating..."

                            : "Register"

                    }

                </button>

            </form>

        </main>

    );

}

export default Register;
