import "./RecentRepairs.css";

import { recentRepairs } from "../../data/dashboard";

function RecentRepairs() {
    return (

        <section className="recent-repairs">

            <h2>Recent Repairs</h2>

            {recentRepairs.map((repair, index) => (

                <div
                    className="repair-item"
                    key={index}
                >

                    <h3>{repair.device}</h3>

                    <span>{repair.status}</span>

                </div>

            ))}

        </section>

    );
}

export default RecentRepairs;