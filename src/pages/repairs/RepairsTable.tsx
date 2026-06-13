import "./RepairsTable.css";

import { repairs } from "../../data/repairs";

function RepairsTable() {

    return (

        <section className="repairs-table">

            <table>

                <thead>

                    <tr>

                        <th>Customer</th>
                        <th>Device</th>
                        <th>Status</th>
                        <th>Date</th>

                    </tr>

                </thead>

                <tbody>

                    {repairs.map((repair) => (

                        <tr key={repair.id}>

                            <td>{repair.customer}</td>

                            <td>{repair.device}</td>

                            <td>

                                <span className="status">

                                    {repair.status}

                                </span>

                            </td>

                            <td>{repair.date}</td>

                        </tr>

                    ))}

                </tbody>

            </table>

        </section>

    );

}

export default RepairsTable;