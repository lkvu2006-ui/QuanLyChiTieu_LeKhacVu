import { useEffect, useState } from "react";
import { db } from "../firebase/config";
import { ref, onValue } from "firebase/database";
import { useAuth } from "../context/AuthContext";
import ExpenseForm from "../components/ExpenseForm";
import ExpenseItem from "../components/ExpenseItem";
import ExpenseChart from "../components/ExpenseChart";
import CalendarView from "../components/CalendarView";

export default function Dashboard() {
  const { currentUser, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [transactions, setTransactions] = useState([]);
  const [filterType, setFilterType] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  const [budget, setBudget] = useState(() => {
    return (
      Number(localStorage.getItem(`budget_${currentUser?.uid}`)) || 5000000
    );
  });

  // Tự động nhận diện kích thước màn hình thiết bị
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Lắng nghe dữ liệu realtime từ Firebase
  useEffect(() => {
    if (!currentUser) return;
    const expensesRef = ref(db, `expenses/${currentUser.uid}`);
    return onValue(expensesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const list = Object.keys(data)
          .map((key) => ({
            id: key,
            type: data[key].type || "expense",
            ...data[key],
          }))
          .reverse();
        setTransactions(list);
      } else {
        setTransactions([]);
      }
    });
  }, [currentUser]);

  const handleBudgetChange = (e) => {
    const val = Number(e.target.value);
    setBudget(val);
    localStorage.setItem(`budget_${currentUser?.uid}`, val);
  };

  // Tính toán số liệu
  const totalIncome = transactions
    .filter((item) => item.type === "income")
    .reduce((acc, cur) => acc + cur.amount, 0);

  const totalExpense = transactions
    .filter((item) => item.type === "expense")
    .reduce((acc, cur) => acc + cur.amount, 0);

  const balance = totalIncome - totalExpense;

  const filtered = transactions.filter((item) => {
    const matchType = filterType === "All" || item.type === filterType;
    const matchSearch = item.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return matchType && matchSearch;
  });

  const expenseTransactions = transactions.filter(
    (item) => item.type === "expense",
  );
  const percentUsed =
    budget > 0 ? Math.min(Math.round((totalExpense / budget) * 100), 100) : 0;
  const isOverBudget = totalExpense > budget && budget > 0;

  const exportToCSV = () => {
    if (transactions.length === 0) return alert("Chưa có dữ liệu để xuất!");
    const headers = "Loại,Tên giao dịch,Danh mục,Số tiền,Ngày\n";
    const rows = transactions
      .map(
        (item) =>
          `"${item.type === "income" ? "Thu nhập" : "Chi tiêu"}","${item.title}","${item.category}",${item.amount},"${item.date}"`,
      )
      .join("\n");
    const blob = new Blob(["\uFEFF" + headers + rows], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `cost-management-bao-cao-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Menu Sidebar items
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: "📊" },
    { id: "calendar", label: "Lịch thu chi", icon: "📅" },
    { id: "transactions", label: "Khoản thu chi", icon: "💳" },
    { id: "budget", label: "Ngân sách", icon: "🎯" },
    { id: "reports", label: "Báo cáo", icon: "📈" },
    { id: "settings", label: "Cài đặt", icon: "⚙️" },
  ];

  return (
    <div
      style={{
        display: "flex",
        flexDirection: isMobile ? "column" : "row",
        minHeight: "100vh",
        backgroundColor: "#0f172a",
      }}
    >
      {/* SIDEBAR */}
      <aside
        style={{
          width: isMobile ? "100%" : 260,
          backgroundColor: "#111827",
          padding: isMobile ? "12px 16px" : "24px 16px",
          display: "flex",
          flexDirection: isMobile ? "row" : "column",
          alignItems: isMobile ? "center" : "stretch",
          justifyContent: isMobile ? "space-between" : "flex-start",
          borderRight: isMobile ? "none" : "1px solid #1f2937",
          borderBottom: isMobile ? "1px solid #1f2937" : "none",
          flexWrap: isMobile ? "wrap" : "nowrap",
          gap: isMobile ? 12 : 0,
        }}
      >
        {/* Logo Cost Management */}
        <div
          style={{
            padding: isMobile ? 0 : "0 12px 28px",
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          <span style={{ fontSize: "1.5rem" }}>🏺</span>
          <h1
            style={{
              fontSize: "1.2rem",
              fontWeight: 800,
              background: "linear-gradient(135deg, #38bdf8 0%, #3b82f6 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              letterSpacing: 0.5,
              margin: 0,
            }}
          >
            Cost Management
          </h1>
        </div>

        {/* Danh sách menu (trên điện thoại có thể vuốt ngang) */}
        <nav
          style={{
            display: "flex",
            flexDirection: isMobile ? "row" : "column",
            gap: 6,
            flex: 1,
            overflowX: isMobile ? "auto" : "visible",
            width: isMobile ? "100%" : "auto",
            paddingBottom: isMobile ? 6 : 0,
          }}
        >
          {menuItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: isMobile ? "8px 14px" : "12px 16px",
                  borderRadius: 10,
                  fontSize: isMobile ? "0.85rem" : "0.95rem",
                  fontWeight: 600,
                  color: isActive ? "#ffffff" : "#94a3b8",
                  backgroundColor: isActive ? "#2563eb" : "transparent",
                  textAlign: "left",
                  border: "none",
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                  flexShrink: 0,
                  transition: "all 0.15s ease",
                }}
              >
                <span>{item.icon}</span>
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Nút đăng xuất (ẩn bớt UID/Email trên mobile để đỡ chật chội) */}
        {!isMobile && (
          <div style={{ borderTop: "1px solid #1f2937", paddingTop: 16 }}>
            <div
              style={{
                fontSize: "0.8rem",
                color: "#64748b",
                marginBottom: 8,
                padding: "0 8px",
                wordBreak: "break-all",
              }}
            >
              {currentUser?.email}
            </div>
            <button
              onClick={logout}
              style={{
                width: "100%",
                padding: "10px 14px",
                borderRadius: 8,
                backgroundColor: "#1e293b",
                color: "#f87171",
                border: "1px solid #334155",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                cursor: "pointer",
              }}
            >
              <span>🚪</span> Đăng xuất
            </button>
          </div>
        )}
      </aside>

      {/* NỘI DUNG CHÍNH */}
      <main
        style={{
          flex: 1,
          backgroundColor: "#f8fafc",
          padding: isMobile ? "20px 16px" : "32px 36px",
          overflowY: "auto",
        }}
      >
        {/* TAB 1: DASHBOARD */}
        {activeTab === "dashboard" && (
          <div>
            <div style={{ marginBottom: 20 }}>
              <h2
                style={{
                  fontSize: isMobile ? "1.25rem" : "1.5rem",
                  fontWeight: 700,
                  color: "#0f172a",
                }}
              >
                Tổng quan tài chính
              </h2>
              <p style={{ color: "#64748b", fontSize: "0.85rem" }}>
                Xem nhanh tình hình thu chi và các biến động tài sản
              </p>
            </div>

            {/* 3 Thẻ thống kê (Tự động co giãn 1 cột trên mobile) */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: isMobile
                  ? "1fr"
                  : "repeat(auto-fit, minmax(240px, 1fr))",
                gap: 16,
                marginBottom: 24,
              }}
            >
              <div
                style={{
                  background: "#fff",
                  padding: 20,
                  borderRadius: 14,
                  border: "1px solid #e2e8f0",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.03)",
                }}
              >
                <span
                  style={{
                    fontSize: "0.85rem",
                    color: "#64748b",
                    fontWeight: 600,
                  }}
                >
                  SỐ DƯ HIỆN TẠI
                </span>
                <div
                  style={{
                    fontSize: isMobile ? "1.4rem" : "1.7rem",
                    fontWeight: 800,
                    color: balance >= 0 ? "#2563eb" : "#dc2626",
                    marginTop: 8,
                  }}
                >
                  {balance.toLocaleString("vi-VN")} đ
                </div>
              </div>

              <div
                style={{
                  background: "#fff",
                  padding: 20,
                  borderRadius: 14,
                  border: "1px solid #e2e8f0",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.03)",
                }}
              >
                <span
                  style={{
                    fontSize: "0.85rem",
                    color: "#64748b",
                    fontWeight: 600,
                  }}
                >
                  TỔNG THU NHẬP (+)
                </span>
                <div
                  style={{
                    fontSize: isMobile ? "1.4rem" : "1.7rem",
                    fontWeight: 800,
                    color: "#16a34a",
                    marginTop: 8,
                  }}
                >
                  +{totalIncome.toLocaleString("vi-VN")} đ
                </div>
              </div>

              <div
                style={{
                  background: "#fff",
                  padding: 20,
                  borderRadius: 14,
                  border: "1px solid #e2e8f0",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.03)",
                }}
              >
                <span
                  style={{
                    fontSize: "0.85rem",
                    color: "#64748b",
                    fontWeight: 600,
                  }}
                >
                  TỔNG CHI TIÊU (-)
                </span>
                <div
                  style={{
                    fontSize: isMobile ? "1.4rem" : "1.7rem",
                    fontWeight: 800,
                    color: "#dc2626",
                    marginTop: 8,
                  }}
                >
                  -{totalExpense.toLocaleString("vi-VN")} đ
                </div>
              </div>
            </div>

            {/* Khung biểu đồ & Giao dịch */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: isMobile
                  ? "1fr"
                  : "repeat(auto-fit, minmax(320px, 1fr))",
                gap: 20,
              }}
            >
              <div
                style={{
                  background: "#fff",
                  padding: 20,
                  borderRadius: 14,
                  border: "1px solid #e2e8f0",
                }}
              >
                <h3 style={{ fontSize: "1.05rem", marginBottom: 12 }}>
                  Cơ cấu chi tiêu
                </h3>
                <ExpenseChart data={expenseTransactions} />
              </div>

              <div
                style={{
                  background: "#fff",
                  padding: 20,
                  borderRadius: 14,
                  border: "1px solid #e2e8f0",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 16,
                  }}
                >
                  <h3 style={{ fontSize: "1.05rem" }}>Giao dịch gần đây</h3>
                  <button
                    onClick={() => setActiveTab("transactions")}
                    style={{
                      color: "#2563eb",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      fontWeight: 600,
                      fontSize: "0.85rem",
                    }}
                  >
                    Xem tất cả →
                  </button>
                </div>
                <ul style={{ listStyle: "none", padding: 0 }}>
                  {transactions.slice(0, 4).map((item) => (
                    <ExpenseItem key={item.id} expense={item} />
                  ))}
                  {transactions.length === 0 && (
                    <p style={{ color: "#94a3b8" }}>Chưa có giao dịch nào.</p>
                  )}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: LỊCH THU CHI */}
        {activeTab === "calendar" && (
          <div>
            <div style={{ marginBottom: 20 }}>
              <h2
                style={{
                  fontSize: isMobile ? "1.25rem" : "1.5rem",
                  fontWeight: 700,
                  color: "#0f172a",
                }}
              >
                Lịch Theo Dõi Thu Chi
              </h2>
              <p style={{ color: "#64748b", fontSize: "0.85rem" }}>
                Xem trực quan biến động dòng tiền theo từng ngày trong tháng
              </p>
            </div>
            <CalendarView transactions={transactions} />
          </div>
        )}

        {/* TAB 3: KHOẢN THU CHI */}
        {activeTab === "transactions" && (
          <div>
            <div style={{ marginBottom: 20 }}>
              <h2
                style={{
                  fontSize: isMobile ? "1.25rem" : "1.5rem",
                  fontWeight: 700,
                  color: "#0f172a",
                }}
              >
                Quản lý Khoản Thu Chi
              </h2>
              <p style={{ color: "#64748b", fontSize: "0.85rem" }}>
                Thêm giao dịch mới và tra cứu lịch sử chi tiết
              </p>
            </div>

            <div
              style={{
                background: "#fff",
                padding: 20,
                borderRadius: 14,
                border: "1px solid #e2e8f0",
                marginBottom: 20,
              }}
            >
              <h3 style={{ fontSize: "1.05rem", marginBottom: 16 }}>
                Thêm giao dịch mới
              </h3>
              <ExpenseForm />
            </div>

            <div
              style={{
                background: "#fff",
                padding: 20,
                borderRadius: 14,
                border: "1px solid #e2e8f0",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: isMobile ? "column" : "row",
                  gap: 10,
                  marginBottom: 16,
                }}
              >
                <input
                  type="text"
                  placeholder="🔍 Tìm kiếm giao dịch..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{
                    flex: 1,
                    padding: "10px 14px",
                    borderRadius: 8,
                    border: "1px solid #cbd5e1",
                  }}
                />
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  style={{
                    padding: "10px 14px",
                    borderRadius: 8,
                    border: "1px solid #cbd5e1",
                  }}
                >
                  <option value="All">Tất cả giao dịch</option>
                  <option value="income">Chỉ khoản thu (+)</option>
                  <option value="expense">Chỉ khoản chi (-)</option>
                </select>
              </div>
              <ul style={{ listStyle: "none", padding: 0 }}>
                {filtered.map((item) => (
                  <ExpenseItem key={item.id} expense={item} />
                ))}
                {filtered.length === 0 && (
                  <p
                    style={{
                      color: "#94a3b8",
                      textAlign: "center",
                      padding: 20,
                    }}
                  >
                    Không tìm thấy giao dịch phù hợp.
                  </p>
                )}
              </ul>
            </div>
          </div>
        )}

        {/* TAB 4: NGÂN SÁCH */}
        {activeTab === "budget" && (
          <div>
            <div style={{ marginBottom: 20 }}>
              <h2
                style={{
                  fontSize: isMobile ? "1.25rem" : "1.5rem",
                  fontWeight: 700,
                  color: "#0f172a",
                }}
              >
                Thiết lập Ngân sách
              </h2>
              <p style={{ color: "#64748b", fontSize: "0.85rem" }}>
                Kiểm soát hạn mức chi tiêu để không bị bội chi
              </p>
            </div>

            <div
              style={{
                background: "#fff",
                padding: 20,
                borderRadius: 14,
                border: "1px solid #e2e8f0",
                maxWidth: 640,
              }}
            >
              <label
                style={{
                  fontSize: "0.85rem",
                  fontWeight: 600,
                  color: "#64748b",
                  display: "block",
                  marginBottom: 8,
                }}
              >
                HẠN MỨC CHI TIÊU HÀNG THÁNG (VNĐ)
              </label>
              <input
                type="number"
                value={budget}
                onChange={handleBudgetChange}
                style={{
                  width: "100%",
                  fontSize: "1.15rem",
                  fontWeight: 700,
                  marginBottom: 20,
                  padding: "10px 14px",
                  borderRadius: 8,
                  border: "1px solid #cbd5e1",
                }}
              />

              <div
                style={{
                  marginBottom: 12,
                  display: "flex",
                  flexDirection: isMobile ? "column" : "row",
                  justifyContent: "space-between",
                  gap: 6,
                  fontSize: "0.95rem",
                }}
              >
                <span>
                  Đã chi tiêu:{" "}
                  <strong>{totalExpense.toLocaleString("vi-VN")} đ</strong>
                </span>
                <span
                  style={{
                    color: isOverBudget ? "#dc2626" : "#16a34a",
                    fontWeight: 700,
                  }}
                >
                  {isOverBudget
                    ? "⚠️ Vượt hạn mức!"
                    : `Còn lại: ${(budget - totalExpense).toLocaleString("vi-VN")} đ`}
                </span>
              </div>

              <div
                style={{
                  width: "100%",
                  height: 12,
                  backgroundColor: "#f1f5f9",
                  borderRadius: 6,
                  overflow: "hidden",
                  marginBottom: 14,
                }}
              >
                <div
                  style={{
                    width: `${percentUsed}%`,
                    height: "100%",
                    backgroundColor: isOverBudget ? "#dc2626" : "#2563eb",
                    transition: "width 0.3s ease",
                  }}
                />
              </div>
              <p style={{ fontSize: "0.85rem", color: "#64748b" }}>
                Bạn đã sử dụng <strong>{percentUsed}%</strong> ngân sách đặt ra.
              </p>
            </div>
          </div>
        )}

        {/* TAB 5: BÁO CÁO */}
        {activeTab === "reports" && (
          <div>
            <div
              style={{
                display: "flex",
                flexDirection: isMobile ? "column" : "row",
                justifyContent: "space-between",
                alignItems: isMobile ? "flex-start" : "center",
                gap: 12,
                marginBottom: 20,
              }}
            >
              <div>
                <h2
                  style={{
                    fontSize: isMobile ? "1.25rem" : "1.5rem",
                    fontWeight: 700,
                    color: "#0f172a",
                  }}
                >
                  Báo cáo & Xuất dữ liệu
                </h2>
                <p style={{ color: "#64748b", fontSize: "0.85rem" }}>
                  Tải báo cáo chi tiết về máy để lưu trữ hoặc nộp báo cáo
                </p>
              </div>
              <button
                onClick={exportToCSV}
                style={{
                  backgroundColor: "#2563eb",
                  color: "#fff",
                  padding: "10px 18px",
                  borderRadius: 8,
                  border: "none",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  fontWeight: 600,
                }}
              >
                📥 Tải file Excel (CSV)
              </button>
            </div>

            <div
              style={{
                background: "#fff",
                padding: 20,
                borderRadius: 14,
                border: "1px solid #e2e8f0",
              }}
            >
              <h3 style={{ fontSize: "1.05rem", marginBottom: 14 }}>
                Phân tích các khoản chi
              </h3>
              <ExpenseChart data={expenseTransactions} />
            </div>
          </div>
        )}

        {/* TAB 6: CÀI ĐẶT */}
        {activeTab === "settings" && (
          <div>
            <div style={{ marginBottom: 20 }}>
              <h2
                style={{
                  fontSize: isMobile ? "1.25rem" : "1.5rem",
                  fontWeight: 700,
                  color: "#0f172a",
                }}
              >
                Cài đặt tài khoản
              </h2>
              <p style={{ color: "#64748b", fontSize: "0.85rem" }}>
                Thông tin hệ thống và quản trị tài khoản
              </p>
            </div>

            <div
              style={{
                background: "#fff",
                padding: 20,
                borderRadius: 14,
                border: "1px solid #e2e8f0",
                maxWidth: 600,
              }}
            >
              <div style={{ marginBottom: 16 }}>
                <span
                  style={{
                    fontSize: "0.85rem",
                    color: "#64748b",
                    fontWeight: 600,
                    display: "block",
                  }}
                >
                  EMAIL ĐĂNG NHẬP
                </span>
                <span
                  style={{
                    fontSize: "0.95rem",
                    fontWeight: 600,
                    color: "#0f172a",
                    wordBreak: "break-all",
                  }}
                >
                  {currentUser?.email}
                </span>
              </div>
              <div style={{ marginBottom: 20 }}>
                <span
                  style={{
                    fontSize: "0.85rem",
                    color: "#64748b",
                    fontWeight: 600,
                    display: "block",
                  }}
                >
                  MÃ ĐỊNH DANH (UID)
                </span>
                <span
                  style={{
                    fontSize: "0.85rem",
                    color: "#64748b",
                    wordBreak: "break-all",
                  }}
                >
                  {currentUser?.uid}
                </span>
              </div>
              <button
                onClick={logout}
                style={{
                  backgroundColor: "#fee2e2",
                  color: "#dc2626",
                  padding: "10px 18px",
                  borderRadius: 8,
                  border: "1px solid #fecaca",
                  cursor: "pointer",
                  fontWeight: 600,
                }}
              >
                Đăng xuất khỏi ứng dụng
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
