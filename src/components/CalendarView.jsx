import { useState } from "react";

export default function CalendarView({ transactions }) {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 8, 1));
  const [selectedDateStr, setSelectedDateStr] = useState("2026-09-07");

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const firstDayIndex = new Date(year, month, 1).getDay();
  const adjustedFirstDay = firstDayIndex === 0 ? 6 : firstDayIndex - 1;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  const dailySummary = {};
  let monthlyIncome = 0;
  let monthlyExpense = 0;

  transactions.forEach((tx) => {
    if (!tx.date) return;
    const [txYear, txMonth] = tx.date.split("-").map(Number);
    if (txYear === year && txMonth === month + 1) {
      if (tx.type === "income") monthlyIncome += tx.amount;
      if (tx.type === "expense") monthlyExpense += tx.amount;
    }

    if (!dailySummary[tx.date]) {
      dailySummary[tx.date] = { income: 0, expense: 0, items: [] };
    }
    if (tx.type === "income") {
      dailySummary[tx.date].income += tx.amount;
    } else {
      dailySummary[tx.date].expense += tx.amount;
    }
    dailySummary[tx.date].items.push(tx);
  });

  const calendarCells = [];

  for (let i = adjustedFirstDay - 1; i >= 0; i--) {
    calendarCells.push({
      dayNumber: daysInPrevMonth - i,
      isCurrentMonth: false,
      dateStr: null,
    });
  }

  for (let d = 1; d <= daysInMonth; d++) {
    const formattedD = String(d).padStart(2, "0");
    const formattedM = String(month + 1).padStart(2, "0");
    const dateStr = `${year}-${formattedM}-${formattedD}`;
    calendarCells.push({
      dayNumber: d,
      isCurrentMonth: true,
      dateStr,
      data: dailySummary[dateStr] || { income: 0, expense: 0, items: [] },
    });
  }

  const remaining =
    35 - calendarCells.length > 0
      ? 35 - calendarCells.length
      : 42 - calendarCells.length;
  for (let next = 1; next <= remaining; next++) {
    calendarCells.push({
      dayNumber: next,
      isCurrentMonth: false,
      dateStr: null,
    });
  }

  const selectedData = dailySummary[selectedDateStr] || {
    income: 0,
    expense: 0,
    items: [],
  };
  const monthlyBalance = monthlyIncome - monthlyExpense;

  return (
    <div
      style={{
        width: "100%",
        display: "grid",
        gridTemplateColumns: "1.8fr 1fr",
        gap: 24,
        alignItems: "start",
      }}
    >
      {/* CỘT TRÁI: BẢNG LỊCH TRÀN RỘNG */}
      <div
        style={{
          backgroundColor: "#111827",
          borderRadius: 16,
          padding: "24px",
          border: "1px solid #1f2937",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.25)",
        }}
      >
        {/* Điều hướng tháng */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            backgroundColor: "#1e293b",
            padding: "12px 20px",
            borderRadius: 12,
            marginBottom: 20,
          }}
        >
          <button
            onClick={prevMonth}
            style={{
              background: "#334155",
              color: "#fff",
              border: "none",
              width: 34,
              height: 34,
              borderRadius: 8,
              cursor: "pointer",
              fontSize: "1rem",
            }}
          >
            ❮
          </button>
          <div
            style={{
              color: "#fff",
              fontWeight: 700,
              fontSize: "1.2rem",
              letterSpacing: 0.5,
            }}
          >
            {String(month + 1).padStart(2, "0")}/{year}
            <span
              style={{
                fontSize: "0.85rem",
                color: "#94a3b8",
                fontWeight: 400,
                marginLeft: 10,
              }}
            >
              (01/{String(month + 1).padStart(2, "0")} – {daysInMonth}/
              {String(month + 1).padStart(2, "0")})
            </span>
          </div>
          <button
            onClick={nextMonth}
            style={{
              background: "#334155",
              color: "#fff",
              border: "none",
              width: 34,
              height: 34,
              borderRadius: 8,
              cursor: "pointer",
              fontSize: "1rem",
            }}
          >
            ❯
          </button>
        </div>

        {/* Tiêu đề các thứ trong tuần */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(7, 1fr)",
            textAlign: "center",
            fontWeight: 700,
            fontSize: "0.9rem",
            marginBottom: 10,
          }}
        >
          <div style={{ color: "#cbd5e1" }}>T2</div>
          <div style={{ color: "#cbd5e1" }}>T3</div>
          <div style={{ color: "#cbd5e1" }}>T4</div>
          <div style={{ color: "#cbd5e1" }}>T5</div>
          <div style={{ color: "#cbd5e1" }}>T6</div>
          <div style={{ color: "#38bdf8" }}>T7</div>
          <div style={{ color: "#f43f5e" }}>CN</div>
        </div>

        {/* Lưới các ô ngày */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(7, 1fr)",
            borderTop: "1px solid #1f2937",
            borderLeft: "1px solid #1f2937",
            borderRadius: 8,
            overflow: "hidden",
          }}
        >
          {calendarCells.map((cell, idx) => {
            const isSelected = cell.dateStr === selectedDateStr;
            const colIndex = idx % 7;
            const isWeekend = colIndex === 5 || colIndex === 6;

            return (
              <div
                key={idx}
                onClick={() =>
                  cell.isCurrentMonth && setSelectedDateStr(cell.dateStr)
                }
                style={{
                  minHeight: 82,
                  padding: "8px 6px",
                  borderRight: "1px solid #1f2937",
                  borderBottom: "1px solid #1f2937",
                  backgroundColor: isSelected
                    ? "#2563eb"
                    : cell.isCurrentMonth
                      ? "#0f172a"
                      : "#090d16",
                  cursor: cell.isCurrentMonth ? "pointer" : "default",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  transition: "background-color 0.15s ease",
                }}
              >
                <div
                  style={{
                    fontSize: "0.85rem",
                    fontWeight: 700,
                    color: isSelected
                      ? "#fff"
                      : !cell.isCurrentMonth
                        ? "#334155"
                        : isWeekend
                          ? colIndex === 5
                            ? "#38bdf8"
                            : "#f43f5e"
                          : "#94a3b8",
                  }}
                >
                  {cell.dayNumber}
                </div>

                {cell.isCurrentMonth && cell.data && (
                  <div
                    style={{
                      fontSize: "0.68rem",
                      textAlign: "right",
                      lineHeight: 1.25,
                    }}
                  >
                    {cell.data.income > 0 && (
                      <div
                        style={{
                          color: isSelected ? "#fff" : "#4ade80",
                          fontWeight: 700,
                        }}
                      >
                        +{cell.data.income.toLocaleString("vi-VN")}
                      </div>
                    )}
                    {cell.data.expense > 0 && (
                      <div
                        style={{
                          color: isSelected ? "#fff" : "#f87171",
                          fontWeight: 700,
                        }}
                      >
                        -{cell.data.expense.toLocaleString("vi-VN")}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* CỘT PHẢI: BẢNG TỔNG KẾT & CHI TIẾT GIAO DỊCH TRONG NGÀY */}
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        {/* Thẻ tổng kết tháng */}
        <div
          style={{
            backgroundColor: "#111827",
            borderRadius: 16,
            padding: "20px 24px",
            border: "1px solid #1f2937",
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            textAlign: "center",
          }}
        >
          <div>
            <div
              style={{ fontSize: "0.8rem", color: "#94a3b8", fontWeight: 600 }}
            >
              Thu nhập
            </div>
            <div
              style={{
                fontSize: "1.15rem",
                fontWeight: 800,
                color: "#4ade80",
                marginTop: 4,
              }}
            >
              +{monthlyIncome.toLocaleString("vi-VN")} đ
            </div>
          </div>
          <div>
            <div
              style={{ fontSize: "0.8rem", color: "#94a3b8", fontWeight: 600 }}
            >
              Chi tiêu
            </div>
            <div
              style={{
                fontSize: "1.15rem",
                fontWeight: 800,
                color: "#f87171",
                marginTop: 4,
              }}
            >
              -{monthlyExpense.toLocaleString("vi-VN")} đ
            </div>
          </div>
          <div>
            <div
              style={{ fontSize: "0.8rem", color: "#94a3b8", fontWeight: 600 }}
            >
              Dư tháng
            </div>
            <div
              style={{
                fontSize: "1.15rem",
                fontWeight: 800,
                color: monthlyBalance >= 0 ? "#38bdf8" : "#f87171",
                marginTop: 4,
              }}
            >
              {monthlyBalance >= 0 ? "+" : ""}
              {monthlyBalance.toLocaleString("vi-VN")} đ
            </div>
          </div>
        </div>

        {/* Danh sách giao dịch của ngày đang click */}
        <div
          style={{
            backgroundColor: "#111827",
            borderRadius: 16,
            padding: "22px 20px",
            border: "1px solid #1f2937",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              paddingBottom: 14,
              borderBottom: "1px solid #1f2937",
              marginBottom: 16,
            }}
          >
            <div>
              <div style={{ color: "#94a3b8", fontSize: "0.8rem" }}>
                Chi tiết ngày
              </div>
              <div
                style={{ color: "#fff", fontWeight: 700, fontSize: "1.1rem" }}
              >
                {selectedDateStr}
              </div>
            </div>
            <div
              style={{
                fontWeight: 800,
                fontSize: "1.1rem",
                color:
                  selectedData.income - selectedData.expense >= 0
                    ? "#38bdf8"
                    : "#f87171",
              }}
            >
              {selectedData.income - selectedData.expense >= 0 ? "+" : ""}
              {(selectedData.income - selectedData.expense).toLocaleString(
                "vi-VN",
              )}{" "}
              đ
            </div>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 10,
              maxHeight: 420,
              overflowY: "auto",
            }}
          >
            {selectedData.items.length === 0 ? (
              <div
                style={{
                  textAlign: "center",
                  padding: "40px 0",
                  color: "#64748b",
                  fontSize: "0.9rem",
                }}
              >
                Không có giao dịch nào vào ngày này.
              </div>
            ) : (
              selectedData.items.map((it) => (
                <div
                  key={it.id}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "12px 14px",
                    backgroundColor: "#1e293b",
                    borderRadius: 10,
                    border: "1px solid #334155",
                  }}
                >
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 12 }}
                  >
                    <span style={{ fontSize: "1.3rem" }}>
                      {it.type === "income" ? "💵" : "🛍️"}
                    </span>
                    <div>
                      <div
                        style={{
                          fontWeight: 600,
                          fontSize: "0.95rem",
                          color: "#f8fafc",
                        }}
                      >
                        {it.title}
                      </div>
                      <div style={{ fontSize: "0.8rem", color: "#94a3b8" }}>
                        {it.category}
                      </div>
                    </div>
                  </div>
                  <div
                    style={{
                      fontWeight: 700,
                      fontSize: "1rem",
                      color: it.type === "income" ? "#4ade80" : "#f87171",
                    }}
                  >
                    {it.type === "income" ? "+" : "-"}
                    {it.amount.toLocaleString("vi-VN")} đ
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
