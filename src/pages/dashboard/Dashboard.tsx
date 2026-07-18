import "./Dashboard.css";

import type { CSSProperties } from "react";
import { useMemo } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import DashboardLayout from "../../layouts/DashboardLayout";

import { useDashboard } from "../../hooks/useDashboard";
import {
    getBusinessInsights,
    type BusinessInsights,
    type InsightPoint,
} from "../../services/dashboardService";
import { getRepairs } from "../../services/repairService";
import type { Repair } from "../../types/repair";

const EMPTY_INSIGHTS: BusinessInsights = {
    repairStatus: [],
    repairPriority: [],
    revenueTrend: [],
    inventoryHealth: {
        totalItems: 0,
        lowStockItems: 0,
        stockUnits: 0,
        inventoryValue: 0,
    },
    communicationTotals: {
        WhatsApp: 0,
        SMS: 0,
        Email: 0,
    },
    kpis: {
        totalRepairs: 0,
        activeRepairs: 0,
        completedRepairs: 0,
        totalRevenue: 0,
        collectedRevenue: 0,
        outstandingBalance: 0,
        collectionRate: 0,
    },
};

type MeterStyle = CSSProperties & {
    "--meter-width"?: string;
    "--bar-height"?: string;
};

type KpiCardProps = {
    label: string;
    value: string | number;
    detail: string;
    tone: "blue" | "green" | "amber" | "red" | "teal" | "slate";
};

function money(value: number | null | undefined) {
    return `NGN ${(value ?? 0).toLocaleString()}`;
}

function formatNumber(value: number | null | undefined) {
    return (value ?? 0).toLocaleString();
}

function percent(value: number, max: number, minimum = 0) {
    if (max <= 0) {
        return 0;
    }

    return Math.max(minimum, Math.round((value / max) * 100));
}

function statusKey(value: string) {
    return (
        value
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)/g, "") || "default"
    );
}

function formatDate(value: string | null) {
    if (!value) {
        return "No date";
    }

    return new Intl.DateTimeFormat(undefined, {
        month: "short",
        day: "numeric",
    }).format(new Date(value));
}

function pointValue(points: InsightPoint[], label: string) {
    return (
        points.find(
            (point) => point.label.toLowerCase() === label.toLowerCase()
        )?.value ?? 0
    );
}

function KpiCard({ label, value, detail, tone }: KpiCardProps) {
    return (
        <article className={`dashboard-kpi dashboard-kpi--${tone}`}>
            <span className="dashboard-kpi__mark" aria-hidden="true" />
            <div>
                <p>{label}</p>
                <strong>{value}</strong>
                <small>{detail}</small>
            </div>
        </article>
    );
}

function EmptyState({ label }: { label: string }) {
    return <p className="dashboard-empty">{label}</p>;
}

function RecentRepairRow({ repair }: { repair: Repair }) {
    return (
        <Link to={`/repairs/${repair.id}`} className="repair-row">
            <span>
                <strong>{repair.ticketNumber ?? `Repair #${repair.id}`}</strong>
                <small>{repair.customer}</small>
            </span>
            <span>
                <strong>{repair.device}</strong>
                <small>{repair.issue ?? "Issue not recorded"}</small>
            </span>
            <span className={`status-chip status-chip--${statusKey(repair.status)}`}>
                {repair.status}
            </span>
            <span className={`priority-text priority-text--${statusKey(repair.priority)}`}>
                {repair.priority}
            </span>
            <span>{formatDate(repair.dueDate)}</span>
        </Link>
    );
}

function WorkloadBars({ data }: { data: InsightPoint[] }) {
    const max = Math.max(...data.map((item) => item.value), 0);

    if (data.length === 0) {
        return <EmptyState label="No repair workload yet." />;
    }

    return (
        <div className="workload-list">
            {data.map((item) => (
                <div className="workload-row" key={item.label}>
                    <span>{item.label}</span>
                    <div>
                        <i
                            style={
                                {
                                    "--meter-width": `${percent(item.value, max, 3)}%`,
                                } as MeterStyle
                            }
                        />
                    </div>
                    <strong>{formatNumber(item.value)}</strong>
                </div>
            ))}
        </div>
    );
}

