import "./Features.css"

function Features() {

    return (

        <section className="features">

            <h2>Everything you need to run your business.</h2>

            <div className="feature-grid">

                <div className="card">
                    <h3>⚡ Fast Order Management</h3>
                    <p>Create and manage repair tickets in seconds.</p>
                </div>

                <div className="card">
                    <h3>📦 Inventory Tracking</h3>
                    <p>Track gadgets and spare parts with ease.</p>
                </div>

                <div className="card">
                    <h3>👥 Customer Management</h3>
                    <p>Keep complete customer history forever.</p>
                </div>

                <div className="card">
                    <h3>📈 Business Analytics</h3>
                    <p>Monitor revenue and business performance.</p>
                </div>

            </div>

        </section>

    )

}

export default Features