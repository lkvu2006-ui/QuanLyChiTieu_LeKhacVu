import { useState } from "react";
import { db } from "../firebase/config";
import { ref, push } from "firebase/database";
import { useAuth } from "../context/AuthContext";

const CATEGORIES = {
  expense: ["Ăn uống", "Sinh hoạt", "Đi lại", "Mua sắm", "Giải trí", "Khác"],
  income: ["Lương", "Thưởng", "Tiền tip", "Đầu tư", "Được tặng", "Khác"],
};

export default function ExpenseForm() {
  const { currentUser } = useAuth();
  const [type, setType] = useState("expense"); // "expense" hoặc "income"
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Ăn uống");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);

  const handleTypeChange = (newType) => {
    setType(newType);
    setCategory(CATEGORIES[newType][0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!amount || !title) return;

    push(ref(db, `expenses/${currentUser.uid}`), {
      title,
      amount: Number(amount),
      type, // 'income' hoặc 'expense'
      category,
      date,
      createdAt: Date.now(),
    });

    setTitle("");
    setAmount("");
  };

  return (
    <div>
      {/* Nút chọn loại giao dịch */}
      <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
        <button
          type="button"
          onClick={() => handleTypeChange("expense")}
          style={{
            flex: 1,
            padding: "8px 16px",
            borderRadius: 8,
            backgroundColor: type === "expense" ? "#fee2e2" : "#f1f5f9",
            color: type === "expense" ? "#dc2626" : "#64748b",
            border:
              type === "expense"
                ? "1px solid #f87171"
                : "1px solid var(--border)",
            fontWeight: 700,
          }}
        >
          📉 Khoản Chi
        </button>
        <button
          type="button"
          onClick={() => handleTypeChange("income")}
          style={{
            flex: 1,
            padding: "8px 16px",
            borderRadius: 8,
            backgroundColor: type === "income" ? "#dcfce7" : "#f1f5f9",
            color: type === "income" ? "#16a34a" : "#64748b",
            border:
              type === "income"
                ? "1px solid #86efac"
                : "1px solid var(--border)",
            fontWeight: 700,
          }}
        >
          📈 Khoản Thu
        </button>
      </div>

      <form
        onSubmit={handleSubmit}
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
          gap: 12,
          alignItems: "end",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <label
            style={{
              fontSize: "0.85rem",
              fontWeight: "600",
              color: "var(--text-muted)",
            }}
          >
            Tên giao dịch
          </label>
          <input
            type="text"
            placeholder={
              type === "expense"
                ? "vd: Ăn trưa, Xăng..."
                : "vd: Tiền lương, Thưởng..."
            }
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <label
            style={{
              fontSize: "0.85rem",
              fontWeight: "600",
              color: "var(--text-muted)",
            }}
          >
            Số tiền (VNĐ)
          </label>
          <input
            type="number"
            placeholder="vd: 50000"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <label
            style={{
              fontSize: "0.85rem",
              fontWeight: "600",
              color: "var(--text-muted)",
            }}
          >
            Danh mục
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {CATEGORIES[type].map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <label
            style={{
              fontSize: "0.85rem",
              fontWeight: "600",
              color: "var(--text-muted)",
            }}
          >
            Ngày thực hiện
          </label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>

        <button
          type="submit"
          style={{
            backgroundColor: type === "expense" ? "#ef4444" : "#16a34a",
            color: "#fff",
            padding: "11px 18px",
            height: 42,
            boxShadow:
              type === "expense"
                ? "0 2px 6px rgba(239, 68, 68, 0.3)"
                : "0 2px 6px rgba(22, 163, 74, 0.3)",
          }}
        >
          {type === "expense" ? "+ Thêm Khoản Chi" : "+ Thêm Khoản Thu"}
        </button>
      </form>
    </div>
  );
}
