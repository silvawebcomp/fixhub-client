import "./Hero.css";

import { useNavigate } from "react-router-dom";

function Hero() {

    const navigate = useNavigate();

    return (

        <section className="hero">

            <div className="hero-content">

                <h1>

                    Manage Repairs.

                    <br />

                    Track Customers.

                    <br />

                    Grow Your Business.

                </h1>

                <p>

                    The complete platform for repair technicians
                    and gadget companies to manage repairs,
                    inventory and customer relationships.

                </p>

                <div className="hero-buttons">

                    <button
                        className="primary"
                        onClick={() => navigate("/register")}
                    >
                        Start Free
                    </button>

                    <button
                        className="secondary"
                        onClick={() => navigate("/login")}
                    >
                        Login
                    </button>

                </div>

            </div>

        </section>

    );

}

export default Hero;