import "./RepairsTable.css";

import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

import {
    REPAIR_PRIORITIES,
    REPAIR_STATUSES,
    type Repair,
} from "../../types/repair";

const ACTIVE_STATUSES = REPAIR_STATUSES.filter(
    (status) => !["Collected", "Cancelled"].includes(status)
);

type RepairsTableProps = {
    repairs: Repair[];
};

function statusClass(status: string) {
    return `status status-${status
        .toLowerCase()
        .replaceAll(" ", "-")}`;
}

function RepairsTable({
    repairs,
}: RepairsTableProps) {
    const [query, setQuery] = useState("");
    const [statusFilter, setStatusFilter] =
        useState("All");
    const [priorityFilter, setPriorityFilter] =
        useState("All");

    const queueStats = useMemo(
        () => ({
            active: repairs.filter((repair) =>
                ACTIVE_STATUSES.includes(repair.status)
            ).length,
            waiting: repairs.filter((repair) =>
                [
                    "Awaiting Approval",
                    "Awaiting Parts",
                ].includes(repair.status)
            ).length,
            ready: repairs.filter(
                (repair) => repair.status === "Ready"
            ).length,
            urgent: repairs.filter(
                (repair) =>
                    repair.priority === "Urgent"
            ).length,
        }),
        [repairs]
    );

    const filteredRepairs = useMemo(() => {
        const normalizedQuery = query
            .trim()
            .toLowerCase();

        return repairs.filter((repair) => {
            const matchesQuery =
                !normalizedQuery ||
                [
                    repair.ticketNumber,
                    repair.customer,
                    repair.customerPhone,
                    repair.device,
                    repair.deviceBrand,
                    repair.deviceModel,
                    repair.serialNumber,
                    repair.issue,
                    repair.assignedTechnician,
                ]
                    .filter(Boolean)
                    .join(" ")
                    .toLowerCase()
                    .includes(normalizedQuery);

            return (
                matchesQuery &&
                (statusFilter === "All" ||
                    repair.status ===
                        statusFilter) &&
                (priorityFilter === "All" ||
                    repair.priority ===
                        priorityFilter)
            );
        });
    }, [
        repairs,
        query,
        statusFilter,
        priorityFilter,
    ]);

    return (
        <>
            <section
                className="queue-summary"
                aria-label="Repair queue summary"
            >
                <div>
                    <span>Active</span>
                    <strong>{queueStats.active}</strong>
                </div>

                <div>
                    <span>Waiting</span>
                    <strong>{queueStats.waiting}</strong>
                </div>

                <div>
                    <span>Ready</span>
                    <strong>{queueStats.ready}</strong>
                </div>

                <div>
                    <span>Urgent</span>
                    <strong>{queueStats.urgent}</strong>
                </div>
            </section>

            <section className="repair-filters">
                <label className="filter-search">
                    <span>Search</span>

                    <input
                        type="search"
                        placeholder="Ticket, customer, device..."
                        value={query}
                        onChange={(e) =>
                            setQuery(
                                e.target.value
                            )
                        }
                    />
                </label>

                <label>
                    <span>Status</span>

                    <select
                        value={statusFilter}
                        onChange={(e) =>
                            setStatusFilter(
                                e.target.value
                            )
                        }
                    >
                        <option>All</option>

                        {REPAIR_STATUSES.map(
                            (status) => (
                                <option
                                    key={status}
                                >
                                    {status}
                                </option>
                            )
                        )}
                    </select>
                </label>

                <label>
                    <span>Priority</span>

                    <select
                        value={priorityFilter}
                        onChange={(e) =>
                            setPriorityFilter(
                                e.target.value
                            )
                        }
                    >
                        <option>All</option>

                        {REPAIR_PRIORITIES.map(
                            (priority) => (
                                <option
                                    key={priority}
                                >
                                    {priority}
                                </option>
                            )
                        )}
                    </select>
                </label>
            </section>

            {filteredRepairs.length === 0 ? (
                <div className="empty-state">
                    <p>
                        No repair tickets
                        match these filters.
                    </p>
                </div>
            ) : (
                <section className="repairs-table">
                    <table>
                        <thead>
                            <tr>
                                <th>Ticket</th>
                                <th>
                                    Customer &
                                    Device
                                </th>
                                <th>Status</th>
                                <th>Priority</th>
                                <th>Due</th>
                                <th>
                                    Technician
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            {filteredRepairs.map(
                                (repair) => (
                                    <tr
                                        key={
                                            repair.id
                                        }
                                    >
                                        <td>
                                            <Link
                                                className="ticket-link"
                                                to={`/repairs/${repair.id}`}
                                            >
                                                {repair.ticketNumber ||
                                                    `Repair #${repair.id}`}
                                            </Link>

                                            <small>
                                                {new Date(
                                                    repair.createdAt
                                                ).toLocaleDateString()}
                                            </small>
                                        </td>

                                        <td>
                                            <strong>
                                                {
                                                    repair.customer
                                                }
                                            </strong>

                                            <small>
                                                {[
                                                    repair.deviceBrand,
                                                    repair.deviceModel,
                                                ]
                                                    .filter(
                                                        Boolean
                                                    )
                                                    .join(
                                                        " "
                                                    ) ||
                                                    repair.device}
                                            </small>
                                        </td>

                                        <td>
                                            <span
                                                className={statusClass(
                                                    repair.status
                                                )}
                                            >
                                                {
                                                    repair.status
                                                }
                                            </span>
                                        </td>

                                        <td>
                                            <span
                                                className={`priority priority-${repair.priority.toLowerCase()}`}
                                            >
                                                {
                                                    repair.priority
                                                }
                                            </span>
                                        </td>

                                        <td>
                                            {repair.dueDate
                                                ? new Date(
                                                      repair.dueDate
                                                  ).toLocaleDateString()
                                                : "Not set"}
                                        </td>

                                        <td>
                                            {repair.assignedTechnician ||
                                                "Unassigned"}
                                        </td>
                                    </tr>
                                )
                            )}
                        </tbody>
                    </table>
                </section>
            )}
        </>
    );
}

export default RepairsTable;