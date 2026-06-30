import {
    BrowserRouter,
    Routes,
    Route,
} from "react-router-dom";

import "../pages/landing/Landing.css";

import Hero from "../pages/landing/Hero";
import Features from "../components/ui/Features";
import Stats from "../components/ui/Stats";
import Testimonials from "../components/ui/Testimonials";
import Pricing from "../components/ui/Pricing";
import FAQ from "../components/ui/FAQ";

import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";

import TrackRepair from "../pages/tracking/TrackRepair";

import Dashboard from "../pages/dashboard/Dashboard";

import Repairs from "../pages/repairs/Repairs";
import NewRepair from "../pages/repairs/NewRepair";
import RepairDetails from "../pages/repairs/RepairDetails";

import Customers from "../pages/customers/Customers";
import AddCustomer from "../pages/customers/AddCustomer";

import Inventory from "../pages/inventory/Inventory";
import AddInventory from "../pages/inventory/AddInventory";

import InvoiceList from "../pages/invoices/InvoiceList";
import CreateInvoice from "../pages/invoices/CreateInvoice";
import InvoiceDetails from "../pages/invoices/InvoiceDetails";

import Communications from "../pages/communications/Communications";
import Analytics from "../pages/analytics/Analytics";

import ProtectedRoute from "../components/auth/ProtectedRoute";

function LandingPage() {
    return (
        <>
            <Hero />
            <Features />
            <Stats />
            <Testimonials />
            <Pricing />
            <FAQ />
        </>
    );
}

function AppRouter() {
    return (
        <BrowserRouter>
            <Routes>

                <Route
                    path="/"
                    element={<LandingPage />}
                />

                <Route
                    path="/login"
                    element={<Login />}
                />

                <Route
                    path="/register"
                    element={<Register />}
                />

                <Route
                    path="/track"
                    element={<TrackRepair />}
                />

                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/repairs"
                    element={
                        <ProtectedRoute>
                            <Repairs />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/repairs/new"
                    element={
                        <ProtectedRoute>
                            <NewRepair />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/repairs/:id"
                    element={
                        <ProtectedRoute>
                            <RepairDetails />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/customers"
                    element={
                        <ProtectedRoute>
                            <Customers />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/customers/new"
                    element={
                        <ProtectedRoute>
                            <AddCustomer />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/inventory"
                    element={
                        <ProtectedRoute>
                            <Inventory />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/inventory/new"
                    element={
                        <ProtectedRoute>
                            <AddInventory />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/invoices"
                    element={
                        <ProtectedRoute>
                            <InvoiceList />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/invoices/new"
                    element={
                        <ProtectedRoute>
                            <CreateInvoice />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/invoices/:id"
                    element={
                        <ProtectedRoute>
                            <InvoiceDetails />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/communications"
                    element={
                        <ProtectedRoute>
                            <Communications />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/analytics"
                    element={
                        <ProtectedRoute>
                            <Analytics />
                        </ProtectedRoute>
                    }
                />

            </Routes>
        </BrowserRouter>
    );
}

export default AppRouter;
