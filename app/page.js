// app/page.js
"use client";

import { useEffect, useRef, useState } from "react";

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

// =======================
//  Multi-language strings
// =======================
const STRINGS = {
  vi: {
    code: "vi",
    label: "Tiếng Việt",
    heroTitle: "Wellbeing Companion",
    heroSubtitle:
      "Hỗ trợ sinh viên năm nhất trong giai đoạn chuyển tiếp lên đại học, sử dụng góc nhìn CBT nhẹ nhàng, không phán xét.",
    statusActive: "Hoạt động – nhưng không phải dịch vụ khẩn cấp",
    warningTitle: "Lưu ý quan trọng",
    warningBody:
      "Đây không phải là tư vấn tâm lý chuyên nghiệp hay dịch vụ cấp cứu. Nếu em có ý định tự hại bản thân hoặc nguy cơ khẩn cấp, hãy liên hệ ngay các dịch vụ khẩn cấp tại địa phương hoặc dịch vụ tư vấn của trường.",
    tipsTitle: "Một vài gợi ý bắt đầu",
    tipsItems: [
      "Chia sẻ cảm xúc hiện tại (lo lắng, buồn, stress, mệt mỏi…)",
      "Nói về một tình huống cụ thể khiến em thấy căng thẳng",
      "Hỏi về cách lên kế hoạch nhỏ để đối mặt từng bước",
    ],
    systemIntro:
      "Xin chào, mình là một wellbeing companion dùng góc nhìn CBT nhẹ nhàng. Em có thể chia sẻ điều đang khiến em lo lắng hoặc căng thẳng gần đây nhé.",
    quickTitle:
      "Em có thể bấm nhanh một gợi ý dưới đây nếu chưa biết bắt đầu từ đâu:",
    quickOptions: [
      "Em đang lo lắng về kỳ thi sắp tới.",
      "Em cảm thấy cô đơn vì chưa có nhiều bạn.",
      "Em bị stress vì vừa học vừa làm thêm.",
      "Em lo về học phí và tài chính gia đình.",
    ],
    inputPlaceholder:
      "Em đang cảm thấy như thế nào? Viết vài câu mô tả tình huống hoặc cảm xúc của em…",
    sendLabel: "Gửi",
    sending: "Đang gửi tin nhắn...",
    errorSend:
      "Không gửi được tin nhắn. Em có thể thử lại sau một lúc nữa hoặc kiểm tra kết nối mạng.",
    footerNote:
      "Công cụ này chỉ mang tính hỗ trợ và giáo dục, không thay thế cho tư vấn chuyên nghiệp hoặc dịch vụ cấp cứu.",
    userLabelPrefix: "user_id:",
  },

  en: {
    code: "en",
    label: "English",
    heroTitle: "Wellbeing Companion",
    heroSubtitle:
      "Supporting first-year students during the transition to university, using a gentle CBT-informed perspective, without judgment.",
    statusActive: "Available – but not an emergency service",
    warningTitle: "Important notice",
    warningBody:
      "This is not professional therapy or an emergency service. If you have thoughts of self-harm or are in immediate danger, please contact local emergency services or your university counselling service straight away.",
    tipsTitle: "A few ways to start",
    tipsItems: [
      "Share how you’re feeling right now (worried, sad, stressed, exhausted…)",
      "Talk about a specific situation that feels stressful or overwhelming",
      "Ask for ideas on small steps or a simple plan to handle things",
    ],
    systemIntro:
      "Hi, I’m a wellbeing companion using a gentle CBT lens. You can tell me about something that has been making you feel worried or stressed lately.",
    quickTitle:
      "You can tap one of these if you’re not sure how to start:",
    quickOptions: [
      "I’m worried about my upcoming exams.",
      "I feel lonely and don’t have many friends yet.",
      "I feel stressed from studying and working at the same time.",
      "I’m worried about tuition fees and my family’s finances.",
    ],
    inputPlaceholder:
      "How are you feeling right now? Write a few sentences about your situation or emotions…",
    sendLabel: "Send",
    sending: "Sending your message...",
    errorSend:
      "I couldn’t send your message. Please try again in a moment or check your internet connection.",
    footerNote:
      "This tool is for support and education only. It does not replace professional counselling or emergency services.",
    userLabelPrefix: "user_id:",
  },

  zh: {
    code: "zh",
    label: "中文",
    heroTitle: "心理陪伴助手",
    heroSubtitle:
      "用温和的 CBT 视角陪伴大一新生，帮助你适应大学生活，而不是评判你。",
    statusActive: "当前可用，但并不是紧急求助服务",
    warningTitle: "重要提醒",
    warningBody:
      "这里不是专业心理治疗或紧急求助热线。如果你有自伤想法，或处于严重危险中，请立即联系当地的紧急服务或学校的心理咨询中心。",
    tipsTitle: "可以这样开始聊聊",
    tipsItems: [
      "说说你现在的感受（紧张、难过、压力大、很累…）",
      "描述一个最近让你很烦或很焦虑的具体情境",
      "询问一些可以尝试的小步骤或简单计划",
    ],
    systemIntro:
      "你好，我是一个用温和 CBT 视角设计的心理陪伴助手。你可以和我说一件最近让你担心或感到压力的事情。",
    quickTitle: "如果不知道从哪里开始，可以先点下面这些选项：",
    quickOptions: [
      "我在为即将到来的考试感到担心。",
      "我觉得有点孤单，还没有什么朋友。",
      "我一边学习一边打工，压力很大。",
      "我在为学费和家里的经济情况发愁。",
    ],
    inputPlaceholder:
      "现在的你感觉怎么样？可以写几句话描述一下你的处境或情绪…",
    sendLabel: "发送",
    sending: "正在发送消息…",
    errorSend:
      "消息没有发出去。可以稍后再试一次，或者检查一下网络连接。",
    footerNote:
      "本工具仅用于支持与教育目的，不能替代专业心理咨询或紧急服务。",
    userLabelPrefix: "user_id:",
  },
};

