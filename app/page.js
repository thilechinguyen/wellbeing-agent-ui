"use client";

import { useMemo, useState } from "react";
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

const STRINGS = {
  vi: {
    langPillLabel: "Ngôn ngữ",
    title: "Wellbeing Companion v2.2 – Multi-profile",
    subtitle:
      "Chatbot wellbeing dựa trên CBT dành cho sinh viên năm nhất. Multi-agent backend + research logging.",
    profileTitle: "Student Profile (gửi kèm metadata trong request)",
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
    quickHelp: "Click để điền nhanh, sau đó bạn có thể chỉnh lại rồi bấm Gửi.",
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
    title: "Wellbeing Companion v2.2 – Multi-profile",
    subtitle:
      "CBT-based wellbeing chatbot for first-year students. Multi-agent backend + research logging.",
    profileTitle: "Student Profile (sent as metadata in the request)",
    studentTypeLabel: "Student type",
    studentTypeDomestic: "Domestic student (Australia)",
    studentTypeInternational: "International student",
    regionLabel: "Region",
    shareHeader:
      "Share something that is making you worried, sad, stressed, or lonely…",
    shareSubtext:
      "You can type in English, Vietnamese, or mix languages – whatever feels most comfortable for you.",
    profileHelp:
      "This helps the chatbot understand your context and give more supportive responses.",
    quickTitle: "Quick prompts / Suggested ways to start",
    quickHelp: "Click to fill quickly, then edit and press Send.",
    emptyMessage:
      "No messages in this session yet. You can start by describing something that happened recently.",
    inputPlaceholder:
      "Type what you are going through... (Enter to send, Shift+Enter new line)",
    hintBelowInput:
      "Tip: language selector changes UI only. The chatbot can still understand multiple languages.",
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
    title: "Wellbeing Companion v2.2 – 多档案",
    subtitle:
      "面向大一新生的 CBT 风格心理支持聊天机器人。多代理后台 + 研究日志记录。",
    profileTitle: "学生档案（随请求发送的元数据）",
    studentTypeLabel: "学生类型",
    studentTypeDomestic: "本地学生（澳大利亚）",
    studentTypeInternational: "国际学生",
    regionLabel: "地区",
    shareHeader: "说一件让你担心、难过、压力大或感到孤单的事情…",
    shareSubtext:
      "你可以用中文、英文、越南语或混合输入——只要你觉得舒服就好。",
    profileHelp: "这些信息能帮助聊天机器人更好理解你的情况并更贴心回应。",
    quickTitle: "Quick prompts / 开始聊天的小提示",
    quickHelp: "点击即可快速填充输入框，然后可修改后发送。",
    emptyMessage: "本次会话还没有消息，你可以从最近的一件事开始聊起。",
    inputPlaceholder: "输入你正在经历的事情……（Enter 发送，Shift+Enter 换行）",
    hintBelowInput:
      "提示：语言选择只影响界面。聊天机器人仍可理解并用多种语言回复。",
    sendButtonIdle: "发送",
    sendButtonLoading: "发送中...",
    backendError:
      "无法连接服务器或后端无响应。\n若持续发生，请检查 Render 上的后端 URL。",
    regionAU: "Australia",
    regionSEA: "东南亚",
    regionEU: "Europe",
    regionOther: "其他地区",
  },
};

/**
 * Env should be BASE (no /chat), e.g. https://wellbeingagent.onrender.com
 */
function buildBackendUrl() {
  const envBase = process.env.NEXT_PUBLIC_BACKEND_URL;
  const fallbackBase = "https://wellbeingagent.onrender.com";

  let base = envBase && envBase.trim() ? envBase.trim() : fallbackBase;

  // strip accidental /chat
  base = base.replace(/\/chat\/?$/i, "");
  base = base.replace(/\/$/, "");

  return `${base}/chat`;
}

/**
 * fetch with timeout (Safari safe)
 */
async function fetchWithTimeout(url, options = {}, timeoutMs = 25000) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } finally {
    clearTimeout(id);
  }
}

/**
 * fetch with timeout + retry (retry on network/timeout only)
 */
async function fetchWithTimeoutAndRetry(
  url,
  options = {},
  { timeoutMs = 25000, retries = 1, retryDelayMs = 1200 } = {}
) {
  let lastErr;

  for (let attempt = 0; attempt <= retries; attempt += 1) {
    try {
      return await fetchWithTimeout(url, options, timeoutMs);
    } catch (err) {
      lastErr = err;

      const isAbort =
        (err && err.name === "AbortError") ||
        String(err?.message || "").toLowerCase().includes("abort");

      // eslint-disable-next-line no-console
      console.warn(
        `fetch attempt ${attempt + 1}/${retries + 1} failed`,
        isAbort ? "(timeout)" : "",
        err
      );

      if (attempt < retries) {
        await new Promise((r) => setTimeout(r, retryDelayMs));
      }
    }
  }

  throw lastErr;
}

export default function Home() {
  const [messages, setMessages] = useState([]); // [{role, content}]
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const [language, setLanguage] = useState("vi");
  const [studentProfile, setStudentProfile] = useState({
    student_type: "domestic",
    student_region: "au",
  });

  const backendURL = useMemo(() => buildBackendUrl(), []);
  const currentSuggestions = SUGGESTIONS[language] || SUGGESTIONS.vi;
  const t = STRINGS[language] || STRINGS.vi;

  // eslint-disable-next-line no-console
  console.log("Backend URL (final):", backendURL);

  const handleSuggestionClick = (text) => setInput(text);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput("");

    // Build nextMessages synchronously (avoid stale state)
    const nextMessages = [...messages, { role: "user", content: userMessage }];

    // Optimistic UI update
    setMessages(nextMessages);
    setLoading(true);

    try {
      // ✅ Payload MUST match FastAPI ChatRequest schema (no extra fields)
      const payload = {
        student_id: "demo-user",
        message: userMessage,
        history: nextMessages, // send full conversation so far
        profile_type: studentProfile.student_type,
        profile_region: studentProfile.student_region,
      };

      const res = await fetchWithTimeoutAndRetry(
        backendURL,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
        {
          timeoutMs: 30000, // LLM latency
          retries: 1,
          retryDelayMs: 1500,
        }
      );

      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(`HTTP ${res.status} ${text}`.trim());
      }

      const data = await res.json().catch(() => ({}));

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.reply || "(No reply)" },
      ]);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error("Error calling backend:", err);

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            t.backendError +
            `\n\n[Debug]\n${String(err?.name || "")} ${String(
              err?.message || err
            )}`.trim(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="page-shell">
      <main className="page-container">
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

        <div className="page-grid">
          <div className="page-column">
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
                    <div className={`message-bubble message-bubble--${m.role}`}>
                      {m.content}
                    </div>
                  </div>
                ))}
              </div>

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

        <div className="export-footer">
          <ExportButtons />
        </div>
      </main>
    </div>
  );
}
