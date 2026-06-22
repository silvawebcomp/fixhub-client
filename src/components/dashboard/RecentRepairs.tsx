import "./RecentRepairs.css";

import { useEffect, useState } from "react";

import { getRepairs } from "../../services/repairService";
import type { Repair } from "../../types/repair";

function RecentRepairs() {
    const [repairs, setRepairs] = useState<Repair[]>([]);

    useEffect(() => {
        async function loadRepairs() {
            try {
                const data = await getRepairs();
                setRepairs(data.slice(0, 5));
            } catch (error) {
                console.error(error);
            }
        }

        void loadRepairs();
    }, []);

    return (
        <section className="recent-repairs">
            <h2>Recent Repairs</h2>

            {repairs.length === 0 ? (
                <p className="muted-state">No repairs yet.</p>
            ) : (
                repairs.map((repair) => (
                    <div className="repair-item" key={repair.id}>
                        <h3>{repair.device}</h3>
                        <span>{repair.status}</span>
                    </div>
                ))
            )}
        </section>
    );
}

export default RecentRepairs;
