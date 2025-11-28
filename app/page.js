"use client";

import { useState } from "react";

export default function Home() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  // NEW: Student Profile
  const [studentProfile, setStudentProfile] = useState({
    student_type: "domestic",
    student_region: "au",
  });

  const backendURL =
    process.env.NEXT_PUBLIC_BACKEND_URL ||
    "https://wellbeingagent.onrender.com/chat";

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput("");

    setMessages((prev) => [
      ...prev,
      { role: "user", content: userMessage },
    ]);

    setLoading(true);

    try {
      const res = await fetch(backendURL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: "demo-user",
          message: userMessage,
          ...studentProfile, // gửi profile lên backend
        }),
      });

      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.reply },
      ]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Lỗi kết nối server hoặc backend không phản hồi.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#050816",
        color: "white",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "24px",
        gap: "16px",
      }}
    >
      <h1 style={{ fontSize: "28px", fontWeight: "bold" }}>
        Wellbeing Companion <span style={{ color: "#60a5fa" }}>v2.0 – Profiles</span>
      </h1>

      {/* Hộp chọn Student Profile */}
      <div
        style={{
          background: "#111827",
          padding: "16px",
          borderRadius: "12px",
          width: "100%",
          maxWidth: "640px",
          boxShadow: "0 10px 30px rgba(0,0,0,0.4)",
        }}
      >
        <h2 style={{ fontSize: "18px", fontWeight: 600, marginBottom: "8px" }}>
          Student Profile (sent to multi-agent backend)
        </h2>

        <label style={{ fontSize: "14px" }}>Student type</label>
        <select
          value={studentProfile.student_type}
          onChange={(e) =>
            setStudentProfile((prev) => ({
              ...prev,
              student_type: e.target.value,
            }))
          }
          style={{
            width: "100%",
            marginTop: "4px",
            marginBottom: "12px",
            padding: "8px",
            borderRadius: "8px",
            border: "1px solid #374151",
            background: "#020617",
            color: "white",
          }}
        >
          <option value="domestic">Domestic (Australia)</option>
          <option value="international">International</option>
        </select>

        <label style={{ fontSize: "14px" }}>Region</label>
        <select
          value={studentProfile.student_region}
          onChange={(e) =>
            setStudentProfile((prev) => ({
              ...prev,
              student_region: e.target.value,
            }))
          }
          style={{
            width: "100%",
            marginTop: "4px",
            padding: "8px",
            borderRadius: "8px",
            border: "1px solid #374151",
            background: "#020617",
            color: "white",
          }}
        >
          <option value="au">🇦🇺 Australia</option>
          <option value="se_asia">🌏 South-East Asia</option>
          <option value="europe">🇪🇺 Europe</option>
          <option value="other">🌍 Other regions</option>
        </select>

        <p style={{ fontSize: "12px", marginTop: "8px", color: "#9ca3af" }}>
          Các lựa chọn này được gửi kèm trong body request tới backend
          (fields: <code>student_type</code>, <code>student_region</code>).
        </p>
      </div>

      {/* Khung chat */}
      <div
        style={{
          width: "100%",
          maxWidth: "640px",
          background: "#111827",
          padding: "16px",
          borderRadius: "12px",
          height: "55vh",
          overflowY: "auto",
          boxShadow: "0 10px 30px rgba(0,0,0,0.4)",
        }}
      >
        {messages.length === 0 && (
          <p style={{ color: "#9ca3af", fontSize: "14px" }}>
            Bắt đầu bằng cách chia sẻ một điều khiến bạn lo lắng, buồn, stress
            hoặc thấy cô đơn. Chatbot sẽ phản hồi dựa trên multi-agent wellbeing
            backend (v0.7).
          </p>
        )}

        {messages.map((m, idx) => (
          <div
            key={idx}
            style={{
              marginBottom: "10px",
              display: "flex",
              justifyContent: m.role === "user" ? "flex-end" : "flex-start",
            }}
          >
            <div
              style={{
                maxWidth: "80%",
                padding: "10px 12px",
                borderRadius: "12px",
                background: m.role === "user" ? "#2563eb" : "#374151",
                whiteSpace: "pre-wrap",
                fontSize: "14px",
              }}
            >
              {m.content}
            </div>
          </div>
        ))}
      </div>

      {/* Ô nhập */}
      <div
        style={{
          width: "100%",
          maxWidth: "640px",
          display: "flex",
          gap: "8px",
        }}
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              sendMessage();
            }
          }}
          placeholder="Nhập điều bạn đang lo lắng hoặc muốn chia sẻ..."
          style={{
            flex: 1,
            padding: "10px 12px",
            borderRadius: "999px",
            border: "1px solid #374151",
            background: "#020617",
            color: "white",
            fontSize: "14px",
          }}
        />
        <button
          onClick={sendMessage}
          disabled={loading}
          style={{
            padding: "10px 18px",
            borderRadius: "999px",
            border: "none",
            background: loading ? "#4b5563" : "#2563eb",
            color: "white",
            fontWeight: 600,
            cursor: loading ? "default" : "pointer",
          }}
        >
          {loading ? "..." : "Gửi"}
        </button>
      </div>
    </main>
  );
}
