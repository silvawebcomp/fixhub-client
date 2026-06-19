import "./Login.css";

import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { loginUser } from "../../services/authService";
import { useAuth } from "../../hooks/useAuth";

function Login() {

    const navigate = useNavigate();

    const { login } = useAuth();

    const [email, setEmail] = useState("");

    const [password, setPassword] = useState("");

    const [loading, setLoading] = useState(false);

    async function handleSubmit(

        event: React.FormEvent<HTMLFormElement>

    ) {

        event.preventDefault();

        setLoading(true);

        try {

            const response = await loginUser({
    email,
    password,
});

localStorage.setItem(
    "fixhub-token",
    response.token
);

login(response.user);

navigate("/dashboard");

        }

        catch (error) {

            console.error(error);

            alert("Login failed.");

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

                            ? "Signing In..."

                            : "Login"

                    }

                </button>

            </form>

        </main>

    );

}

export default Login;