function RevenueChart({ insights }: { insights: BusinessInsights }) {
    const maxRevenue = Math.max(
        ...insights.revenueTrend.map((point) =>
            Math.max(point.billed, point.collected, point.outstanding)
        ),
        0
    );

    if (insights.revenueTrend.length === 0) {
        return <EmptyState label="No invoice trend yet." />;
    }

    return (
        <div className="revenue-chart" aria-label="Revenue trend">
            {insights.revenueTrend.map((point) => (
                <div className="revenue-column" key={point.month}>
                    <div className="revenue-bars">
                        <i
                            className="revenue-bars__billed"
                            style={
                                {
                                    "--bar-height": `${percent(point.billed, maxRevenue, 4)}%`,
                                } as MeterStyle
                            }
                        />
                        <i
                            className="revenue-bars__collected"
                            style={
                                {
                                    "--bar-height": `${percent(point.collected, maxRevenue, 4)}%`,
                                } as MeterStyle
                            }
                        />
                        <i
                            className="revenue-bars__outstanding"
                            style={
                                {
                                    "--bar-height": `${percent(point.outstanding, maxRevenue, 4)}%`,
                                } as MeterStyle
                            }
                        />
                    </div>
                    <span>{point.month}</span>
                </div>
            ))}
        </div>
    );
}

