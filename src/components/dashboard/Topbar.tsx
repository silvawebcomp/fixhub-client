import "./Topbar.css";

import { useNavigate } from "react-router-dom";

import { useAuth } from "../../hooks/useAuth";

function Topbar() {

    const navigate = useNavigate();

    const { logout } = useAuth();

    function handleLogout() {

        logout();

        navigate("/login");

    }

    return (

        <header className="topbar">

            <div>

                <h2>

                    FixHub Dashboard

                </h2>

            </div>

            <button

                className="logout-btn"

                onClick={handleLogout}

            >

                Logout

            </button>

        </header>

    );

}

export default Topbar;