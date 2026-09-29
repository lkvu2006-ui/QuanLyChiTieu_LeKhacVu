import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      return setError("Mật khẩu xác nhận không khớp.");
    }

    if (password.length < 6) {
      return setError("Mật khẩu phải có ít nhất 6 ký tự.");
    }

    try {
      setError("");
      setLoading(true);
      await signup(email, password);
      navigate("/");
    } catch (err) {
      console.error("Chi tiết lỗi Firebase:", err.code, err.message);

      // Bắt chính xác từng mã lỗi của Firebase Authentication
      switch (err.code) {
        case "auth/email-already-in-use":
          setError("Email này đã được sử dụng bởi một tài khoản khác.");
          break;
        case "auth/invalid-email":
          setError("Địa chỉ email không hợp lệ.");
          break;
        case "auth/operation-not-allowed":
          setError(
            "Tính năng Đăng ký bằng Email chưa được kích hoạt trên Firebase Console.",
          );
          break;
        case "auth/weak-password":
          setError("Mật khẩu quá yếu. Vui lòng nhập tối thiểu 6 ký tự.");
          break;
        case "auth/network-request-failed":
          setError("Lỗi kết nối mạng. Vui lòng kiểm tra lại đường truyền.");
          break;
        default:
          setError(err.message || "Không thể tạo tài khoản lúc này.");
      }
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
        <div style={{ textAlign: "center", marginBottom: 24 }}>
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
            Tạo Tài Khoản
          </h2>
          <p
            style={{
              color: "#64748b",
              fontSize: "0.9rem",
              margin: 0,
            }}
          >
            Bắt đầu kiểm soát dòng tiền của bạn
          </p>
        </div>

        {/* Thông báo lỗi động */}
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

        {/* Form đăng ký */}
        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: 16 }}
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

          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <label
              style={{
                fontSize: "0.85rem",
                fontWeight: 600,
                color: "#334155",
              }}
            >
              Xác nhận mật khẩu
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
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

          {/* Nút đăng ký */}
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
            {loading ? "Đang tạo tài khoản..." : "Đăng ký"}
          </button>
        </form>

        {/* Chuyển hướng sang Login */}
        <p
          style={{
            marginTop: 22,
            marginBottom: 0,
            textAlign: "center",
            fontSize: "0.9rem",
            color: "#64748b",
          }}
        >
          Đã có tài khoản?{" "}
          <Link
            to="/login"
            style={{
              color: "#2563eb",
              fontWeight: 600,
              textDecoration: "none",
            }}
          >
            Đăng nhập
          </Link>
        </p>
      </div>
    </div>
  );
}
