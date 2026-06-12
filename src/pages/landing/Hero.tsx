import "./Hero.css"

function Hero() {
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

                    <button className="primary">
                        Start Free
                    </button>

                    <button className="secondary">
                        Book Demo
                    </button>

                </div>

            </div>

        </section>
    )
}

export default Hero