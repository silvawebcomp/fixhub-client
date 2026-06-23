import "./Hero.css";

import { useNavigate } from "react-router-dom";
import heroImage from "../../assets/hero.png";

function Hero() {

    const navigate = useNavigate();

    return (

        <section className="hero">

            <nav className="landing-nav">
                <button
                    className="brand-mark"
                    onClick={() => navigate("/")}
                >
                    FixHub
                </button>

                <div className="landing-nav-actions">
                    <button onClick={() => navigate("/login")}>
                        Login
                    </button>
                    <button
                        className="nav-primary"
                        onClick={() => navigate("/register")}
                    >
                        Start Free
                    </button>
                </div>
            </nav>

            <div className="hero-content">

                <p className="hero-kicker">Repair business command center</p>

                <h1>

                    Run repairs, customers, and parts from one clean workspace.

                </h1>

                <p>

                    The complete platform for repair technicians
                    and gadget companies to manage repairs,
                    inventory, customer history, and daily shop performance.

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

                <div className="hero-proof">
                    <span>Repair queue</span>
                    <span>Customer records</span>
                    <span>Inventory value</span>
                </div>

            </div>

            <div className="hero-visual" aria-label="FixHub dashboard preview">
                <img
                    src={heroImage}
                    alt="FixHub dashboard preview"
                />
                <div className="preview-panel">
                    <div>
                        <span>Active repairs</span>
                        <strong>24</strong>
                    </div>
                    <div>
                        <span>Waiting parts</span>
                        <strong>6</strong>
                    </div>
                    <div>
                        <span>Ready today</span>
                        <strong>9</strong>
                    </div>
                </div>
            </div>

        </section>

    );

}

export default Hero;
