"use client";

import { useState } from "react";
import { ExportButtons } from "../components/ExportButtons";

/**
 * Quick prompts cho từng ngôn ngữ
 */
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

/**
 * Toàn bộ text giao diện cho từng ngôn ngữ
 */
const STRINGS = {
  vi: {
    langPillLabel: "Ngôn ngữ",
    title: "Wellbeing Companion v2.1 – Multi-profile",
    subtitle:
      "Chatbot wellbeing dựa trên CBT dành cho sinh viên năm nhất. Multi-agent backend + research logging.",
    profileTitle: "Student Profile (gửi kèm metadata trong message)",
    studentTypeLabel: "Student type",
    studentTypeDomestic: "Sinh viên trong nước (Úc)",
    studentTypeInternational: "Sinh viên quốc tế",
    regionLabel: "Region",
    shareHeader:
      "Hãy chia sẻ một điều khiến bạn lo lắng, buồn, stress hoặc cảm thấy cô đơn…",
    shareSubtext:
      "Bạn có thể gõ bằng tiếng Việt, tiếng Anh hoặc trộn lẫn – miễn là bạn thấy thoải mái.",
    profileHelp:
      "Thông tin này giúp chatbot hiểu hoàn cảnh của bạn để đưa ra phản hồi phù hợp và mang tính hỗ trợ hơn.",
    quickTitle: "Quick prompts / Gợi ý câu bắt đầu",
    quickHelp:
      "Click để điền nhanh, sau đó bạn có thể chỉnh lại rồi bấm Gửi.",
    emptyMessage:
      "Chưa có cuộc trò chuyện nào trong phiên này. Hãy thử kể một điều vừa xảy ra với bạn gần đây.",
    inputPlaceholder:
      "Nhập điều bạn đang trải qua... (Enter để gửi, Shift+Enter xuống dòng)",
    hintBelowInput:
      "Gợi ý: nút chọn ngôn ngữ ở trên chỉ đổi giao diện và câu gợi ý. Chatbot vẫn có thể hiểu và trả lời bằng nhiều ngôn ngữ khác nhau.",
    sendButtonIdle: "Gửi",
    sendButtonLoading: "Đang gửi...",
    backendError:
      "Lỗi kết nối server hoặc backend không phản hồi.\nNếu lỗi lặp lại, hãy kiểm tra lại URL backend trên Render.",
    regionAU: "Australia",
    regionSEA: "Đông Nam Á",
    regionEU: "Châu Âu",
    regionOther: "Khu vực khác",
  },
  en: {
    langPillLabel: "Language",
    title: "Wellbeing Companion v2.1 – Multi-profile",
    subtitle:
      "CBT-based wellbeing chatbot for first-year students. Multi-agent backend + research logging.",
    profileTitle: "Student Profile (sent as metadata in the message)",
    studentTypeLabel: "Student type",
    studentTypeDomestic: "Domestic student (Australia)",
    studentTypeInternational: "International student",
    regionLabel: "Region",
    shareHeader:
      "Share something that is making you worried, sad, stressed, or lonely…",
    shareSubtext:
      "You can type in English, Vietnamese, or mix languages – whatever feels most comfortable for you.",
    profileHelp:
      "This information helps the chatbot understand your situation and offer more supportive responses.",
    quickTitle: "Quick prompts / Suggested ways to start",
    quickHelp:
      "Click to fill the message box quickly, then edit if needed and press Send.",
    emptyMessage:
      "There is no conversation in this session yet. You can start by describing something that happened to you recently.",
    inputPlaceholder:
      "Type what you are going through... (Press Enter to send, Shift+Enter for a new line)",
    hintBelowInput:
      "Tip: the language selector above only changes the UI and quick prompts. The chatbot can still understand and reply in multiple languages.",
    sendButtonIdle: "Send",
    sendButtonLoading: "Sending...",
    backendError:
      "Unable to reach the server or the backend did not respond.\nIf this keeps happening, please check the backend URL on Render.",
    regionAU: "Australia",
    regionSEA: "South-East Asia",
    regionEU: "Europe",
    regionOther: "Other regions",
  },
  zh: {
    langPillLabel: "语言",
    title: "Wellbeing Companion v2.1 – 多档案",
    subtitle:
      "面向大一新生的 CBT 风格心理支持聊天机器人。多代理后台 + 研究日志记录。",
    profileTitle: "学生档案（随消息一起发送的元数据）",
    studentTypeLabel: "学生类型",
    studentTypeDomestic: "本地学生（澳大利亚）",
    studentTypeInternational: "国际学生",
    regionLabel: "地区",
    shareHeader: "说一件让你担心、难过、压力大或感到孤单的事情…",
    shareSubtext:
      "你可以用中文、英文、越南语或混合输入——只要你觉得舒服就好。",
    profileHelp:
      "这些信息能帮助聊天机器人更好地了解你的情况，并提供更贴心的回应。",
    quickTitle: "Quick prompts / 开始聊天的小提示",
    quickHelp: "点击即可快速填充输入框，然后可以修改后再发送。",
    emptyMessage:
      "本次会话中还没有消息，你可以从最近发生在你身上的一件事开始聊起。",
    inputPlaceholder:
      "输入你正在经历的事情……（按 Enter 发送，Shift+Enter 换行）",
    hintBelowInput:
      "提示：上面的语言选择只会改变界面语言和提示语。聊天机器人仍然可以理解并用多种语言回复。",
    sendButtonIdle: "发送",
    sendButtonLoading: "发送中...",
    backendError:
      "无法连接到服务器或后端没有响应。\n如果问题持续出现，请检查 Render 上的后端 URL。",
    regionAU: "Australia",
    regionSEA: "东南亚",
    regionEU: "Europe",
    regionOther: "其他地区",
  },
};

