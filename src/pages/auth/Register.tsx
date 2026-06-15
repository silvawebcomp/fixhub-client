import "./Register.css";

import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { registerUser } from "../../services/authService";

function Register() {

    const navigate = useNavigate();

    const [name, setName] = useState("");

    const [email, setEmail] = useState("");

    const [password, setPassword] = useState("");

    const [loading, setLoading] = useState(false);

    async function handleSubmit(
        event: React.FormEvent<HTMLFormElement>
    ) {

        event.preventDefault();

        setLoading(true);

        try {

            await registerUser({

                name,

                email,

                password,

            });

            alert("Registration successful.");

            navigate("/login");

        } catch (error) {

            console.error(error);

            alert("Registration failed.");

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