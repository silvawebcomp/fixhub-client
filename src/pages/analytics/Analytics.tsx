import "./Analytics.css";

import { useEffect, useMemo, useState } from "react";

import DashboardLayout from "../../layouts/DashboardLayout";
import {
    getBusinessInsights,
    type BusinessInsights,
    type InsightPoint,
} from "../../services/dashboardService";

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

function money(value: number) {
    return `NGN ${value.toLocaleString()}`;
}

function percent(value: number, max: number) {
    if (max <= 0) {
        return 0;
    }

    return Math.max(4, Math.round((value / max) * 100));
}

function InsightBars({ data }: { data: InsightPoint[] }) {
    const max = Math.max(...data.map((item) => item.value), 0);

    if (data.length === 0) {
        return <p className="empty-chart">No data yet.</p>;
    }

    return (
        <div className="insight-bars">
            {data.map((item) => (
                <div className="insight-bar-row" key={item.label}>
                    <span>{item.label}</span>
                    <div>
                        <i style={{ width: `${percent(item.value, max)}%` }} />
                    </div>
                    <strong>{item.value}</strong>
                </div>
            ))}
        </div>
    );
}

function Analytics() {
    const [insights, setInsights] = useState<BusinessInsights>(EMPTY_INSIGHTS);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        let active = true;

        getBusinessInsights()
            .then((data) => {
                if (active) {
                    setInsights(data);
                }
            })
            .catch((requestError) => {
                if (active) {
                    setError(
                        requestError instanceof Error
                            ? requestError.message
                            : "Unable to load business insights."
                    );
                }
            })
            .finally(() => {
                if (active) {
                    setLoading(false);
                }
            });

        return () => {
            active = false;
        };
    }, []);

    const maxRevenue = useMemo(
        () =>
            Math.max(
                ...insights.revenueTrend.map((point) =>
                    Math.max(point.billed, point.collected, point.outstanding)
                ),
                0
            ),
        [insights.revenueTrend]
    );

    const communicationTotal =
        insights.communicationTotals.WhatsApp +
        insights.communicationTotals.SMS +
        insights.communicationTotals.Email;

    return (
        <DashboardLayout>
            <section className="analytics-page">
                <header className="analytics-header">
                    <div>
                        <p className="eyebrow">Business intelligence</p>
                        <h1>Insights</h1>
                        <p>
                            Monitor revenue, repair workload, stock risk, and customer
                            communication from one view.
                        </p>
                    </div>
                </header>

                {error && <p className="form-error">{error}</p>}

                {loading ? (
                    <p className="loading-state">Loading insights...</p>
                ) : (
                    <>
                        <section className="analytics-kpis">
                            <div>
                                <span>Total revenue</span>
                                <strong>{money(insights.kpis.totalRevenue)}</strong>
                            </div>
                            <div>
                                <span>Collected</span>
                                <strong>{money(insights.kpis.collectedRevenue)}</strong>
                            </div>
                            <div>
                                <span>Outstanding</span>
                                <strong>{money(insights.kpis.outstandingBalance)}</strong>
                            </div>
                            <div>
                                <span>Collection rate</span>
                                <strong>{insights.kpis.collectionRate}%</strong>
                            </div>
                        </section>

                        <section className="analytics-grid">
                            <article className="analytics-panel revenue-panel">
                                <div className="panel-heading">
                                    <h2>Revenue trend</h2>
                                    <p>Last six invoice months.</p>
                                </div>

                                {insights.revenueTrend.length === 0 ? (
                                    <p className="empty-chart">No invoice data yet.</p>
                                ) : (
                                    <div className="revenue-chart">
                                        {insights.revenueTrend.map((point) => (
                                            <div className="revenue-month" key={point.month}>
                                                <div className="revenue-bars">
                                                    <i
                                                        className="billed"
                                                        style={{
                                                            height: `${percent(
                                                                point.billed,
                                                                maxRevenue
                                                            )}%`,
                                                        }}
                                                    />
                                                    <i
                                                        className="collected"
                                                        style={{
                                                            height: `${percent(
                                                                point.collected,
                                                                maxRevenue
                                                            )}%`,
                                                        }}
                                                    />
                                                    <i
                                                        className="outstanding"
                                                        style={{
                                                            height: `${percent(
                                                                point.outstanding,
                                                                maxRevenue
                                                            )}%`,
                                                        }}
                                                    />
                                                </div>
                                                <span>{point.month}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </article>

                            <article className="analytics-panel">
                                <div className="panel-heading">
                                    <h2>Repair status</h2>
                                    <p>Current repair workload split.</p>
                                </div>
                                <InsightBars data={insights.repairStatus} />
                            </article>

                            <article className="analytics-panel">
                                <div className="panel-heading">
                                    <h2>Repair priority</h2>
                                    <p>Urgency profile for open and closed repairs.</p>
                                </div>
                                <InsightBars data={insights.repairPriority} />
                            </article>

                            <article className="analytics-panel inventory-health-panel">
                                <div className="panel-heading">
                                    <h2>Inventory health</h2>
                                    <p>Stock risk and asset value.</p>
                                </div>
                                <dl>
                                    <div>
                                        <dt>Total items</dt>
                                        <dd>{insights.inventoryHealth.totalItems}</dd>
                                    </div>
                                    <div>
                                        <dt>Low stock</dt>
                                        <dd>{insights.inventoryHealth.lowStockItems}</dd>
                                    </div>
                                    <div>
                                        <dt>Stock units</dt>
                                        <dd>{insights.inventoryHealth.stockUnits}</dd>
                                    </div>
                                    <div>
                                        <dt>Value</dt>
                                        <dd>{money(insights.inventoryHealth.inventoryValue)}</dd>
                                    </div>
                                </dl>
                            </article>

                            <article className="analytics-panel communication-health-panel">
                                <div className="panel-heading">
                                    <h2>Customer outreach</h2>
                                    <p>{communicationTotal} logged messages.</p>
                                </div>
                                <div className="communication-donut">
                                    <strong>{communicationTotal}</strong>
                                    <span>Total</span>
                                </div>
                                <dl>
                                    <div>
                                        <dt>WhatsApp</dt>
                                        <dd>{insights.communicationTotals.WhatsApp}</dd>
                                    </div>
                                    <div>
                                        <dt>SMS</dt>
                                        <dd>{insights.communicationTotals.SMS}</dd>
                                    </div>
                                    <div>
                                        <dt>Email</dt>
                                        <dd>{insights.communicationTotals.Email}</dd>
                                    </div>
                                </dl>
                            </article>
                        </section>
                    </>
                )}
            </section>
        </DashboardLayout>
    );
}

export default Analytics;
