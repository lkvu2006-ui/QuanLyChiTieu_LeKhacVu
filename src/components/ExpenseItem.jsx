import { ref, remove } from "firebase/database";
import { db } from "../firebase/config";
import { useAuth } from "../context/AuthContext";

const ICONS = {
  "Ăn uống": "🍔",
  "Sinh hoạt": "🏠",
  "Đi lại": "🛵",
  "Mua sắm": "🛍️",
  "Giải trí": "🎮",
  Lương: "💵",
  Thưởng: "🎁",
  "Tiền tip": "🪙",
  "Đầu tư": "📈",
  "Được tặng": "🎉",
  Khác: "🔖",
};

export default function ExpenseItem({ expense }) {
  const { currentUser } = useAuth();
  const isIncome = expense.type === "income";

  const handleDelete = () => {
    if (window.confirm(`Bạn có chắc muốn xóa giao dịch "${expense.title}"?`)) {
      remove(ref(db, `expenses/${currentUser.uid}/${expense.id}`));
    }
  };

  return (
    <li
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "14px 16px",
        backgroundColor: "#fff",
        borderRadius: 10,
        border: "1px solid var(--border)",
        marginBottom: 10,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: "50%",
            backgroundColor: isIncome ? "#ecfdf5" : "#fef2f2",
            border: `1px solid ${isIncome ? "#bbf7d0" : "#fecaca"}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "1.3rem",
          }}
        >
          {ICONS[expense.category] || (isIncome ? "💰" : "💸")}
        </div>
        <div>
          <div
            style={{
              fontWeight: 600,
              fontSize: "1rem",
              color: "var(--text-main)",
            }}
          >
            {expense.title}
          </div>
          <div
            style={{
              fontSize: "0.82rem",
              color: "var(--text-muted)",
              marginTop: 2,
            }}
          >
            <span
              style={{
                background: isIncome ? "#dcfce7" : "#fee2e2",
                color: isIncome ? "#15803d" : "#b91c1c",
                padding: "2px 8px",
                borderRadius: 12,
                fontWeight: 600,
                marginRight: 8,
              }}
            >
              {isIncome ? "Thu nhập" : "Chi tiêu"} • {expense.category}
            </span>
            {expense.date}
          </div>
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <span
          style={{
            fontSize: "1.05rem",
            fontWeight: 700,
            color: isIncome ? "#16a34a" : "#dc2626",
          }}
        >
          {isIncome ? "+" : "-"}
          {expense.amount.toLocaleString("vi-VN")} đ
        </span>
        <button
          onClick={handleDelete}
          title="Xóa giao dịch"
          style={{
            background: "#fee2e2",
            color: "#dc2626",
            border: "none",
            width: 30,
            height: 30,
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
          }}
        >
          ✕
        </button>
      </div>
    </li>
  );
}
