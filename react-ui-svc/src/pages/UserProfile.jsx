import { useState, useEffect } from "react";
import { getTransactions } from "../services/transactionService";

export default function UserProfile() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // "success" or "error"

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:8080/api/user/profile", {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      if (response.ok) {
        const userData = await response.json();
        setEmail(userData.email || "");
      }
    } catch (error) {
      console.error("Failed to load profile:", error);
    }
  };

  const updateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:8080/api/user/profile", {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email })
      });

      if (response.ok) {
        setMessage("✅ Profile updated successfully!");
        setMessageType("success");
      } else {
        throw new Error("Failed to update profile");
      }
    } catch (error) {
      setMessage("❌ Failed to update profile: " + error.message);
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  const testEmail = async () => {
    setLoading(true);
    setMessage("");

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:8080/api/user/test-email", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      const result = await response.text();

      if (response.ok) {
        setMessage("✅ " + result);
        setMessageType("success");
      } else {
        setMessage("❌ " + result);
        setMessageType("error");
      }
    } catch (error) {
      setMessage("❌ Failed to send test email: " + error.message);
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  const debugAuth = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("❌ No JWT token found in localStorage. Please log in first.");
        return;
      }

      const response = await fetch("http://localhost:8080/api/user/debug/auth", {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      const result = await response.text();

      if (response.ok) {
        if (result.includes("Authenticated as:")) {
          alert("✅ " + result + "\n\nYour JWT token is valid and you're properly authenticated!");
        } else {
          alert("⚠️ Unexpected response: " + result);
        }
      } else if (response.status === 401) {
        alert("❌ 401 Unauthorized: Your JWT token is invalid or expired.\n\nPlease log out and log in again.");
      } else if (response.status === 403) {
        alert("❌ 403 Forbidden: You don't have permission to access this endpoint.\n\nThis might indicate a security configuration issue.");
      } else {
        alert(`❌ HTTP ${response.status}: ${result || 'Unknown error'}`);
      }
    } catch (error) {
      alert("❌ Network Error: " + error.message + "\n\nPossible causes:\n- Server is not running\n- Network connectivity issues\n- CORS policy blocking the request");
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "0 auto" }}>
      <h2>👤 User Profile & Notifications</h2>

      <div style={{
        background: "#f8f9fa",
        padding: "20px",
        borderRadius: "10px",
        marginBottom: "20px"
      }}>
        <p style={{ color: "#666", lineHeight: "1.6" }}>
          Configure your email address to receive important notifications about your investments,
          including maturity reminders 1 week before your investments mature.
        </p>
      </div>

      <form onSubmit={updateProfile} style={{
        background: "white",
        padding: "20px",
        borderRadius: "10px",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
      }}>
        <div style={{ marginBottom: "15px" }}>
          <label style={{
            display: "block",
            marginBottom: "5px",
            fontWeight: "600",
            color: "#333"
          }}>
            📧 Email Address:
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your-email@example.com"
            required
            style={{
              width: "100%",
              padding: "10px",
              border: "1px solid #ddd",
              borderRadius: "5px",
              fontSize: "16px",
              boxSizing: "border-box"
            }}
          />
          <small style={{ color: "#666", display: "block", marginTop: "5px" }}>
            This email will receive maturity notifications and other important updates.
          </small>
        </div>

        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          <button
            type="submit"
            disabled={loading}
            style={{
              padding: "10px 20px",
              background: "#28a745",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: loading ? "not-allowed" : "pointer",
              fontWeight: "600",
              opacity: loading ? 0.6 : 1
            }}
          >
            {loading ? "Saving..." : "💾 Save Profile"}
          </button>

          <button
            type="button"
            onClick={testEmail}
            disabled={loading || !email}
            style={{
              padding: "10px 20px",
              background: "#17a2b8",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: (loading || !email) ? "not-allowed" : "pointer",
              fontWeight: "600",
              opacity: (loading || !email) ? 0.6 : 1
            }}
          >
            {loading ? "Sending..." : "🧪 Test Email"}
          </button>

          <button
            type="button"
            onClick={debugAuth}
            style={{
              padding: "10px 20px",
              background: "#6c757d",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              fontWeight: "600"
            }}
          >
            🔍 Debug Auth
          </button>
        </div>
      </form>

      {message && (
        <div style={{
          marginTop: "20px",
          padding: "15px",
          borderRadius: "5px",
          background: messageType === "success" ? "#d4edda" : "#f8d7da",
          color: messageType === "success" ? "#155724" : "#721c24",
          border: `1px solid ${messageType === "success" ? "#c3e6cb" : "#f5c6cb"}`
        }}>
          {message}
        </div>
      )}

      <div style={{
        background: "#fff3cd",
        padding: "15px",
        borderRadius: "5px",
        marginTop: "20px",
        border: "1px solid #ffeaa7"
      }}>
        <h4 style={{ margin: "0 0 10px 0", color: "#856404" }}>📅 Notification Schedule</h4>
        <ul style={{ color: "#856404", margin: "0", paddingLeft: "20px" }}>
          <li>Maturity reminders are sent <strong>daily at 9 AM</strong></li>
          <li>You'll receive notifications <strong>1 week before</strong> maturity</li>
          <li>Only applies to FD, RD, and RBI Bonds</li>
        </ul>
      </div>
    </div>
  );
}