const LANG_ORDER = ["vi", "en", "zh"];

// =======================
//  React component
// =======================
export default function Home() {
  const [lang, setLang] = useState("vi");
  const t = STRINGS[lang];

  const [userId] = useState(() => {
    if (typeof window === "undefined") return "sv-" + Math.random().toString(36).slice(2, 8);
    const saved = window.localStorage.getItem("wb_user_id");
    if (saved) return saved;
    const id = "sv-" + Math.random().toString(36).slice(2, 8);
    window.localStorage.setItem("wb_user_id", id);
    return id;
  });

  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    { from: "assistant", text: STRINGS[lang].systemIntro },
  ]);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState("");
  const scrollRef = useRef<HTMLDivElement | null>(null);

  // Nếu đổi ngôn ngữ, cập nhật message chào đầu tiên (chỉ khi còn 1 message)
  useEffect(() => {
    setMessages((prev) => {
      if (prev.length === 1 && prev[0].from === "assistant") {
        return [{ from: "assistant", text: STRINGS[lang].systemIntro }];
      }
      return prev;
    });
  }, [lang]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isSending, error]);

  async function sendMessage(text?: string) {
    const content = (text ?? input).trim();
    if (!content || isSending) return;

    setError("");
    setIsSending(true);
    setInput("");
    setMessages((prev) => [...prev, { from: "user", text: content }]);

    try {
      const res = await fetch(`${API_BASE}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: userId,
          message: content,
        }),
      });

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        { from: "assistant", text: data.reply || "" },
      ]);
    } catch (e) {
      console.error(e);
      setError(t.errorSend);
    } finally {
      setIsSending(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-50 flex items-center justify-center px-4 py-6">
      <div className="w-full max-w-6xl rounded-3xl bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 shadow-2xl border border-slate-800 overflow-hidden flex flex-col md:flex-row">
        {/* Left panel */}
        <section className="md:w-1/3 w-full bg-slate-950/60 border-r border-slate-800 px-6 py-6 space-y-6 flex flex-col">
          {/* Language switcher */}
          <div className="flex justify-end mb-2">
            <div className="inline-flex items-center rounded-full bg-slate-800/70 p-1 text-xs">
              {LANG_ORDER.map((code) => (
                <button
                  key={code}
                  onClick={() => setLang(code)}
                  className={`px-3 py-1 rounded-full transition ${
                    lang === code
                      ? "bg-sky-500 text-white"
                      : "text-slate-200 hover:bg-slate-700/70"
                  }`}
                >
                  {STRINGS[code].label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h1 className="text-3xl font-bold text-white">
              {t.heroTitle}
            </h1>
            <p className="text-sm text-slate-200 mt-2 leading-relaxed">
              {t.heroSubtitle}
            </p>
          </div>

          <div className="flex items-center space-x-2 text-sm text-emerald-400">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>{t.statusActive}</span>
          </div>

          <div className="bg-slate-900/70 border border-amber-400/60 rounded-2xl px-4 py-3 text-sm text-amber-100 space-y-1">
            <div className="flex items-center space-x-2 font-semibold">
              <span className="text-lg">⚠️</span>
              <span>{t.warningTitle}</span>
            </div>
            <p className="text-xs leading-relaxed">{t.warningBody}</p>
          </div>

          <div className="space-y-2 text-sm">
            <h2 className="font-semibold text-slate-100">
              {t.tipsTitle}
            </h2>
            <ul className="list-disc list-inside text-slate-300 space-y-1">
              {t.tipsItems.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>

          <div className="mt-auto pt-4 text-[11px] text-slate-500 border-t border-slate-800/70">
            <p>
              {t.userLabelPrefix}{" "}
              <span className="font-mono text-slate-300">{userId}</span>
            </p>
          </div>
        </section>

        {/* Right panel – chat */}
        <section className="md:w-2/3 w-full flex flex-col bg-slate-950/40">
          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto px-6 pt-6 pb-3 space-y-4"
          >
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex ${
                  m.from === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${
                    m.from === "user"
                      ? "bg-sky-500 text-white"
                      : "bg-slate-800/80 text-slate-50 border border-slate-700/60"
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}

            {error && (
              <div className="text-xs text-rose-300 bg-rose-900/40 border border-rose-700/60 rounded-xl px-4 py-2">
                {error}
              </div>
            )}

            {isSending && (
              <div className="text-xs text-slate-300 flex items-center space-x-2">
                <span className="h-2 w-2 rounded-full bg-sky-400 animate-ping" />
                <span>{t.sending}</span>
              </div>
            )}
          </div>

          {/* Quick options */}
          <div className="px-6 pb-3 space-y-2">
            <p className="text-xs text-slate-400">{t.quickTitle}</p>
            <div className="flex flex-wrap gap-2">
              {t.quickOptions.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => sendMessage(q)}
                  className="text-xs bg-slate-800/80 hover:bg-slate-700/80 text-slate-100 border border-slate-700 rounded-full px-3 py-1 transition"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>

          {/* Input */}
          <form
            className="px-6 pb-5 flex items-center space-x-3"
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage();
            }}
          >
            <div className="flex-1">
              <textarea
                rows={2}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={t.inputPlaceholder}
                className="w-full resize-none rounded-2xl border border-slate-700 bg-slate-900/70 px-3 py-2 text-sm text-slate-50 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
              />
            </div>
            <button
              type="submit"
              disabled={isSending || !input.trim()}
              className="inline-flex items-center justify-center rounded-2xl bg-sky-500 hover:bg-sky-400 disabled:bg-sky-800 disabled:text-slate-400 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-sky-500/30 transition"
            >
              {t.sendLabel}
            </button>
          </form>

          <div className="px-6 pb-4 text-[11px] text-slate-500">
            {t.footerNote}
          </div>
        </section>
      </div>
    </main>
  );
}
