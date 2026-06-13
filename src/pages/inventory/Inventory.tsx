import "./Inventory.css";

import DashboardLayout from "../../layouts/DashboardLayout";
import Topbar from "../../components/dashboard/Topbar";

function Inventory() {
    return (

        <DashboardLayout>

            <Topbar />

            <main className="inventory-page">

                <h2>Inventory</h2>

                <div className="inventory-grid">

                    <div className="inventory-card">

                        <h3>Phone Screens</h3>

                        <p>42 Available</p>

                    </div>

                    <div className="inventory-card">

                        <h3>Batteries</h3>

                        <p>31 Available</p>

                    </div>

                    <div className="inventory-card">

                        <h3>Charging Ports</h3>

                        <p>18 Available</p>

                    </div>

                    <div className="inventory-card">

                        <h3>Speakers</h3>

                        <p>24 Available</p>

                    </div>

                </div>

            </main>

        </DashboardLayout>

    );
}

export default Inventory;