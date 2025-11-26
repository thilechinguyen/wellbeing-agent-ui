"use client";

import { useEffect, useRef, useState } from "react";

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

const LANGS = {
  vi: {
    label: "Tiếng Việt",
    heroTitle: "Wellbeing Companion",
    heroSubtitle:
      "Hỗ trợ sinh viên năm nhất trong giai đoạn chuyển tiếp lên đại học, sử dụng góc nhìn CBT nhẹ nhàng, không phán xét.",
    statusOk: "Hoạt động – nhưng không phải dịch vụ khẩn cấp",
    crisisTitle: "Lưu ý quan trọng",
    crisisBody:
      "Đây không phải là tư vấn tâm lý chuyên nghiệp hay dịch vụ cấp cứu. Nếu em có ý định tự hại bản thân hoặc nguy cơ khẩn cấp, hãy liên hệ ngay các dịch vụ khẩn cấp tại địa phương hoặc dịch vụ tư vấn của trường.",
    tipsTitle: "Một vài gợi ý bắt đầu",
    tips: [
      "Chia sẻ cảm xúc hiện tại (lo lắng, buồn, stress, mệt mỏi…)",
      "Nói về một tình huống cụ thể khiến em thấy căng thẳng",
      "Hỏi về cách lên kế hoạch nhỏ để đối mặt từng bước",
    ],
    starterMessage:
      "Xin chào, mình là một wellbeing companion dùng góc nhìn CBT nhẹ nhàng. Em có thể chia sẻ điều đang khiến em lo lắng hoặc căng thẳng gần đây nhé.",
    quickPromptsTitle:
      "Em có thể bấm nhanh một gợi ý dưới đây nếu chưa biết bắt đầu từ đâu:",
    quickPrompts: [
      "Em đang lo lắng về kỳ thi sắp tới.",
      "Em cảm thấy cô đơn vì chưa có nhiều bạn.",
      "Em bị stress vì vừa học vừa làm thêm.",
      "Em lo về học phí và tài chính gia đình.",
    ],
    inputPlaceholder:
      "Em đang cảm thấy như thế nào? Viết vài câu mô tả tình huống hoặc cảm xúc của em…",
    sendLabel: "Gửi",
    sending: "Đang gửi…",
    sendError:
      "Không gửi được tin nhắn. Em có thể thử lại sau một lúc nữa hoặc kiểm tra kết nối mạng.",
    footer:
      "Công cụ này chỉ mang tính hỗ trợ và giáo dục, không thay thế cho tư vấn chuyên nghiệp hoặc dịch vụ cấp cứu.",
  },
  en: {
    label: "English",
    heroTitle: "Wellbeing Companion",
    heroSubtitle:
      "Supporting first-year university students during transition using a gentle CBT-informed perspective.",
    statusOk: "Available – but not an emergency or crisis service",
    crisisTitle: "Important note",
    crisisBody:
      "This is not professional counselling or an emergency service. If you are at risk of harming yourself or others, please contact local emergency services or your university support services immediately.",
    tipsTitle: "A few ways to start",
    tips: [
      "Share how you’re feeling right now (worried, sad, stressed, tired…)",
      "Describe a specific situation that has been stressing you",
      "Ask for ideas on how to take one small step at a time",
    ],
    starterMessage:
      "Hi, I’m a wellbeing companion using a gentle CBT-informed lens. You can share what has been making you feel worried or stressed lately.",
    quickPromptsTitle:
      "You can tap one of these if you’re not sure how to start:",
    quickPrompts: [
      "I’m worried about my upcoming exams.",
      "I feel lonely because I don’t have many friends yet.",
      "I’m stressed because I’m studying and working at the same time.",
      "I’m worried about tuition fees and my family’s finances.",
    ],
    inputPlaceholder:
      "How are you feeling? Write a few sentences about your situation or emotions…",
    sendLabel: "Send",
    sending: "Sending…",
    sendError:
      "Could not send your message. Please try again in a moment or check your internet connection.",
    footer:
      "This tool is for support and education only. It is not a substitute for professional counselling or emergency services.",
  },
  zh: {
    label: "中文",
    heroTitle: "心灵陪伴助手",
    heroSubtitle:
      "以温和的认知行为视角，陪伴大一新生度过适应大学生活的阶段。",
    statusOk: "可以使用 – 但不是紧急求助或危机干预服务",
    crisisTitle: "重要提醒",
    crisisBody:
      "这里不是专业心理咨询或紧急救援服务。如果你有自伤、他伤风险或处在严重危机中，请立即联系当地急救电话或学校的官方支持服务。",
    tipsTitle: "可以这样开始",
    tips: [
      "简单说一下你现在的感受（焦虑、难过、压力大、很疲惫…）",
      "描述一个最近让你特别紧张或困扰的情境",
      "询问如何一步一步地规划小行动来面对问题",
    ],
    starterMessage:
      "你好，我是一个以温和 CBT 视角设计的心灵陪伴助手。你可以和我分享最近让你感到担心或压力的事情。",
    quickPromptsTitle: "如果不知道怎么开口，可以先点下面的句子：",
    quickPrompts: [
      "我在为即将到来的考试感到焦虑。",
      "我觉得有点孤单，因为还没有很多朋友。",
      "一边上学一边打工让我觉得压力很大。",
      "我在为学费和家里的经济情况感到担心。",
    ],
    inputPlaceholder:
      "你现在的感受如何？写几句话描述一下你的情境或情绪…",
    sendLabel: "发送",
    sending: "正在发送…",
    sendError:
      "消息发送失败。可以稍后再试一次，或者检查一下网络连接。",
    footer:
      "本工具仅用于支持与教育用途，不能替代专业心理咨询或任何紧急救援服务。",
  },
};

