import "./Login.css";

import { useState } from "react";
import {
    Link,
    useNavigate,
} from "react-router-dom";

import { loginUser } from "../../services/authService";
import { useAuth } from "../../hooks/useAuth";

function Login() {

    const navigate = useNavigate();

    const { login } = useAuth();

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

            const response = await loginUser({
                email,
                password,
            });

            login(response.user, response.token);

navigate("/dashboard");

        }

        catch (error) {

            console.error(error);

            setErrorMessage(
                error instanceof Error
                    ? error.message
                    : "Login failed."
            );

        }

        finally {

            setLoading(false);

        }

    }

    return (

        <main className="login-page">

            <form

                className="login-form"

                onSubmit={handleSubmit}

            >

                <h1>

                    Welcome Back

                </h1>

                <p className="auth-subtitle">
                    Sign in to manage your repair desk.
                </p>

                {errorMessage && (
                    <p className="auth-error">
                        {errorMessage}
                    </p>
                )}

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

                <div className="auth-help-row">
                    <Link to="/forgot-password">
                        Forgot password?
                    </Link>
                </div>

                <button

                    type="submit"

                    disabled={loading}

                >

                    {

                        loading

                            ? "Signing In..."

                            : "Login"

                    }

                </button>

            </form>

        </main>

    );

}

export default Login;
