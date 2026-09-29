import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError("");
      setLoading(true);
      await login(email, password);
      navigate("/");
    } catch (err) {
      setError("Email hoặc mật khẩu không chính xác.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#0f172a",
        padding: "20px 16px",
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 420,
          backgroundColor: "#ffffff",
          borderRadius: 20,
          boxShadow: "0 20px 40px rgba(0, 0, 0, 0.25)",
          padding: "36px 30px",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Logo & Tiêu đề */}
        <div style={{ textAlign: "center", marginBottom: 26 }}>
          <div style={{ fontSize: "2.4rem", marginBottom: 6 }}>🏺</div>
          <h2
            style={{
              fontSize: "1.65rem",
              fontWeight: 800,
              color: "#0f172a",
              margin: "0 0 6px 0",
              letterSpacing: "-0.5px",
            }}
          >
            Đăng Nhập
          </h2>
          <p
            style={{
              color: "#64748b",
              fontSize: "0.9rem",
              margin: 0,
            }}
          >
            Quản lý tài chính cá nhân thông minh
          </p>
        </div>

        {/* Thông báo lỗi nếu đăng nhập sai */}
        {error && (
          <div
            style={{
              backgroundColor: "#fef2f2",
              border: "1px solid #fecaca",
              color: "#dc2626",
              padding: "10px 14px",
              borderRadius: 10,
              fontSize: "0.85rem",
              fontWeight: 500,
              marginBottom: 18,
              textAlign: "center",
            }}
          >
            {error}
          </div>
        )}

        {/* Form đăng nhập */}
        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: 18 }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <label
              style={{
                fontSize: "0.85rem",
                fontWeight: 600,
                color: "#334155",
              }}
            >
              Email
            </label>
            <input
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                width: "100%",
                boxSizing: "border-box",
                padding: "12px 14px",
                borderRadius: 10,
                border: "1px solid #cbd5e1",
                fontSize: "0.95rem",
                outline: "none",
                backgroundColor: "#f8fafc",
                transition: "all 0.2s ease",
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "#2563eb";
                e.target.style.boxShadow = "0 0 0 3px rgba(37, 99, 235, 0.15)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "#cbd5e1";
                e.target.style.boxShadow = "none";
              }}
            />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <label
              style={{
                fontSize: "0.85rem",
                fontWeight: 600,
                color: "#334155",
              }}
            >
              Mật khẩu
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                width: "100%",
                boxSizing: "border-box",
                padding: "12px 14px",
                borderRadius: 10,
                border: "1px solid #cbd5e1",
                fontSize: "0.95rem",
                outline: "none",
                backgroundColor: "#f8fafc",
                transition: "all 0.2s ease",
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "#2563eb";
                e.target.style.boxShadow = "0 0 0 3px rgba(37, 99, 235, 0.15)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "#cbd5e1";
                e.target.style.boxShadow = "none";
              }}
            />
          </div>

          {/* Nút bấm Đăng nhập */}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              marginTop: 6,
              padding: "13px",
              backgroundColor: "#2563eb",
              color: "#ffffff",
              border: "none",
              borderRadius: 10,
              fontSize: "1rem",
              fontWeight: 600,
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.7 : 1,
              boxShadow: "0 4px 12px rgba(37, 99, 235, 0.3)",
              transition: "transform 0.1s ease, background-color 0.2s ease",
            }}
            onMouseOver={(e) => {
              if (!loading) e.currentTarget.style.backgroundColor = "#1d4ed8";
            }}
            onMouseOut={(e) => {
              if (!loading) e.currentTarget.style.backgroundColor = "#2563eb";
            }}
          >
            {loading ? "Đang đăng nhập..." : "Đăng nhập"}
          </button>
        </form>

        {/* Chuyển sang trang đăng ký */}
        <p
          style={{
            marginTop: 24,
            marginBottom: 0,
            textAlign: "center",
            fontSize: "0.9rem",
            color: "#64748b",
          }}
        >
          Chưa có tài khoản?{" "}
          <Link
            to="/register"
            style={{
              color: "#2563eb",
              fontWeight: 600,
              textDecoration: "none",
            }}
          >
            Đăng ký ngay
          </Link>
        </p>
      </div>
    </div>
  );
}
