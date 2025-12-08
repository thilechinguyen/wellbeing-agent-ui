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

// Toàn bộ text UI cho từng ngôn ngữ
const UI_TEXT = {
  vi: {
    headerTitle: "Wellbeing Companion v2.1 – Multi-profile",
    headerSubtitle:
      "Chatbot wellbeing dựa trên CBT dành cho sinh viên năm nhất. Multi-agent backend + research logging.",
    languageLabel: "Language",
    studentProfileTitle: "Student Profile (gửi kèm metadata trong message)",
    studentTypeLabel: "Student type",
    regionLabel: "Region",
    metaNote:
      "Thông tin này được encode vào phần đầu message, nên backend FastAPI cũ (chỉ nhận `user_id`, `message`) vẫn chạy bình thường nhưng agent có thể đọc metadata để phân tích theo profile.",
    quickPromptsTitle: "Quick prompts / Gợi ý câu bắt đầu",
    quickPromptsSubtitle:
      "Click để điền nhanh, sau đó có thể chỉnh lại rồi bấm Gửi.",
    emptyState:
      "Hãy chia sẻ một điều khiến bạn lo lắng, buồn, stress hoặc cảm thấy cô đơn… Chatbot sẽ phản hồi theo multi-agent wellbeing backend. Bạn có thể chọn ngôn ngữ ở góc trên bên phải.",
    inputPlaceholder: "Nhập điều bạn đang trải qua...",
    sendLabel: "Gửi",
    errorMessage:
      "Lỗi kết nối server hoặc backend không phản hồi.\nNếu lỗi lặp lại, kiểm tra lại URL backend trên Render.",
    studentTypeDomestic: "Domestic (Australia)",
    studentTypeInternational: "International",
    regionAU: "Australia",
    regionSEA: "South-East Asia",
    regionEU: "Europe",
    regionOther: "Other regions",
    langOptionVI: "VI – Tiếng Việt",
    langOptionEN: "EN – English",
    langOptionZH: "ZH – 中文",
  },

  en: {
    headerTitle: "Wellbeing Companion v2.1 – Multi-profile",
    headerSubtitle:
      "CBT-based wellbeing chatbot for first-year students. Multi-agent backend + research logging.",
    languageLabel: "Language",
    studentProfileTitle: "Student Profile (sent as metadata in message)",
    studentTypeLabel: "Student type",
    regionLabel: "Region",
    metaNote:
      "This information is encoded at the beginning of the message so the existing FastAPI backend (which only receives `user_id`, `message`) still works, but the agent can read the metadata to analyse by profile.",
    quickPromptsTitle: "Quick prompts",
    quickPromptsSubtitle:
      "Click to insert quickly, then you can edit it before hitting Send.",
    emptyState:
      "Share one thing that is making you worried, sad, stressed, or lonely. The chatbot will respond using the multi-agent wellbeing backend. You can choose your language in the top-right corner.",
    inputPlaceholder: "Type what you are going through...",
    sendLabel: "Send",
    errorMessage:
      "There was an error connecting to the server or the backend did not respond.\nIf this keeps happening, please check the backend URL on Render.",
    studentTypeDomestic: "Domestic (Australia)",
    studentTypeInternational: "International",
    regionAU: "Australia",
    regionSEA: "South-East Asia",
    regionEU: "Europe",
    regionOther: "Other regions",
    langOptionVI: "VI – Tiếng Việt",
    langOptionEN: "EN – English",
    langOptionZH: "ZH – 中文",
  },

  zh: {
    headerTitle: "Wellbeing Companion v2.1 – 多档案模式",
    headerSubtitle:
      "针对大一新生的 CBT 风格心理陪伴聊天机器人，多智能体后端 + 研究记录。",
    languageLabel: "语言",
    studentProfileTitle: "学生档案（作为元数据一并发送）",
    studentTypeLabel: "学生类型",
    regionLabel: "地区",
    metaNote:
      "这些信息会被编码到消息开头，因此旧的 FastAPI 后端（只接收 `user_id`、`message`）仍然可以正常工作，但智能体可以利用这些元数据按 profile 分析。",
    quickPromptsTitle: "Quick prompts / 快速示例句",
    quickPromptsSubtitle:
      "点击即可快速填入，你可以修改后再发送。",
    emptyState:
      "可以跟我分享一件让你担心、难过、压力大或感到孤单的事情。聊天机器人会用多智能体后端来回应你。你可以在右上角选择语言。",
    inputPlaceholder: "写下你现在正在经历的事情……",
    sendLabel: "发送",
    errorMessage:
      "连接服务器或后端时发生错误，后端没有响应。\n如果错误持续出现，请检查 Render 上的后端链接。",
    studentTypeDomestic: "Domestic (Australia)",
    studentTypeInternational: "International",
    regionAU: "Australia",
    regionSEA: "South-East Asia",
    regionEU: "Europe",
    regionOther: "Other regions",
    langOptionVI: "VI – Tiếng Việt",
    langOptionEN: "EN – English",
    langOptionZH: "ZH – 中文",
  },
};

