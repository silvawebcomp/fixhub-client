import "./Dashboard.css";

import type { CSSProperties } from "react";
import { useMemo } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import DashboardLayout from "../../layouts/DashboardLayout";

import { useDashboard } from "../../hooks/useDashboard";
import { getBranches } from "../../services/branchService";
import {
    getBusinessInsights,
    type BusinessInsights,
    type InsightPoint,
} from "../../services/dashboardService";
import { getInventory } from "../../services/inventoryService";
import { getInvoices } from "../../services/invoiceService";
import { getRepairs } from "../../services/repairService";
import type { Branch } from "../../types/branch";
import type { InventoryItem } from "../../types/inventory";
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

const PIPELINE_STATUSES = [
    "Received",
    "Diagnosing",
    "Awaiting Parts",
    "Repairing",
    "Ready",
    "Collected",
];

type MeterStyle = CSSProperties & {
    "--meter-width"?: string;
    "--bar-height"?: string;
    "--score"?: string;
};

type KpiCardProps = {
    label: string;
    value: string | number;
    detail: string;
    tone: "blue" | "green" | "amber" | "red" | "teal" | "slate";
    spark?: number[];
};

type BranchPerformance = {
    id: number | "default";
    name: string;
    manager: string;
    active: number;
    ready: number;
    overdue: number;
    urgent: number;
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

function isClosed(repair: Repair) {
    return repair.status === "Collected" || repair.status === "Cancelled";
}

function isOverdue(repair: Repair) {
    if (!repair.dueDate || isClosed(repair)) {
        return false;
    }

    return new Date(repair.dueDate).getTime() < Date.now();
}

function pointValue(points: InsightPoint[], label: string) {
    return (
        points.find(
            (point) => point.label.toLowerCase() === label.toLowerCase()
        )?.value ?? 0
    );
}

function getRepairStatusCount(points: InsightPoint[], status: string, repairs: Repair[]) {
    const insightValue = pointValue(points, status);

    if (insightValue > 0) {
        return insightValue;
    }

    return repairs.filter((repair) => repair.status === status).length;
}

function sparkPoints(values: number[]) {
    const max = Math.max(...values, 1);

    return values
        .map((value, index) => {
            const x = (index / Math.max(values.length - 1, 1)) * 100;
            const y = 30 - percent(value, max) * 0.22;

            return `${x.toFixed(1)},${y.toFixed(1)}`;
        })
        .join(" ");
}

function collectionRate(total: number, collected: number) {
    if (total <= 0) {
        return 0;
    }

    return Math.round((collected / total) * 100);
}

function branchName(branches: Branch[], branchId: number | null) {
    const branch = branches.find((item) => item.id === branchId);
    return branch?.name ?? "Default branch";
}

function branchManager(branches: Branch[], branchId: number | null) {
    const branch = branches.find((item) => item.id === branchId);
    return branch?.managerName || "Unassigned";
}

function KpiCard({ label, value, detail, tone, spark }: KpiCardProps) {
    return (
        <article className={`dashboard-kpi dashboard-kpi--${tone}`}>
            <span className="dashboard-kpi__mark" aria-hidden="true" />
            <div>
                <p>{label}</p>
                <strong>{value}</strong>
                <small>{detail}</small>
            </div>
            {spark && (
                <svg className="kpi-spark" viewBox="0 0 100 32" aria-hidden="true">
                    <polyline points={sparkPoints(spark)} />
                </svg>
            )}
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
        return <EmptyState label="No workload signal yet." />;
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
                                    "--bar-height": `${percent(
                                        point.outstanding,
                                        maxRevenue,
                                        4
                                    )}%`,
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

function PipelineLanes({
    insights,
    repairs,
}: {
    insights: BusinessInsights;
    repairs: Repair[];
}) {
    const max = Math.max(
        ...PIPELINE_STATUSES.map((status) =>
            getRepairStatusCount(insights.repairStatus, status, repairs)
        ),
        1
    );

    return (
        <div className="pipeline-lanes">
            {PIPELINE_STATUSES.map((status) => {
                const count = getRepairStatusCount(insights.repairStatus, status, repairs);

                return (
                    <div className="pipeline-lane" key={status}>
                        <span>{status}</span>
                        <strong>{formatNumber(count)}</strong>
                        <i
                            style={
                                {
                                    "--meter-width": `${percent(count, max, 8)}%`,
                                } as MeterStyle
                            }
                        />
                    </div>
                );
            })}
        </div>
    );
}

function BranchPerformanceTable({ rows }: { rows: BranchPerformance[] }) {
    if (rows.length === 0) {
        return <EmptyState label="Add branches to compare shop performance." />;
    }

    return (
        <div className="branch-table" role="table" aria-label="Branch performance">
            <div className="branch-row branch-row--head" role="row">
                <span>Branch</span>
                <span>Manager</span>
                <span>Active</span>
                <span>Ready</span>
                <span>Risk</span>
            </div>

            {rows.map((row) => (
                <div className="branch-row" role="row" key={row.id}>
                    <span>
                        <strong>{row.name}</strong>
                    </span>
                    <span>{row.manager}</span>
                    <span>{formatNumber(row.active)}</span>
                    <span>{formatNumber(row.ready)}</span>
                    <span className={row.overdue + row.urgent > 0 ? "risk-hot" : "risk-calm"}>
                        {formatNumber(row.overdue + row.urgent)}
                    </span>
                </div>
            ))}
        </div>
    );
}

function InventoryAttention({ items }: { items: InventoryItem[] }) {
    if (items.length === 0) {
        return <EmptyState label="No low-stock items right now." />;
    }

    return (
        <div className="inventory-list">
            {items.slice(0, 5).map((item) => {
                const gap = Math.max(item.reorderLevel - item.quantity, 0);

                return (
                    <Link to="/inventory" className="inventory-risk-row" key={item.id}>
                        <span>
                            <strong>{item.name}</strong>
                            <small>
                                {item.category || "Uncategorized"} -{" "}
                                {item.branch?.name || "All branches"}
                            </small>
                        </span>
                        <span>
                            <strong>{formatNumber(item.quantity)}</strong>
                            <small>on hand</small>
                        </span>
                        <span className={gap > 0 ? "risk-hot" : "risk-calm"}>
                            {gap > 0 ? `${formatNumber(gap)} short` : "Healthy"}
                        </span>
                    </Link>
                );
            })}
        </div>
    );
}

function ActionCard({
    tone,
    title,
    detail,
    to,
}: {
    tone: "red" | "amber" | "blue" | "green" | "slate";
    title: string;
    detail: string;
    to: string;
}) {
    return (
        <Link to={to} className={`action-card action-card--${tone}`}>
            <span aria-hidden="true" />
            <strong>{title}</strong>
            <small>{detail}</small>
        </Link>
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
    const inventoryQuery = useQuery({
        queryKey: ["dashboard", "inventory"],
        queryFn: () => getInventory(),
    });
    const invoicesQuery = useQuery({
        queryKey: ["dashboard", "invoices"],
        queryFn: getInvoices,
    });
    const branchesQuery = useQuery({
        queryKey: ["dashboard", "branches"],
        queryFn: getBranches,
    });

    const stats = statsQuery.data;
    const insights = insightsQuery.data ?? EMPTY_INSIGHTS;
    const repairs = useMemo(() => repairsQuery.data ?? [], [repairsQuery.data]);
    const invoices = useMemo(() => invoicesQuery.data ?? [], [invoicesQuery.data]);
    const inventory = useMemo(
        () => inventoryQuery.data ?? [],
        [inventoryQuery.data]
    );
    const branches = useMemo(() => branchesQuery.data ?? [], [branchesQuery.data]);

    const recentRepairs = useMemo(
        () =>
            [...repairs]
                .sort(
                    (left, right) =>
                        new Date(right.createdAt).getTime() -
                        new Date(left.createdAt).getTime()
                )
                .slice(0, 6),
        [repairs]
    );

    const lowStockItems = useMemo(
        () =>
            inventory
                .filter((item) => item.quantity <= item.reorderLevel)
                .sort(
                    (left, right) =>
                        right.reorderLevel -
                        right.quantity -
                        (left.reorderLevel - left.quantity)
                ),
        [inventory]
    );

    const unpaidInvoices = useMemo(
        () => invoices.filter((invoice) => invoice.balance > 0),
        [invoices]
    );

    const branchRows = useMemo(() => {
        const grouped = new Map<number | "default", BranchPerformance>();

        branches.forEach((branch) => {
            grouped.set(branch.id, {
                id: branch.id,
                name: branch.name,
                manager: branch.managerName || "Unassigned",
                active: 0,
                ready: 0,
                overdue: 0,
                urgent: 0,
            });
        });

        repairs.forEach((repair) => {
            const id = repair.branchId ?? "default";
            const current =
                grouped.get(id) ??
                ({
                    id,
                    name: branchName(branches, repair.branchId),
                    manager: branchManager(branches, repair.branchId),
                    active: 0,
                    ready: 0,
                    overdue: 0,
                    urgent: 0,
                } satisfies BranchPerformance);

            if (!isClosed(repair)) {
                current.active += 1;
            }

            if (repair.status === "Ready") {
                current.ready += 1;
            }

            if (isOverdue(repair)) {
                current.overdue += 1;
            }

            if (repair.priority === "Urgent" || repair.priority === "High") {
                current.urgent += 1;
            }

            grouped.set(id, current);
        });

        return [...grouped.values()]
            .sort((left, right) => right.active - left.active)
            .slice(0, 5);
    }, [branches, repairs]);

    const totalRepairs = stats?.totalRepairs ?? insights.kpis.totalRepairs;
    const activeRepairs = stats?.activeRepairs ?? insights.kpis.activeRepairs;
    const completedRepairs = insights.kpis.completedRepairs;
    const readyRepairs =
        getRepairStatusCount(insights.repairStatus, "Ready", repairs) ||
        repairs.filter((repair) => repair.status === "Ready").length;
    const awaitingParts = getRepairStatusCount(
        insights.repairStatus,
        "Awaiting Parts",
        repairs
    );
    const urgentRepairs =
        pointValue(insights.repairPriority, "Urgent") ||
        repairs.filter((repair) => repair.priority === "Urgent").length;
    const highPriorityRepairs =
        pointValue(insights.repairPriority, "High") ||
        repairs.filter((repair) => repair.priority === "High").length;
    const overdueRepairs = repairs.filter(isOverdue).length;
    const communicationTotal =
        insights.communicationTotals.WhatsApp +
        insights.communicationTotals.SMS +
        insights.communicationTotals.Email;
    const inventoryHealth = insights.inventoryHealth.totalItems
        ? Math.max(
              0,
              Math.round(
                  ((insights.inventoryHealth.totalItems -
                      (lowStockItems.length || insights.inventoryHealth.lowStockItems)) /
                      insights.inventoryHealth.totalItems) *
                      100
              )
          )
        : 100;

    const revenueTotal = stats?.invoiceRevenue ?? insights.kpis.totalRevenue;
    const collectedRevenue =
        stats?.paymentsReceived ?? insights.kpis.collectedRevenue;
    const outstandingBalance =
        stats?.outstandingBalance ?? insights.kpis.outstandingBalance;
    const collectionScore =
        insights.kpis.collectionRate ||
        collectionRate(revenueTotal, collectedRevenue);
    const unpaidBalance = unpaidInvoices.reduce(
        (sum, invoice) => sum + invoice.balance,
        0
    );
    const shopHealth = Math.round(
        collectionScore * 0.35 +
            inventoryHealth * 0.25 +
            Math.max(0, 100 - overdueRepairs * 10) * 0.2 +
            Math.max(0, 100 - (urgentRepairs + highPriorityRepairs) * 7) * 0.2
    );

    const hasError =
        statsQuery.isError ||
        insightsQuery.isError ||
        repairsQuery.isError ||
        inventoryQuery.isError ||
        invoicesQuery.isError ||
        branchesQuery.isError;
    const isLoading =
        statsQuery.isLoading ||
        insightsQuery.isLoading ||
        repairsQuery.isLoading ||
        inventoryQuery.isLoading ||
        invoicesQuery.isLoading ||
        branchesQuery.isLoading;

    return (
        <DashboardLayout>
            <section className="dashboard-page">
                <header className="dashboard-hero">
                    <div>
                        <p className="dashboard-kicker">Operations command</p>
                        <h1>Shop health and growth dashboard</h1>
                        <p>
                            Live repair flow, collections, inventory risk, branch
                            accountability, and customer follow-up signals for FixHub V1.
                        </p>
                    </div>

                    <div className="dashboard-hero__actions" aria-label="Primary actions">
                        <Link to="/repairs/new" className="primary-action">
                            New repair
                        </Link>
                        <Link to="/invoices/new">Create invoice</Link>
                        <Link to="/inventory/new">Add stock</Link>
                    </div>
                </header>

                <section className="executive-strip" aria-label="Shop health">
                    <article className="health-score">
                        <div
                            className="score-ring"
                            style={
                                {
                                    "--score": `${shopHealth}%`,
                                } as MeterStyle
                            }
                        >
                            <strong>{shopHealth}</strong>
                            <span>/100</span>
                        </div>
                        <div>
                            <p>Business health</p>
                            <h2>
                                {shopHealth >= 80
                                    ? "Scalable shop operations"
                                    : shopHealth >= 60
                                      ? "Healthy with action points"
                                      : "Needs management attention"}
                            </h2>
                            <small>
                                Collection rate, overdue repairs, branch risk, and
                                inventory readiness combined.
                            </small>
                        </div>
                    </article>

                    <dl className="executive-metrics">
                        <div>
                            <dt>Collection rate</dt>
                            <dd>{formatNumber(collectionScore)}%</dd>
                        </div>
                        <div>
                            <dt>Ready for pickup</dt>
                            <dd>{formatNumber(readyRepairs)}</dd>
                        </div>
                        <div>
                            <dt>Branch coverage</dt>
                            <dd>{formatNumber(Math.max(branches.length, branchRows.length))}</dd>
                        </div>
                        <div>
                            <dt>Inventory health</dt>
                            <dd>{formatNumber(inventoryHealth)}%</dd>
                        </div>
                    </dl>
                </section>

                {hasError && (
                    <p className="dashboard-alert">
                        Some live dashboard data could not load. Showing available data.
                    </p>
                )}

                {isLoading && <p className="dashboard-notice">Loading live dashboard...</p>}

                <section className="dashboard-panel beta-launch-panel">
                    <div className="panel-heading">
                        <div>
                            <p>V1 beta launch kit</p>
                            <h2>Use feedback to prove what FixHub should become next.</h2>
                        </div>
                        <Link to="/feedback">Review feedback</Link>
                    </div>

                    <div className="beta-launch-grid">
                        <article>
                            <strong>1. Onboard shops manually</strong>
                            <span>Start with 10 to 20 repair businesses and watch their first session.</span>
                        </article>
                        <article>
                            <strong>2. Track activation</strong>
                            <span>Look for first repair, first invoice, first customer update, and return usage.</span>
                        </article>
                        <article>
                            <strong>3. Capture friction fast</strong>
                            <span>Ask users to click Send feedback when something feels confusing or slow.</span>
                        </article>
                        <article>
                            <strong>4. Fix repeated blockers</strong>
                            <span>Prioritize issues that stop shops from completing real daily work.</span>
                        </article>
                    </div>
                </section>

                <section className="dashboard-kpi-grid" aria-label="Key metrics">
                    <KpiCard
                        label="Active repairs"
                        value={formatNumber(activeRepairs)}
                        detail={`${formatNumber(totalRepairs)} total repairs`}
                        tone="blue"
                        spark={[8, 11, 9, 13, 12, 15, activeRepairs || 10]}
                    />
                    <KpiCard
                        label="Revenue booked"
                        value={money(revenueTotal)}
                        detail={`${money(collectedRevenue)} collected`}
                        tone="green"
                        spark={[12, 15, 13, 19, 18, 22, 25]}
                    />
                    <KpiCard
                        label="Unpaid invoices"
                        value={money(unpaidBalance || outstandingBalance)}
                        detail={`${formatNumber(unpaidInvoices.length)} needs follow-up`}
                        tone="amber"
                        spark={[9, 12, 11, 10, 13, 8, unpaidInvoices.length + 8]}
                    />
                    <KpiCard
                        label="Low stock"
                        value={formatNumber(
                            lowStockItems.length || insights.inventoryHealth.lowStockItems
                        )}
                        detail={`${formatNumber(awaitingParts)} repairs waiting parts`}
                        tone="red"
                        spark={[4, 5, 3, 6, 7, 5, lowStockItems.length || 4]}
                    />
                    <KpiCard
                        label="Customer updates"
                        value={formatNumber(communicationTotal)}
                        detail="WhatsApp, SMS, and email activity"
                        tone="teal"
                        spark={[5, 7, 6, 9, 8, 11, communicationTotal || 7]}
                    />
                    <KpiCard
                        label="Completed"
                        value={formatNumber(completedRepairs)}
                        detail={`${formatNumber(readyRepairs)} ready to collect`}
                        tone="slate"
                        spark={[6, 8, 7, 10, 12, 11, completedRepairs || 9]}
                    />
                </section>

                <section className="dashboard-grid dashboard-grid--main">
                    <article className="dashboard-panel dashboard-panel--wide">
                        <div className="panel-heading">
                            <div>
                                <p>Repair pipeline</p>
                                <h2>Where work is moving</h2>
                            </div>
                            <Link to="/repairs">View all repairs</Link>
                        </div>

                        <PipelineLanes insights={insights} repairs={repairs} />

                        <div className="pipeline-summary">
                            <span>
                                <strong>{formatNumber(activeRepairs)}</strong>
                                Active repairs
                            </span>
                            <span>
                                <strong>{formatNumber(overdueRepairs)}</strong>
                                Overdue promises
                            </span>
                            <span>
                                <strong>{formatNumber(urgentRepairs + highPriorityRepairs)}</strong>
                                High priority
                            </span>
                        </div>
                    </article>

                    <article className="dashboard-panel">
                        <div className="panel-heading">
                            <div>
                                <p>Branch performance</p>
                                <h2>Accountability view</h2>
                            </div>
                            <Link to="/branches">Branches</Link>
                        </div>

                        <BranchPerformanceTable rows={branchRows} />
                    </article>
                </section>

                <section className="dashboard-grid dashboard-grid--main">
                    <article className="dashboard-panel dashboard-panel--wide">
                        <div className="panel-heading">
                            <div>
                                <p>Recent work</p>
                                <h2>Jobs requiring visibility</h2>
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
                                <p>Finance snapshot</p>
                                <h2>{money(revenueTotal)}</h2>
                            </div>
                            <Link to="/invoices">Invoices</Link>
                        </div>

                        <dl className="finance-list">
                            <div>
                                <dt>Collected</dt>
                                <dd>{money(collectedRevenue)}</dd>
                            </div>
                            <div>
                                <dt>Outstanding</dt>
                                <dd>{money(outstandingBalance)}</dd>
                            </div>
                            <div>
                                <dt>Open invoices</dt>
                                <dd>{formatNumber(unpaidInvoices.length)}</dd>
                            </div>
                        </dl>

                        <RevenueChart insights={insights} />
                    </article>
                </section>

                <section className="dashboard-grid dashboard-grid--support">
                    <article className="dashboard-panel">
                        <div className="panel-heading">
                            <div>
                                <p>Status mix</p>
                                <h2>Workload</h2>
                            </div>
                            <Link to="/repairs">Repairs</Link>
                        </div>
                        <WorkloadBars data={insights.repairStatus} />
                    </article>

                    <article className="dashboard-panel">
                        <div className="panel-heading">
                            <div>
                                <p>Priority mix</p>
                                <h2>Risk queue</h2>
                            </div>
                            <Link to="/repairs">Review</Link>
                        </div>
                        <WorkloadBars data={insights.repairPriority} />
                    </article>

                    <article className="dashboard-panel">
                        <div className="panel-heading">
                            <div>
                                <p>Inventory attention</p>
                                <h2>{formatNumber(lowStockItems.length)} items</h2>
                            </div>
                            <Link to="/inventory">Stock</Link>
                        </div>

                        <InventoryAttention items={lowStockItems} />
                    </article>

                    <article className="dashboard-panel communications-panel">
                        <div className="panel-heading">
                            <div>
                                <p>Customer trust</p>
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

                <section className="dashboard-panel next-actions-panel">
                    <div className="panel-heading">
                        <div>
                            <p>Next best actions</p>
                            <h2>What should the shop do next?</h2>
                        </div>
                    </div>

                    <div className="next-actions-grid">
                        <ActionCard
                            tone="red"
                            title={`Follow up ${formatNumber(unpaidInvoices.length)} unpaid invoices`}
                            detail={`Potential cash to recover: ${money(
                                unpaidBalance || outstandingBalance
                            )}`}
                            to="/invoices"
                        />
                        <ActionCard
                            tone="amber"
                            title={`Restock ${formatNumber(
                                lowStockItems.length ||
                                    insights.inventoryHealth.lowStockItems
                            )} critical items`}
                            detail={`${formatNumber(awaitingParts)} repairs may depend on parts`}
                            to="/inventory"
                        />
                        <ActionCard
                            tone="blue"
                            title={`Update ${formatNumber(communicationTotal)} customer touchpoints`}
                            detail="Keep repair status transparent and reduce walk-in calls"
                            to="/communications"
                        />
                        <ActionCard
                            tone="green"
                            title={`Collect ${formatNumber(readyRepairs)} completed jobs`}
                            detail="Convert ready repairs into cash and customer pickup"
                            to="/repairs"
                        />
                        <ActionCard
                            tone="slate"
                            title="Review branch accountability"
                            detail={`${formatNumber(branchRows.length)} branches in current view`}
                            to="/branches"
                        />
                    </div>
                </section>
            </section>
        </DashboardLayout>
    );
}

export default Dashboard;