function generateUserId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return "user-" + Math.random().toString(36).slice(2);
}

export default function HomePage() {
  const [lang, setLang] = useState("vi");
  const t = LANGS[lang];

  const [messages, setMessages] = useState([
    { role: "assistant", content: LANGS[lang].starterMessage },
  ]);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState(null);

  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isSending, error]);

  useEffect(() => {
    let stored = null;
    if (typeof window !== "undefined") {
      stored = window.localStorage.getItem("wb_user_id");
    }
    if (!stored) {
      stored = generateUserId();
      if (typeof window !== "undefined") {
        window.localStorage.setItem("wb_user_id", stored);
      }
    }
    setUserId(stored);
  }, []);

  // khi đổi ngôn ngữ thì thay message chào đầu
  useEffect(() => {
    setMessages((prev) => {
      if (!prev.length) {
        return [{ role: "assistant", content: LANGS[lang].starterMessage }];
      }
      const first = { ...prev[0], content: LANGS[lang].starterMessage };
      return [first, ...prev.slice(1)];
    });
  }, [lang]);

  async function sendMessage(text) {
    const content = (text ?? input).trim();
    if (!content || isSending) return;

    setIsSending(true);
    setError(null);

    const nextMessages = [
      ...messages,
      { role: "user", content },
    ];

    setMessages(nextMessages);
    setInput("");

    try {
      const res = await fetch(`${API_BASE}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: userId || "anonymous",
          message: content,
        }),
      });

      if (!res.ok) {
        throw new Error("Bad response from backend");
      }

      const data = await res.json();
      const reply = data.reply || "";

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: reply },
      ]);
    } catch (err) {
      console.error(err);
      setError(t.sendError);
      // rollback tin nhắn user nếu muốn thì bỏ đoạn này,
      // ở đây mình giữ lại để user vẫn thấy message của mình
    } finally {
      setIsSending(false);
    }
  }

  function handleQuickPromptClick(prompt) {
    setInput(prompt);
    sendMessage(prompt);
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-slate-50">
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col gap-6 px-4 py-6 md:flex-row md:py-10">
        {/* Sidebar */}
        <aside className="w-full md:w-80 space-y-6 rounded-3xl bg-slate-950/60 p-6 shadow-xl ring-1 ring-slate-800/80">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold tracking-tight">
              {t.heroTitle}
            </h1>
            <select
              value={lang}
              onChange={(e) => setLang(e.target.value)}
              className="rounded-xl bg-slate-900 px-3 py-1 text-xs text-slate-200 shadow-inner ring-1 ring-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            >
              <option value="vi">VI</option>
              <option value="en">EN</option>
              <option value="zh">中文</option>
            </select>
          </div>

          <p className="text-sm text-slate-300 leading-relaxed">
            {t.heroSubtitle}
          </p>

          <div className="flex items-center gap-2 text-sm">
            <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.9)]" />
            <span className="text-emerald-200">{t.statusOk}</span>
          </div>

          <div className="space-y-2 rounded-2xl bg-slate-900/70 p-4 ring-1 ring-amber-500/60">
            <div className="flex items-center gap-2 text-sm font-semibold text-amber-300">
              <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-amber-500/20 text-xs">
                ⚠️
              </span>
              {t.crisisTitle}
            </div>
            <p className="text-xs leading-relaxed text-amber-100/90">
              {t.crisisBody}
            </p>
          </div>

          <div className="space-y-2 rounded-2xl bg-slate-900/60 p-4 ring-1 ring-slate-800">
            <h2 className="text-sm font-semibold text-slate-100">
              {t.tipsTitle}
            </h2>
            <ul className="space-y-1.5 text-xs text-slate-300">
              {t.tips.map((tip) => (
                <li key={tip} className="flex gap-2">
                  <span className="mt-1 h-1 w-1 rounded-full bg-indigo-400" />
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>

          <p className="mt-4 text-[10px] text-slate-500">
            user_id: {userId || "…"}
          </p>
        </aside>

        {/* Chat panel */}
        <section className="flex-1 rounded-3xl bg-slate-950/70 p-4 shadow-2xl ring-1 ring-slate-800/80 md:p-6 flex flex-col">
          {/* Messages */}
          <div className="flex-1 space-y-4 overflow-y-auto pr-1">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex ${
                  m.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm leading-relaxed shadow
                  ${
                    m.role === "user"
                      ? "bg-indigo-500 text-white rounded-br-sm"
                      : "bg-slate-900 text-slate-100 rounded-bl-sm"
                  }`}
                >
                  {m.content}
                </div>
              </div>
            ))}
            {isSending && (
              <div className="flex justify-start">
                <div className="rounded-2xl rounded-bl-sm bg-slate-900 px-4 py-2 text-xs text-slate-300">
                  …
                </div>
              </div>
            )}
            {error && (
              <div className="flex justify-center">
                <div className="w-full rounded-2xl bg-rose-950/60 px-4 py-2 text-xs text-rose-100 ring-1 ring-rose-700/70">
                  {t.sendError}
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Quick prompts */}
          <div className="mt-3 space-y-2">
            <p className="text-xs text-slate-400">{t.quickPromptsTitle}</p>
            <div className="flex flex-wrap gap-2">
              {t.quickPrompts.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => handleQuickPromptClick(p)}
                  className="rounded-full border border-slate-700/80 bg-slate-900/70 px-3 py-1 text-xs text-slate-100 hover:border-indigo-400 hover:bg-slate-900 transition"
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* Input */}
          <form
            className="mt-4 flex items-end gap-3 rounded-2xl bg-slate-900/80 p-3 ring-1 ring-slate-700/80"
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage();
            }}
          >
            <textarea
              rows={2}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t.inputPlaceholder}
              className="flex-1 resize-none rounded-xl border border-slate-700/70 bg-slate-950 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-400/80"
            />
            <button
              type="submit"
              disabled={isSending || !input.trim()}
              className="inline-flex h-10 min-w-[72px] items-center justify-center rounded-xl bg-indigo-500 px-4 text-sm font-medium text-white shadow-md hover:bg-indigo-400 disabled:cursor-not-allowed disabled:bg-slate-700"
            >
              {isSending ? t.sending : t.sendLabel}
            </button>
          </form>

          <p className="mt-3 text-[10px] text-center text-slate-500">
            {t.footer}
          </p>
        </section>
      </div>
    </main>
  );
}
