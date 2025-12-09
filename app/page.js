// app/page.js
"use client";

import { useEffect, useMemo, useState } from "react";

// ---------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------
const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE || "https://wellbeing-agent.onrender.com";

const LANGS = {
  en: { code: "en", label: "EN – English" },
  vi: { code: "vi", label: "VI – Tiếng Việt" },
  zh: { code: "zh", label: "ZH – 中文" },
};

const STUDENT_TYPES = [
  { value: "domestic", labelEn: "Domestic (Australia)", labelVi: "Sinh viên trong nước (Úc)" },
  { value: "international", labelEn: "International", labelVi: "Sinh viên quốc tế" },
];

const REGIONS = [
  { value: "au", labelEn: "Australia", labelVi: "Australia" },
  { value: "sea", labelEn: "Southeast Asia", labelVi: "Đông Nam Á" },
  { value: "ea", labelEn: "East Asia", labelVi: "Đông Á" },
  { value: "eu", labelEn: "Europe", labelVi: "Châu Âu" },
  { value: "other", labelEn: "Other / Mixed", labelVi: "Khu vực khác / Hỗn hợp" },
];

// ---------------------------------------------------------------------
// UI TEXT (multi-language)
// ---------------------------------------------------------------------
const UI_TEXT = {
  title: {
    en: "Wellbeing Companion v2.1 – Multi-profile",
    vi: "Wellbeing Companion v2.1 – Multi-profile",
    zh: "Wellbeing Companion v2.1 – 多配置",
  },
  subtitle: {
    en: "CBT-inspired wellbeing chatbot for first-year university students. Multi-agent backend + research logging.",
    vi: "Chatbot wellbeing dựa trên CBT dành cho sinh viên năm nhất. Multi-agent backend + research logging.",
    zh: "面向大一新生的心理支持聊天助手，基于 CBT，多智能体后端并记录研究数据。",
  },
  languageLabel: {
    en: "Language",
    vi: "Ngôn ngữ",
    zh: "语言",
  },
  profileSection: {
    title: {
      en: "Student Profile (sent as metadata in message)",
      vi: "Student Profile (gửi kèm metadata trong message)",
      zh: "学生档案（作为元数据发送）",
    },
    description: {
      en: "Your student type and region help the chatbot respond in a way that fits your background and experiences.",
      vi: "Thông tin về loại sinh viên và khu vực của bạn giúp chatbot đưa ra câu trả lời phù hợp và mang tính hỗ trợ hơn.",
      zh: "你的学生类型和地区信息将帮助聊天助手根据你的背景提供更贴心的回应。",
    },
    studentType: {
      en: "Student type",
      vi: "Student type",
      zh: "学生类型",
    },
    region: {
      en: "Region",
      vi: "Region",
      zh: "地区",
    },
  },
  quickPrompts: {
    title: {
      en: "Quick prompts / Gợi ý câu bắt đầu",
      vi: "Quick prompts / Gợi ý câu bắt đầu",
      zh: "快捷开场句",
    },
    subtitle: {
      en: "Click to fill quickly, then you can edit before sending.",
      vi: "Click để điền nhanh, sau đó có thể chỉnh lại rồi bấm Gửi.",
      zh: "点击即可快速填入，你可以修改后再发送。",
    },
    prompts: {
      en: [
        "I feel lonely because I haven’t made many friends yet.",
        "I’m worried about the upcoming exams.",
        "I feel stressed from studying and working at the same time.",
      ],
      vi: [
        "Em cảm thấy cô đơn vì chưa có nhiều bạn.",
        "Em đang lo lắng về kỳ thi sắp tới.",
        "Em bị stress vì vừa học vừa làm thêm.",
      ],
      zh: [
        "因为还没交到什么朋友，我觉得很孤单。",
        "我在为即将到来的考试担心。",
        "一边打工一边学习让我压力很大。",
      ],
    },
  },
  chat: {
    placeholder: {
      en: "Share something that is making you worried, sad, stressed, or lonely… You can type in ANY language you feel comfortable with.",
      vi: "Hãy chia sẻ một điều khiến bạn lo lắng, buồn, stress hoặc cảm thấy cô đơn… Bạn có thể gõ BẤT KỲ ngôn ngữ nào mà bạn thấy thoải mái.",
      zh: "说说最近让你感到担心、难过、压力大或孤单的事情吧……你可以用任何你觉得舒服的语言输入。",
    },
    inputHint: {
      en: "Tip: the language switch above just adjusts the interface and quick prompts. The chatbot itself can understand and reply in many languages.",
      vi: "Gợi ý: nút chọn ngôn ngữ ở trên chỉ đổi giao diện và câu gợi ý. Chatbot vẫn có thể hiểu và trả lời bằng nhiều ngôn ngữ khác nhau.",
      zh: "提示：上方语言选择只会改变界面与示例句，聊天助手本身可以理解并用多种语言回复。",
    },
    send: {
      en: "Send",
      vi: "Gửi",
      zh: "发送",
    },
    loading: {
      en: "Thinking…",
      vi: "Đang suy nghĩ…",
      zh: "思考中…",
    },
    error: {
      en: "Something went wrong. Please try again.",
      vi: "Có lỗi xảy ra. Vui lòng thử lại.",
      zh: "出错了，请稍后再试。",
    },
  },
  bubbles: {
    you: {
      en: "You",
      vi: "Bạn",
      zh: "你",
    },
    agent: {
      en: "Companion",
      vi: "Companion",
      zh: "Companion",
    },
  },
};