export default function Home() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  // UI language
  const [language, setLanguage] = useState("vi");

  // Student Profile gửi kèm (encode vào message để backend cũ không bị 422)
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
        {
          role: "assistant",
          content: data.reply || "(No reply)",
        },
      ]);
    } catch (err) {
      console.error("Error calling backend:", err);

      const textSet = UI_TEXT[language] || UI_TEXT.vi;

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: textSet.errorMessage,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const currentSuggestions = SUGGESTIONS[language] || SUGGESTIONS.vi;
  const t = UI_TEXT[language] || UI_TEXT.vi;

  return (
    <main
      style={{
        minHeight: "100vh",
        backgroundColor: "#020617",
        color: "#e5e7eb",
        padding: "24px",
      }}
    >
      <div style={{ maxWidth: "960px", margin: "0 auto" }}>
        {/* Header: tiêu đề + chọn ngôn ngữ */}
        <header
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "24px",
          }}
        >
          <div>
            <h1 style={{ fontSize: "24px", fontWeight: 700 }}>
              {t.headerTitle}
            </h1>
            <p style={{ fontSize: "13px", color: "#9ca3af", marginTop: "4px" }}>
              {t.headerSubtitle}
            </p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <span
              style={{
                fontSize: "12px",
                color: "#9ca3af",
                marginBottom: "2px",
                textAlign: "right",
              }}
            >
              {t.languageLabel}
            </span>
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
              <option value="vi">{t.langOptionVI}</option>
              <option value="en">{t.langOptionEN}</option>
              <option value="zh">{t.langOptionZH}</option>
            </select>
          </div>
        </header>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.2fr 1fr",
            gap: "24px",
            marginBottom: "24px",
          }}
        >
          {/* Hộp Student Profile */}
          <section
            style={{
              padding: "16px 20px",
              borderRadius: "20px",
              background: "#020617",
              border: "1px solid #1f2937",
            }}
          >
            <h2 style={{ fontSize: "16px", fontWeight: 600, marginBottom: 8 }}>
              {t.studentProfileTitle}
            </h2>

            <label
              style={{ display: "block", fontSize: "13px", marginTop: "12px" }}
            >
              {t.studentTypeLabel}
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
                <option value="domestic">{t.studentTypeDomestic}</option>
                <option value="international">
                  {t.studentTypeInternational}
                </option>
              </select>
            </label>

            <label
              style={{ display: "block", fontSize: "13px", marginTop: "4px" }}
            >
              {t.regionLabel}
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
                <option value="au">{t.regionAU}</option>
                <option value="sea">{t.regionSEA}</option>
                <option value="eu">{t.regionEU}</option>
                <option value="other">{t.regionOther}</option>
              </select>
            </label>

            <p
              style={{
                fontSize: "12px",
                color: "#9ca3af",
                marginTop: "8px",
              }}
            >
              {t.metaNote}
            </p>
          </section>

          {/* Gợi ý câu mở đầu */}
          <section
            style={{
              padding: "16px 20px",
              borderRadius: "20px",
              background: "#020617",
              border: "1px solid #1f2937",
            }}
          >
            <h3
              style={{
                fontSize: "15px",
                fontWeight: 600,
                marginBottom: 4,
              }}
            >
              {t.quickPromptsTitle}
            </h3>
            <p
              style={{
                fontSize: "12px",
                color: "#9ca3af",
                marginBottom: "10px",
              }}
            >
              {t.quickPromptsSubtitle}
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
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
          </section>
        </div>

        {/* Khung chat */}
        <section
          style={{
            minHeight: "260px",
            borderRadius: "20px",
            border: "1px solid #1f2937",
            padding: "16px 20px",
            background: "#020617",
            display: "flex",
            flexDirection: "column",
            gap: 12,
          }}
        >
          {messages.length === 0 && (
            <p style={{ fontSize: "13px", color: "#9ca3af" }}>{t.emptyState}</p>
          )}

          {messages.map((m, idx) => (
            <div
              key={idx}
              style={{
                alignSelf: m.role === "user" ? "flex-end" : "flex-start",
                maxWidth: "70%",
                padding: "8px 12px",
                borderRadius:
                  m.role === "user" ? "16px 16px 0 16px" : "16px 16px 16px 0",
                background:
                  m.role === "user" ? "#1f2937" : "rgba(56, 189, 248, 0.08)",
                border:
                  m.role === "user"
                    ? "1px solid #374151"
                    : "1px solid rgba(56, 189, 248, 0.5)",
                fontSize: "13px",
                whiteSpace: "pre-wrap",
              }}
            >
              {m.content}
            </div>
          ))}
        </section>

        {/* Ô nhập + nút Gửi */}
        <div
          style={{
            marginTop: "16px",
            display: "flex",
            gap: 8,
            alignItems: "center",
          }}
        >
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
            }}
            placeholder={t.inputPlaceholder}
            rows={1}
            style={{
              flex: 1,
              padding: "10px 12px",
              borderRadius: "999px",
              border: "1px solid #374151",
              background: "#020617",
              color: "white",
              fontSize: "14px",
              resize: "none",
            }}
          />

          <button
            type="button"
            onClick={sendMessage}
            disabled={loading}
            style={{
              padding: "10px 18px",
              borderRadius: "999px",
              border: "1px solid #0ea5e9",
              background: loading ? "#0369a1" : "#0ea5e9",
              color: "white",
              fontSize: "14px",
              fontWeight: 600,
              cursor: loading ? "default" : "pointer",
              minWidth: "80px",
              textAlign: "center",
            }}
          >
            {loading ? "..." : t.sendLabel}
          </button>
        </div>

        {/* Nút export CSV + Wellbeing Reports (nếu sau này dùng) */}
        <div style={{ marginTop: "16px" }}>
          {/* <ExportButtons messages={messages} /> */}
          <ExportButtons />
        </div>
      </div>
    </main>
  );
}
