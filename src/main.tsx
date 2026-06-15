import React from "react";

import ReactDOM from "react-dom/client";

import App from "./App";

import "./index.css";

import "./styles/responsive.css";

import {

    AuthProvider,

} from "./context/AuthContext";

ReactDOM.createRoot(

    document.getElementById(

        "root"

    ) as HTMLElement

).render(

    <React.StrictMode>

        <AuthProvider>

            <App />

        </AuthProvider>

    </React.StrictMode>

);