// ---------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------
function t(pathObj, lang) {
  return pathObj[lang] || pathObj.en;
}

function getLabel(obj, lang) {
  if (lang === "vi") return obj.labelVi;
  return obj.labelEn;
}

function createSessionId() {
  const ts = new Date().toISOString().replace(/[-:.TZ]/g, "");
  const rand = Math.random().toString(36).slice(2, 8);
  return `s_${ts}_${rand}`;
}

// ---------------------------------------------------------------------
// Main page
// ---------------------------------------------------------------------
export default function HomePage() {
  const [lang, setLang] = useState("vi");
  const [studentType, setStudentType] = useState("domestic");
  const [region, setRegion] = useState("au");
  const [sessionId, setSessionId] = useState("");
  const [turnIndex, setTurnIndex] = useState(0);

  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]); // {role: 'user' | 'assistant', content}
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // initialise session_id once
  useEffect(() => {
    const stored = window.localStorage.getItem("wellbeing_session_id");
    if (stored) {
      setSessionId(stored);
    } else {
      const sid = createSessionId();
      window.localStorage.setItem("wellbeing_session_id", sid);
      setSessionId(sid);
    }
  }, []);

  const ui = useMemo(() => {
    return {
      title: t(UI_TEXT.title, lang),
      subtitle: t(UI_TEXT.subtitle, lang),
      languageLabel: t(UI_TEXT.languageLabel, lang),
      profileTitle: t(UI_TEXT.profileSection.title, lang),
      profileDesc: t(UI_TEXT.profileSection.description, lang),
      profileStudentType: t(UI_TEXT.profileSection.studentType, lang),
      profileRegion: t(UI_TEXT.profileSection.region, lang),
      quickTitle: t(UI_TEXT.quickPrompts.title, lang),
      quickSubtitle: t(UI_TEXT.quickPrompts.subtitle, lang),
      quickPrompts: UI_TEXT.quickPrompts.prompts[lang] || UI_TEXT.quickPrompts.prompts.en,
      placeholder: t(UI_TEXT.chat.placeholder, lang),
      inputHint: t(UI_TEXT.chat.inputHint, lang),
      sendLabel: t(UI_TEXT.chat.send, lang),
      loadingLabel: t(UI_TEXT.chat.loading, lang),
      errorLabel: t(UI_TEXT.chat.error, lang),
      labelYou: t(UI_TEXT.bubbles.you, lang),
      labelAgent: t(UI_TEXT.bubbles.agent, lang),
    };
  }, [lang]);

  async function handleSend() {
    setError("");
    const trimmed = input.trim();
    if (!trimmed || loading) return;

    // Append user message locally
    const newUserMessage = { role: "user", content: trimmed };
    const newMessages = [...messages, newUserMessage];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    // Build metadata prefix
    const metaPrefix = `[lang=${lang};profile_type=${studentType};profile_region=${region}] `;
    const payloadMessage = metaPrefix + trimmed;

    // Build history for backend (short context)
    const historyForBackend = newMessages.slice(-8).map((m) => ({
      role: m.role === "assistant" ? "assistant" : "user",
      content: m.content,
    }));

    try {
      const res = await fetch(`${API_BASE}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          student_id: sessionId,
          message: payloadMessage,
          history: historyForBackend,
        }),
      });

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      const data = await res.json();
      const replyText = data.reply ?? "";

      const agentMessage = { role: "assistant", content: replyText };
      setMessages((prev) => [...prev, agentMessage]);

      setTurnIndex((prev) => prev + 1);
    } catch (err) {
      console.error("Chat error", err);
      setError(ui.errorLabel);
    } finally {
      setLoading(false);
    }
  }

  function handleQuickPromptClick(promptText) {
    setInput(promptText);
  }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-50 flex flex-col items-center py-10 px-4">
      <div className="w-full max-w-6xl">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-semibold mb-2">
              {ui.title}
            </h1>
            <p className="text-slate-300 text-sm md:text-base">{ui.subtitle}</p>
          </div>

          <div className="flex flex-col items-end gap-1">
            <span className="text-sm text-slate-400">{ui.languageLabel}</span>
            <select
              value={lang}
              onChange={(e) => setLang(e.target.value)}
              className="bg-slate-800 text-slate-50 rounded-md px-3 py-1 border border-slate-600 text-sm"
            >
              {Object.values(LANGS).map((l) => (
                <option key={l.code} value={l.code}>
                  {l.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Top panels */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Profile panel */}
          <section className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 shadow-lg">
            <h2 className="text-xl font-semibold mb-4">
              {ui.profileTitle}
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  {ui.profileStudentType}
                </label>
                <select
                  value={studentType}
                  onChange={(e) => setStudentType(e.target.value)}
                  className="w-full bg-slate-800 text-slate-50 rounded-md px-3 py-2 border border-slate-700"
                >
                  {STUDENT_TYPES.map((st) => (
                    <option key={st.value} value={st.value}>
                      {getLabel(st, lang)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  {ui.profileRegion}
                </label>
                <select
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                  className="w-full bg-slate-800 text-slate-50 rounded-md px-3 py-2 border border-slate-700"
                >
                  {REGIONS.map((r) => (
                    <option key={r.value} value={r.value}>
                      {getLabel(r, lang)}
                    </option>
                  ))}
                </select>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed">
                {ui.profileDesc}
              </p>
            </div>
          </section>

          {/* Quick prompts panel */}
          <section className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 shadow-lg">
            <h2 className="text-xl font-semibold mb-2">{ui.quickTitle}</h2>
            <p className="text-sm text-slate-400 mb-4">{ui.quickSubtitle}</p>

            <div className="flex flex-col gap-3">
              {ui.quickPrompts.map((pText, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleQuickPromptClick(pText)}
                  className="w-full text-left px-4 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-sm transition-colors"
                >
                  {pText}
                </button>
              ))}
            </div>
          </section>
        </div>

        {/* Chat area */}
        <section className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6 shadow-xl mb-4">
          <div className="mb-4 space-y-3 max-h-[420px] overflow-y-auto pr-2 custom-scrollbar">
            {messages.length === 0 && (
              <p className="text-sm text-slate-400">
                {ui.placeholder}
              </p>
            )}

            {messages.map((m, idx) => {
              const isUser = m.role === "user";
              return (
                <div
                  key={idx}
                  className={`flex ${
                    isUser ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm leading-relaxed ${
                      isUser
                        ? "bg-blue-600 text-white rounded-br-none"
                        : "bg-slate-800 text-slate-50 rounded-bl-none"
                    }`}
                  >
                    <div className="text-[10px] uppercase tracking-wide mb-1 opacity-70">
                      {isUser ? ui.labelYou : ui.labelAgent}
                    </div>
                    <div>{m.content}</div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mb-2">
            <textarea
              rows={3}
              className="w-full bg-slate-950/60 border border-slate-700 rounded-2xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              placeholder={ui.placeholder}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
            />
            <p className="mt-1 text-[11px] text-slate-400">
              {ui.inputHint}
            </p>
          </div>

          <div className="flex items-center justify-between mt-2">
            <div className="text-xs text-slate-500">
              {sessionId && (
                <span>Session: <code className="opacity-70">{sessionId}</code></span>
              )}
            </div>
            <div className="flex items-center gap-3">
              {loading && (
                <span className="text-xs text-slate-400">
                  {ui.loadingLabel}
                </span>
              )}
              <button
                type="button"
                onClick={handleSend}
                disabled={loading || !input.trim()}
                className="px-4 py-2 rounded-full bg-blue-600 text-sm font-medium disabled:bg-slate-700 disabled:text-slate-400 hover:bg-blue-500 transition-colors"
              >
                {ui.sendLabel}
              </button>
            </div>
          </div>

          {error && (
            <p className="mt-2 text-xs text-red-400">
              {error}
            </p>
          )}
        </section>
      </div>
    </main>
  );
}