export default function Home() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  // Ngôn ngữ giao diện
  const [language, setLanguage] = useState("vi");

  // Student Profile
  const [studentProfile, setStudentProfile] = useState({
    student_type: "domestic",
    student_region: "au",
  });

  // ✅ Backend thật: FastAPI trên Render, route POST /chat
  const backendURL =
    process.env.NEXT_PUBLIC_BACKEND_URL ||
    "https://wellbeingagent.onrender.com/chat";

  const currentSuggestions = SUGGESTIONS[language] || SUGGESTIONS.vi;
  const t = STRINGS[language] || STRINGS.vi;

  const handleSuggestionClick = (text) => {
    setInput(text);
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput("");

    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setLoading(true);

    try {
      // Encode metadata đơn giản ở đầu message
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
          content: t.backendError,
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
              <h1 className="page-title">{t.title}</h1>
              <p className="page-subtitle">{t.subtitle}</p>
            </div>

            <div className="language-pill">
              <span>{t.langPillLabel}</span>
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

        {/* 2 cột */}
        <div className="page-grid">
          {/* Cột trái */}
          <div className="page-column">
            {/* Student profile */}
            <section className="section-card">
              <h2 className="section-title">{t.profileTitle}</h2>

              <div>
                <label className="field-label" htmlFor="student-type">
                  {t.studentTypeLabel}
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
                  <option value="domestic">{t.studentTypeDomestic}</option>
                  <option value="international">
                    {t.studentTypeInternational}
                  </option>
                </select>
              </div>

              <div>
                <label className="field-label" htmlFor="student-region">
                  {t.regionLabel}
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
                  <option value="au">{t.regionAU}</option>
                  <option value="sea">{t.regionSEA}</option>
                  <option value="eu">{t.regionEU}</option>
                  <option value="other">{t.regionOther}</option>
                </select>
              </div>

              <p className="field-help">{t.profileHelp}</p>
            </section>

            {/* Quick prompts */}
            <section className="section-card">
              <h2 className="section-title">{t.quickTitle}</h2>
              <p className="field-help">{t.quickHelp}</p>

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
              <div className="chat-card-header">{t.shareHeader}</div>
              <div className="chat-card-subtext">{t.shareSubtext}</div>

              <div className="messages-panel">
                {messages.length === 0 && (
                  <div className="message-empty">{t.emptyMessage}</div>
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
                  placeholder={t.inputPlaceholder}
                />

                <button
                  className="primary-button"
                  type="button"
                  onClick={sendMessage}
                  disabled={loading}
                >
                  {loading ? t.sendButtonLoading : t.sendButtonIdle}
                </button>
              </div>

              <p className="text-sm-muted">{t.hintBelowInput}</p>
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
