import React, { useState } from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import API from "./api/api";
import Dashboard from "./pages/Dashboard";
import Liabilities from "./components/Liabilities";
import ProtectedLayout from "./components/ProtectedLayout";
import UserProfile from "./pages/UserProfile";
import AIAdvisor from "./pages/AIAdvisor";
import Report from "./pages/MonthlyReport";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const login = async () => {
    try {
      const res = await API.post("/auth/login", { username, password });
      localStorage.setItem("token", res.data);
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      alert("Login failed");
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Login</h2>

      <input placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
      <br /><br />

      <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <br /><br />

      <button onClick={login}>Login</button>
    </div>
  );
}

export default function App() {
  const token = localStorage.getItem("token");

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route element={<ProtectedLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/advisor" element={<AIAdvisor />} />
          <Route path="/report" element={<Report />} />
          <Route path="/liabilities" element={<Liabilities />} />
          <Route path="/profile" element={<UserProfile />} />
        </Route>

        <Route path="/" element={<Navigate to={token ? "/dashboard" : "/login"} replace />} />
      </Routes>
    </Router>
  );
}
