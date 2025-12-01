"use client";

import { useState } from "react";
import { ExportButtons } from "../components/ExportButtons";

const SUGGESTIONS = {
  vi: [
    "Em cảm thấy cô đơn vì chưa có nhiều bạn.",
    "Em đang lo lắng về kỳ thi sắp tới.",
    "Em bị stress vì vừa học vừa làm thêm.",
  ],
  en: [
    "I feel lonely because I haven’t made many friends yet.",
    "I’m worried about the upcoming exams.",
    "I feel stressed from studying and working at the same time.",
  ],
  zh: [
    "我觉得有点孤单，因为还没有很多朋友。",
    "我很担心接下来的考试。",
    "一边学习一边打工让我感到很有压力。",
  ],
};

export default function Home() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  // Ngôn ngữ giao diện
  const [language, setLanguage] = useState("vi");

  // Student Profile gửi kèm (nhưng encode vào message để backend cũ không bị 422)
  const [studentProfile, setStudentProfile] = useState({
    student_type: "domestic",
    student_region: "au",
  });

  const backendURL =
    process.env.NEXT_PUBLIC_BACKEND_URL ||
    "https://wellbeingagent.onrender.com/chat";

  const handleSuggestionClick = (text) => {
    setInput(text);
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput("");

    // Hiển thị tin nhắn user trên UI
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);

    setLoading(true);

    try {
      // Encode meta (lang + profile) ngay trong message
      const metaPrefix = `[lang=${language};profile_type=${studentProfile.student_type};profile_region=${studentProfile.student_region}] `;
      const payload = {
        user_id: "demo-user",
        message: metaPrefix + userMessage,
      };

      const res = await fetch(backendURL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        console.error("Backend error status:", res.status);
        throw new Error("Backend returned non-200");
      }

      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.reply || "(No reply)" },
      ]);
    } catch (err) {
      console.error("Error calling backend:", err);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Lỗi kết nối server hoặc backend không phản hồi. Nếu lỗi lặp lại, kiểm tra lại URL backend trên Render.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const currentSuggestions = SUGGESTIONS[language] || SUGGESTIONS.vi;

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
      {/* Header: tiêu đề + chọn ngôn ngữ */}
      <header
        style={{
          width: "100%",
          maxWidth: "960px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "8px",
        }}
      >
        <div>
          <h1 style={{ fontSize: "28px", fontWeight: "bold" }}>
            Wellbeing Companion{" "}
            <span style={{ color: "#60a5fa" }}>v2.1 – Multi-profile</span>
          </h1>
          <p style={{ fontSize: "13px", color: "#9ca3af", marginTop: "4px" }}>
            CBT-based wellbeing chatbot for first-year students. Multi-agent
            backend + research logging.
          </p>
        </div>

        <div style={{ textAlign: "right" }}>
          <label
            style={{
              fontSize: "12px",
              color: "#9ca3af",
              marginRight: "4px",
            }}
          >
            Language
          </label>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            style={{
              padding: "6px 10px",
              borderRadius: "999px",
              border: "1px solid #374151",
              background: "#020617",
              color: "white",
              fontSize: "13px",
            }}
          >
            <option value="vi">VI – Tiếng Việt</option>
            <option value="en">EN – English</option>
            <option value="zh">ZH – 中文</option>
          </select>
        </div>
      </header>

      {/* Hộp Student Profile */}
      <div
        style={{
          background: "#111827",
          padding: "16px",
          borderRadius: "12px",
          width: "100%",
          maxWidth: "960px",
          boxShadow: "0 10px 30px rgba(0,0,0,0.4)",
          display: "grid",
          gridTemplateColumns: "1.2fr 1.3fr",
          gap: "16px",
        }}
      >
        <div>
          <h2 style={{ fontSize: "18px", fontWeight: 600, marginBottom: "8px" }}>
            Student Profile (sent as metadata in message)
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
            Thông tin này được encode vào phần đầu message, nên backend FastAPI
            cũ (chỉ nhận <code>user_id</code>, <code>message</code>) vẫn chạy
            bình thường nhưng agent có thể đọc metadata để phân tích theo
            profile.
          </p>
        </div>

        {/* Gợi ý câu mở đầu */}
        <div>
          <h3 style={{ fontSize: "15px", fontWeight: 600, marginBottom: "8px" }}>
            Quick prompts / Gợi ý câu bắt đầu
          </h3>
          <p style={{ fontSize: "13px", color: "#9ca3af", marginBottom: "8px" }}>
            Click để điền nhanh, sau đó có thể chỉnh lại rồi bấm Gửi.
          </p>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "6px",
            }}
          >
            {currentSuggestions.map((s, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSuggestionClick(s)}
                style={{
                  textAlign: "left",
                  padding: "8px 10px",
                  borderRadius: "999px",
                  background: "#1f2937",
                  border: "1px solid #374151",
                  color: "#e5e7eb",
                  fontSize: "13px",
                  cursor: "pointer",
                }}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Khung chat */}
      <div
        style={{
          width: "100%",
          maxWidth: "960px",
          background: "#111827",
          padding: "16px",
          borderRadius: "12px",
          height: "45vh",
          overflowY: "auto",
          boxShadow: "0 10px 30px rgba(0,0,0,0.4)",
        }}
      >
        {messages.length === 0 && (
          <p style={{ color: "#9ca3af", fontSize: "14px" }}>
            Hãy chia sẻ một điều khiến bạn lo lắng, buồn, stress hoặc cảm thấy
            cô đơn… Chatbot sẽ phản hồi theo multi-agent wellbeing backend. Bạn
            có thể chọn ngôn ngữ ở góc trên bên phải.
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

      {/* Ô nhập + nút Gửi */}
      <div
        style={{
          width: "100%",
          maxWidth: "960px",
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
          placeholder="Nhập điều bạn đang trải qua..."
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

      {/* Nút export CSV + Wellbeing Reports */}
      <div
        style={{
          width: "100%",
          maxWidth: "960px",
          marginTop: "8px",
          alignSelf: "center",
        }}
      >
        <ExportButtons />
      </div>
    </main>
  );
}
