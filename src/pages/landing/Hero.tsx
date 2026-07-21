import "./Hero.css";

import { useNavigate } from "react-router-dom";
import heroImage from "../../assets/hero.png";

const productSignals = [
    { label: "Open jobs", value: "24", trend: "6 waiting parts" },
    { label: "Ready for pickup", value: "9", trend: "Customers notified" },
    { label: "Inventory value", value: "NGN 2.8M", trend: "Across branches" },
];

const workflowRows = [
    { status: "Diagnosing", ticket: "FH-1028", customer: "Aisha Bello", eta: "Today" },
    { status: "Needs approval", ticket: "FH-1031", customer: "Daniel Okafor", eta: "2 hrs" },
    { status: "Ready", ticket: "FH-1034", customer: "Mary Johnson", eta: "Pickup" },
];

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

                <div className="landing-nav-links" aria-label="Landing sections">
                    <a href="#product">Product</a>
                    <a href="#workflow">Workflow</a>
                    <a href="#operations">Operations</a>
                    <a href="#pricing">Pricing</a>
                </div>

                <div className="landing-nav-actions">
                    <button onClick={() => navigate("/track")}>
                        Track Repair
                    </button>
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

                <h1>

                    FixHub is the operating system for modern repair shops

                </h1>

                <p>

                    Give technicians, front desk teams, managers, and customers one
                    professional workspace for repair tickets, stock control,
                    invoices, branch visibility, and real-time service updates.

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
                        onClick={() => navigate("/track")}
                    >
                        Track a Repair
                    </button>

                </div>

                <div className="hero-proof">
                    <span>Repair queue</span>
                    <span>Customer portal</span>
                    <span>Inventory ledger</span>
                    <span>Invoices and payments</span>
                </div>

            </div>

            <div className="hero-visual" aria-label="FixHub dashboard preview">
                <div className="hero-product-shell">
                    <div className="hero-product-topbar">
                        <span />
                        <span />
                        <span />
                        <strong>Live operations desk</strong>
                    </div>

                    <div className="hero-product-grid">
                        <div className="hero-product-main">
                            <div className="repair-board-header">
                                <div>
                                    <span>Repair queue</span>
                                    <strong>Today at a glance</strong>
                                </div>
                                <button onClick={() => navigate("/register")}>New shop</button>
                            </div>

                            <div className="signal-grid">
                                {productSignals.map((signal) => (
                                    <div className="signal-card" key={signal.label}>
                                        <span>{signal.label}</span>
                                        <strong>{signal.value}</strong>
                                        <small>{signal.trend}</small>
                                    </div>
                                ))}
                            </div>

                            <div className="repair-table" aria-label="Repair queue preview">
                                {workflowRows.map((row) => (
                                    <div className="repair-row" key={row.ticket}>
                                        <span className="ticket-code">{row.ticket}</span>
                                        <span>{row.customer}</span>
                                        <strong>{row.status}</strong>
                                        <small>{row.eta}</small>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <aside className="hero-customer-panel">
                            <div className="asset-mark">
                                <img src={heroImage} alt="" />
                            </div>
                            <span>Customer tracking</span>
                            <strong>Public repair updates without phone calls</strong>
                            <div className="timeline-mini">
                                <i />
                                <i />
                                <i />
                                <i />
                            </div>
                            <p>Checked in - Diagnosing - In repair - Ready</p>
                        </aside>
                    </div>
                </div>
            </div>

        </section>

    );

}

export default Hero;
