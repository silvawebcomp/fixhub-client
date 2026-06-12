import { BrowserRouter, Routes, Route } from "react-router-dom";

import Hero from "../pages/landing/Hero";
import Features from "../components/ui/Features";
import Stats from "../components/ui/Stats";
import Testimonials from "../components/ui/Testimonials";
import Pricing from "../components/ui/Pricing";
import FAQ from "../components/ui/FAQ";

import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import Dashboard from "../pages/dashboard/Dashboard";
import NewRepair from "../pages/repairs/NewRepair";
import Customers from "../pages/customers/Customers";

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
                    path="/dashboard"
                    element={<Dashboard />}
                />

                <Route
                    path="/repairs/new"
                    element={<NewRepair />}
                />

                <Route
                    path="/customers"
                    element={<Customers />}
                />

            </Routes>

        </BrowserRouter>
    );
}

export default AppRouter;