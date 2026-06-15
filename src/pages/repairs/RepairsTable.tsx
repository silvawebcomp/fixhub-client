import "./RepairsTable.css";

import { useEffect, useState } from "react";

import {
    getRepairs,
    deleteRepair,
} from "../../services/repairService";

import { useSearch } from "../../hooks/useSearch";

import type { Repair } from "../../types/repair";

function RepairsTable() {

    const [repairs, setRepairs] = useState<Repair[]>([]);

    const [loading, setLoading] = useState(true);

    async function loadRepairs() {

        try {

            const data = await getRepairs();

            setRepairs(data);

        } catch (error) {

            console.error(error);

        } finally {

            setLoading(false);

        }

    }

    useEffect(() => {

        loadRepairs();

    }, []);

    const {

        query,

        setQuery,

        filteredData,

    } = useSearch(

        repairs,

        (repair) =>

            `${repair.customer} ${repair.device} ${repair.status}`

    );

    async function handleDelete(id: number) {

        const confirmed = window.confirm(

            "Delete this repair?"

        );

        if (!confirmed) {

            return;

        }

        try {

            await deleteRepair(id);

            await loadRepairs();

        } catch (error) {

            console.error(error);

        }

    }

    if (loading) {

        return <p>Loading repairs...</p>;

    }

    return (

        <>

            <input

                className="search-input"

                type="text"

                placeholder="Search repairs..."

                value={query}

                onChange={(event) =>

                    setQuery(event.target.value)

                }

            />

            <section className="repairs-table">

                <table>

                    <thead>

                        <tr>

                            <th>Customer</th>

                            <th>Device</th>

                            <th>Status</th>

                            <th>Date</th>

                            <th>Action</th>

                        </tr>

                    </thead>

                    <tbody>

                        {filteredData.map((repair) => (

                            <tr key={repair.id}>

                                <td>{repair.customer}</td>

                                <td>{repair.device}</td>

                                <td>

                                    <span className="status">

                                        {repair.status}

                                    </span>

                                </td>

                                <td>{repair.date}</td>

                                <td>

                                    <button

                                        className="delete-btn"

                                        onClick={() =>

                                            handleDelete(repair.id)

                                        }

                                    >

                                        Delete

                                    </button>

                                </td>

                            </tr>

                        ))}

                    </tbody>

                </table>

            </section>

        </>

    );

}

export default RepairsTable;