function Dashboard() {
    const statsQuery = useDashboard();
    const insightsQuery = useQuery({
        queryKey: ["dashboard", "insights"],
        queryFn: getBusinessInsights,
    });
    const repairsQuery = useQuery({
        queryKey: ["dashboard", "recent-repairs"],
        queryFn: () => getRepairs(),
    });

    const stats = statsQuery.data;
    const insights = insightsQuery.data ?? EMPTY_INSIGHTS;

    const recentRepairs = useMemo(
        () =>
            [...(repairsQuery.data ?? [])]
                .sort(
                    (left, right) =>
                        new Date(right.createdAt).getTime() -
                        new Date(left.createdAt).getTime()
                )
                .slice(0, 6),
        [repairsQuery.data]
    );

    const totalRepairs = stats?.totalRepairs ?? insights.kpis.totalRepairs;
    const activeRepairs = stats?.activeRepairs ?? insights.kpis.activeRepairs;
    const completedRepairs = insights.kpis.completedRepairs;
    const readyRepairs = pointValue(insights.repairStatus, "Ready");
    const awaitingParts = pointValue(insights.repairStatus, "Awaiting Parts");
    const urgentRepairs = pointValue(insights.repairPriority, "Urgent");
    const highPriorityRepairs = pointValue(insights.repairPriority, "High");
    const lowStockItems = insights.inventoryHealth.lowStockItems;
    const communicationTotal =
        insights.communicationTotals.WhatsApp +
        insights.communicationTotals.SMS +
        insights.communicationTotals.Email;
    const inventoryHealth = insights.inventoryHealth.totalItems
        ? Math.max(
              0,
              Math.round(
                  ((insights.inventoryHealth.totalItems - lowStockItems) /
                      insights.inventoryHealth.totalItems) *
                      100
              )
          )
        : 100;

    const hasError =
        statsQuery.isError || insightsQuery.isError || repairsQuery.isError;
    const isLoading =
        statsQuery.isLoading || insightsQuery.isLoading || repairsQuery.isLoading;

    return (
        <DashboardLayout>
            <section className="dashboard-page">
                <header className="dashboard-hero">
                    <div>
                        <p className="dashboard-kicker">Operations</p>
                        <h1>Command center</h1>
                        <p>Repair flow, cash, stock, and follow-ups in one view.</p>
                    </div>

                    <div className="dashboard-hero__actions" aria-label="Primary actions">
                        <Link to="/repairs/new" className="primary-action">
                            New repair
                        </Link>
                        <Link to="/invoices/new">Create invoice</Link>
                        <Link to="/inventory/new">Add stock</Link>
                    </div>
                </header>

                {hasError && (
                    <p className="dashboard-alert">
                        Some live dashboard data could not load. Showing available data.
                    </p>
                )}

                {isLoading && <p className="dashboard-notice">Loading live dashboard...</p>}

                <section className="dashboard-kpi-grid" aria-label="Key metrics">
                    <KpiCard
                        label="Total repairs"
                        value={formatNumber(totalRepairs)}
                        detail={`${formatNumber(activeRepairs)} active`}
                        tone="blue"
                    />
                    <KpiCard
                        label="Completed"
                        value={formatNumber(completedRepairs)}
                        detail={`${formatNumber(readyRepairs)} ready for pickup`}
                        tone="green"
                    />
                    <KpiCard
                        label="At risk"
                        value={formatNumber(urgentRepairs + highPriorityRepairs)}
                        detail={`${formatNumber(awaitingParts)} awaiting parts`}
                        tone="amber"
                    />
                    <KpiCard
                        label="Revenue"
                        value={money(stats?.invoiceRevenue ?? insights.kpis.totalRevenue)}
                        detail={`${formatNumber(insights.kpis.collectionRate)}% collected`}
                        tone="teal"
                    />
                    <KpiCard
                        label="Outstanding"
                        value={money(
                            stats?.outstandingBalance ?? insights.kpis.outstandingBalance
                        )}
                        detail={`${money(stats?.paymentsReceived ?? insights.kpis.collectedRevenue)} received`}
                        tone="red"
                    />
                    <KpiCard
                        label="Stock items"
                        value={formatNumber(
                            stats?.inventoryItems ?? insights.inventoryHealth.totalItems
                        )}
                        detail={`${formatNumber(lowStockItems)} low stock`}
                        tone="slate"
                    />
                </section>

                <section className="dashboard-grid dashboard-grid--main">
                    <article className="dashboard-panel dashboard-panel--wide">
                        <div className="panel-heading">
                            <div>
                                <p>Recent repairs</p>
                                <h2>Jobs moving now</h2>
                            </div>
                            <Link to="/repairs">View all</Link>
                        </div>

                        <div className="repair-table" role="table" aria-label="Recent repairs">
                            <div className="repair-row repair-row--head" role="row">
                                <span>Ticket</span>
                                <span>Device</span>
                                <span>Status</span>
                                <span>Priority</span>
                                <span>Due</span>
                            </div>

                            {recentRepairs.length === 0 ? (
                                <EmptyState label="No repairs yet." />
                            ) : (
                                recentRepairs.map((repair) => (
                                    <RecentRepairRow repair={repair} key={repair.id} />
                                ))
                            )}
                        </div>
                    </article>

                    <article className="dashboard-panel dashboard-panel--revenue">
                        <div className="panel-heading">
                            <div>
                                <p>Revenue and collections</p>
                                <h2>{money(stats?.invoiceRevenue ?? insights.kpis.totalRevenue)}</h2>
                            </div>
                            <Link to="/invoices">Invoices</Link>
                        </div>

                        <div className="revenue-summary">
                            <span>
                                <strong>{money(insights.kpis.collectedRevenue)}</strong>
                                Collected
                            </span>
                            <span>
                                <strong>{money(insights.kpis.outstandingBalance)}</strong>
                                Outstanding
                            </span>
                        </div>

                        <RevenueChart insights={insights} />
                    </article>
                </section>

                <section className="dashboard-grid dashboard-grid--support">
                    <article className="dashboard-panel">
                        <div className="panel-heading">
                            <div>
                                <p>Repair status</p>
                                <h2>Workload</h2>
                            </div>
                            <Link to="/repairs">Repairs</Link>
                        </div>
                        <WorkloadBars data={insights.repairStatus} />
                    </article>

                    <article className="dashboard-panel">
                        <div className="panel-heading">
                            <div>
                                <p>Priority</p>
                                <h2>Risk queue</h2>
                            </div>
                            <Link to="/repairs">Review</Link>
                        </div>
                        <WorkloadBars data={insights.repairPriority} />
                    </article>

                    <article className="dashboard-panel inventory-panel">
                        <div className="panel-heading">
                            <div>
                                <p>Inventory health</p>
                                <h2>{inventoryHealth}%</h2>
                            </div>
                            <Link to="/inventory">Stock</Link>
                        </div>

                        <div className="inventory-meter">
                            <i
                                style={
                                    {
                                        "--meter-width": `${inventoryHealth}%`,
                                    } as MeterStyle
                                }
                            />
                        </div>

                        <dl className="compact-metrics">
                            <div>
                                <dt>Units</dt>
                                <dd>{formatNumber(insights.inventoryHealth.stockUnits)}</dd>
                            </div>
                            <div>
                                <dt>Low stock</dt>
                                <dd>{formatNumber(lowStockItems)}</dd>
                            </div>
                            <div>
                                <dt>Value</dt>
                                <dd>{money(insights.inventoryHealth.inventoryValue)}</dd>
                            </div>
                        </dl>
                    </article>

                    <article className="dashboard-panel communications-panel">
                        <div className="panel-heading">
                            <div>
                                <p>Customer communications</p>
                                <h2>{formatNumber(communicationTotal)}</h2>
                            </div>
                            <Link to="/communications">Messages</Link>
                        </div>

                        <dl className="channel-list">
                            <div>
                                <dt>WhatsApp</dt>
                                <dd>{formatNumber(insights.communicationTotals.WhatsApp)}</dd>
                            </div>
                            <div>
                                <dt>SMS</dt>
                                <dd>{formatNumber(insights.communicationTotals.SMS)}</dd>
                            </div>
                            <div>
                                <dt>Email</dt>
                                <dd>{formatNumber(insights.communicationTotals.Email)}</dd>
                            </div>
                        </dl>
                    </article>
                </section>
            </section>
        </DashboardLayout>
    );
}

export default Dashboard;