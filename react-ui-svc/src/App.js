import { useState } from "react";
import API from "./api/api";
import Dashboard from "./pages/Dashboard";

function App() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState(localStorage.getItem("token") || "");

  const login = async () => {
    try {
      const res = await API.post("/auth/login", {
        username,
        password,
      });

      setToken(res.data);
      localStorage.setItem("token", res.data);

      alert("Login successful");
    } catch (err) {
      console.error(err);
      alert("Login failed");
    }
  };

// 🔥 If logged in → show dashboard
  if (token) {
    return <Dashboard />;
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>Login</h2>

      <input
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <br /><br />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <br /><br />

      <button onClick={login}>Login</button>

      <br /><br />
      <div>
        <b>Token:</b> {token}
      </div>
    </div>
  );
}

export default App;