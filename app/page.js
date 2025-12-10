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

  // Student Profile (encode vào message để backend cũ vẫn chạy được)
  const [studentProfile, setStudentProfile] = useState({
    student_type: "domestic",
    student_region: "au",
  });

  const backendURL =
    process.env.NEXT_PUBLIC_BACKEND_URL ||
    "https://wellbeingagent.onrender.com/chat";

  const currentSuggestions = SUGGESTIONS[language] || SUGGESTIONS.vi;

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
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        console.error("Backend error status:", res.status);
        throw new Error("Backend returned non-200");
      }

      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data.reply || "(No reply)",
        },
      ]);
    } catch (err) {
      console.error("Error calling backend:", err);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Lỗi kết nối server hoặc backend không phản hồi.\nNếu lỗi lặp lại, kiểm tra lại URL backend trên Render.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (!loading) {
        sendMessage();
      }
    }
  };

  return (
    <div className="page-shell">
      <main className="page-container">
        {/* Header */}
        <header className="page-header">
          <div className="page-title-row">
            <div>
              <h1 className="page-title">
                Wellbeing Companion v2.1 – Multi-profile
              </h1>
              <p className="page-subtitle">
                CBT-based wellbeing chatbot for first-year students. Multi-agent
                backend + research logging.
              </p>
            </div>

            <div className="language-pill">
              <span>Ngôn ngữ</span>
              <select
                className="language-select"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
              >
                <option value="vi">VI – Tiếng Việt</option>
                <option value="en">EN – English</option>
                <option value="zh">ZH – 中文</option>
              </select>
            </div>
          </div>
        </header>

        {/* 2 cột: trái = profile + prompts, phải = chat */}
        <div className="page-grid">
          {/* Cột trái */}
          <div className="page-column">
            {/* Student profile */}
            <section className="section-card">
              <h2 className="section-title">
                Student Profile (gửi kèm metadata trong message)
              </h2>

              <div>
                <label className="field-label" htmlFor="student-type">
                  Student type
                </label>
                <select
                  id="student-type"
                  className="field-control"
                  value={studentProfile.student_type}
                  onChange={(e) =>
                    setStudentProfile((prev) => ({
                      ...prev,
                      student_type: e.target.value,
                    }))
                  }
                >
                  <option value="domestic">Sinh viên trong nước (Úc)</option>
                  <option value="international">Sinh viên quốc tế</option>
                </select>
              </div>

              <div>
                <label className="field-label" htmlFor="student-region">
                  Region
                </label>
                <select
                  id="student-region"
                  className="field-control"
                  value={studentProfile.student_region}
                  onChange={(e) =>
                    setStudentProfile((prev) => ({
                      ...prev,
                      student_region: e.target.value,
                    }))
                  }
                >
                  <option value="au">Australia</option>
                  <option value="sea">South-East Asia</option>
                  <option value="eu">Europe</option>
                  <option value="other">Other regions</option>
                </select>
              </div>

              <p className="field-help">
                Thông tin về loại sinh viên và khu vực của bạn giúp chatbot đưa
                ra câu trả lời phù hợp và mang tính hỗ trợ hơn. Dữ liệu này
                được encode vào phần đầu message để backend FastAPI cũ (chỉ nhận{" "}
                <code>user_id</code>, <code>message</code>) vẫn hoạt động bình
                thường.
              </p>
            </section>

            {/* Quick prompts */}
            <section className="section-card">
              <h2 className="section-title">Quick prompts / Gợi ý câu bắt đầu</h2>
              <p className="field-help">
                Click để điền nhanh, sau đó bạn có thể chỉnh lại rồi bấm Gửi.
              </p>

              <div className="prompt-chips">
                {currentSuggestions.map((s, idx) => (
                  <button
                    key={idx}
                    type="button"
                    className="prompt-chip"
                    onClick={() => handleSuggestionClick(s)}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </section>
          </div>

          {/* Cột phải: Chat */}
          <div className="page-column">
            <section className="section-card">
              <div className="chat-card-header">
                Hãy chia sẻ một điều khiến bạn lo lắng, buồn, stress hoặc cảm
                thấy cô đơn…
              </div>
              <div className="chat-card-subtext">
                Bạn có thể gõ bằng tiếng Việt, tiếng Anh hoặc trộn lẫn – miễn là
                bạn thấy thoải mái. Chatbot sẽ phản hồi theo multi-agent
                wellbeing backend.
              </div>

              <div className="messages-panel">
                {messages.length === 0 && (
                  <div className="message-empty">
                    Chưa có cuộc trò chuyện nào trong phiên này. Hãy thử kể một
                    điều vừa xảy ra với bạn gần đây.
                  </div>
                )}

                {messages.map((m, idx) => (
                  <div
                    key={idx}
                    className={`message-row message-row--${m.role}`}
                  >
                    <div
                      className={`message-bubble message-bubble--${m.role}`}
                    >
                      {m.content}
                    </div>
                  </div>
                ))}
              </div>

              {/* Input + send */}
              <div className="chat-input-row">
                <textarea
                  className="message-input"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Nhập điều bạn đang trải qua... (Enter để gửi, Shift+Enter xuống dòng)"
                />

                <button
                  className="primary-button"
                  type="button"
                  onClick={sendMessage}
                  disabled={loading}
                >
                  {loading ? "Đang gửi..." : "Gửi"}
                </button>
              </div>

              <p className="text-sm-muted">
                Gợi ý: nút chọn ngôn ngữ ở trên chỉ đổi giao diện và câu gợi ý.
                Chatbot vẫn có thể hiểu và trả lời bằng nhiều ngôn ngữ khác
                nhau.
              </p>
            </section>
          </div>
        </div>

        {/* Export buttons */}
        <div className="export-footer">
          <ExportButtons />
        </div>
      </main>
    </div>
  );
}
