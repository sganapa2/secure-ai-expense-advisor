import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Navbar() {
    const navigate = useNavigate();
    const location = useLocation();
    const [username, setUsername] = useState("");

    useEffect(() => {
        // Try to load profile to show username (non-blocking)
        const token = localStorage.getItem("token");
        if (!token) return;

        fetch("/api/user/profile", {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then((r) => {
                if (!r.ok) return null;
                return r.json();
            })
            .then((data) => {
                if (data && data.username) setUsername(data.username);
            })
            .catch(() => {
                // ignore
            });
    }, []);

    const handleLogout = () => {
        const ok = window.confirm("Are you sure you want to logout?");
        if (!ok) return;
        localStorage.removeItem("token");
        navigate("/login");
    };

    const navButton = (path, label) => (
        <button
            className={location.pathname === path ? "nav-btn active" : "nav-btn"}
            onClick={() => navigate(path)}
        >
            {label}
        </button>
    );

    return (
        <nav className="navbar">
            <div className="nav-left">
                <div className="brand">Expense Advisor</div>
                <div className="nav-links">
                    {navButton("/dashboard", "📊 Dashboard")}
                    {navButton("/advisor", "🧠 AI Advisor")}
                    {navButton("/report", "📈 Report")}
                    {navButton("/liabilities", "💳 Liabilities")}
                    {navButton("/profile", "👤 Profile")}
                </div>
            </div>

            <div className="nav-right">
                {username && <span className="nav-username">{username}</span>}
                <button className="logout-btn" onClick={handleLogout}>
                    Logout
                </button>
            </div>
        </nav>
    );
}