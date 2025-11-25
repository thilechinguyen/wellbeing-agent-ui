"use client";

import { useEffect, useState } from "react";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://127.0.0.1:8000";

function getOrCreateUserId() {
  if (typeof window === "undefined") return "anonymous";

  const saved = window.localStorage.getItem("wb_user_id");
  if (saved) return saved;

  const id = "sv-" + Math.random().toString(36).slice(2, 10);
  window.localStorage.setItem("wb_user_id", id);
  return id;
}

const QUICK_SUGGESTIONS = [
  "Em đang lo lắng về kỳ thi sắp tới.",
  "Em cảm thấy cô đơn vì chưa có nhiều bạn.",
  "Em bị stress vì vừa học vừa làm thêm.",
  "Em lo về học phí và tài chính gia đình.",
];

export default function HomePage() {
  const [userId, setUserId] = useState("anonymous");
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text:
        "Xin chào, mình là một wellbeing companion dùng góc nhìn CBT nhẹ nhàng. " +
        "Em có thể chia sẻ điều đang khiến em lo lắng hoặc căng thẳng gần đây nhé.",
    },
  ]);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const id = getOrCreateUserId();
    setUserId(id);
  }, []);

  async function sendMessage(text) {
    const trimmed = text.trim();
    if (!trimmed) return;

    setError("");

    const userMessage = { role: "user", text: trimmed };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsSending(true);

    try {
      const res = await fetch(`${API_BASE}/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: userId,
          message: trimmed,
        }),
      });

      if (!res.ok) {
        throw new Error(`Server error: ${res.status}`);
      }

      const data = await res.json();
      const reply =
        data.reply ??
        "Xin lỗi, hiện tại mình không nhận được phản hồi rõ ràng từ server.";

      const assistantMessage = { role: "assistant", text: reply };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      console.error(err);
      setError(
        "Không gửi được tin nhắn. Em có thể thử lại sau một lúc nữa hoặc kiểm tra kết nối mạng."
      );
    } finally {
      setIsSending(false);
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    sendMessage(input);
  }

  function handleQuickSuggestion(text) {
    if (isSending) return;
    sendMessage(text);
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-900 via-slate-900 to-slate-950 flex items-center justify-center px-4 py-6">
      <div className="w-full max-w-4xl bg-slate-950/70 border border-slate-800 rounded-3xl shadow-2xl shadow-indigo-900/40 backdrop-blur-xl text-slate-50 flex flex-col md:flex-row overflow-hidden">
        {/* Sidebar */}
        <aside className="hidden md:flex md:w-1/3 flex-col justify-between bg-gradient-to-b from-indigo-700/40 via-slate-900/40 to-slate-950/80 border-r border-slate-800 p-6">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight mb-2">
              Wellbeing Companion
            </h1>
            <p className="text-sm text-slate-200/80 mb-4">
              Hỗ trợ sinh viên năm nhất trong giai đoạn chuyển tiếp lên đại học,
              sử dụng góc nhìn CBT nhẹ nhàng, không phán xét.
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-200/80 mb-3">
              <span className="inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Hoạt động – nhưng không phải dịch vụ khẩn cấp</span>
            </div>
            <div className="rounded-2xl bg-slate-900/60 border border-slate-700/70 px-4 py-3 text-xs text-slate-200/80">
              <p className="font-semibold text-slate-50 mb-1">
                ⚠️ Lưu ý quan trọng
              </p>
              <p>
                Đây không phải là tư vấn tâm lý chuyên nghiệp hay dịch vụ cấp
                cứu. Nếu em có ý định tự hại bản thân hoặc nguy cơ khẩn cấp, hãy
                liên hệ ngay các dịch vụ khẩn cấp tại địa phương hoặc dịch vụ tư
                vấn của trường.
              </p>
            </div>
          </div>

          <div className="mt-6 space-y-2 text-xs text-slate-300/80">
            <p className="font-semibold text-slate-100 text-sm">
              Một vài gợi ý bắt đầu
            </p>
            <ul className="space-y-1 list-disc list-inside">
              <li>Chia sẻ cảm xúc hiện tại (lo lắng, buồn, stress, mệt mỏi…)</li>
              <li>Nói về một tình huống cụ thể khiến em thấy căng thẳng</li>
              <li>Hỏi về cách lên kế hoạch nhỏ để đối mặt từng bước</li>
            </ul>
            <p className="text-[10px] text-slate-400 mt-1">
              user_id: <span className="font-mono">{userId}</span>
            </p>
          </div>
        </aside>

        {/* Main chat */}
        <section className="w-full md:w-2/3 flex flex-col">
          {/* Header mobile */}
          <div className="md:hidden border-b border-slate-800 px-4 py-3 flex items-center justify-between bg-slate-950/80">
            <div>
              <h1 className="text-lg font-semibold">Wellbeing Companion</h1>
              <p className="text-[11px] text-slate-300">
                Hỗ trợ nhẹ nhàng – không phải dịch vụ khẩn cấp.
              </p>
            </div>
            <span className="inline-flex items-center gap-1 text-[11px] text-emerald-300">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />{" "}
              Online
            </span>
          </div>

          {/* Chat area */}
          <div className="flex-1 flex flex-col px-4 md:px-6 py-4 space-y-3 overflow-hidden">
            <div className="flex-1 overflow-y-auto space-y-3 pr-2">
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={`flex ${
                    m.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm leading-relaxed whitespace-pre-line shadow-sm ${
                      m.role === "user"
                        ? "bg-indigo-500 text-white rounded-br-sm"
                        : "bg-slate-900/80 text-slate-50 border border-slate-700/80 rounded-bl-sm"
                    }`}
                  >
                    {m.text}
                  </div>
                </div>
              ))}
              {isSending && (
                <div className="flex justify-start">
                  <div className="max-w-[70%] rounded-2xl px-3 py-2 text-xs bg-slate-900/70 border border-slate-700/80 text-slate-300 flex items-center gap-2">
                    <span className="flex gap-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-slate-400 animate-bounce" />
                      <span className="h-1.5 w-1.5 rounded-full bg-slate-400 animate-bounce [animation-delay:0.12s]" />
                      <span className="h-1.5 w-1.5 rounded-full bg-slate-400 animate-bounce [animation-delay:0.24s]" />
                    </span>
                    <span>Đang suy nghĩ cùng em…</span>
                  </div>
                </div>
              )}
            </div>

            {/* Quick suggestions */}
            <div className="space-y-2">
              <p className="text-[11px] text-slate-300">
                Em có thể bấm nhanh một gợi ý dưới đây nếu chưa biết bắt đầu từ
                đâu:
              </p>
              <div className="flex flex-wrap gap-2">
                {QUICK_SUGGESTIONS.map((q, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleQuickSuggestion(q)}
                    className="text-[11px] px-3 py-1 rounded-full border border-slate-700/80 bg-slate-900/70 hover:bg-slate-800/90 text-slate-100 transition-colors"
                    disabled={isSending}
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="text-xs text-rose-300 bg-rose-900/30 border border-rose-700/60 rounded-xl px-3 py-2">
                {error}
              </div>
            )}

            {/* Input */}
            <form
              onSubmit={handleSubmit}
              className="mt-1 flex items-end gap-2 border border-slate-800 rounded-2xl bg-slate-950/80 px-3 py-2"
            >
              <textarea
                className="flex-1 bg-transparent border-none focus:outline-none focus:ring-0 text-sm text-slate-50 placeholder:text-slate-500 resize-none max-h-32"
                rows={2}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Em đang cảm thấy như thế nào? Viết vài câu mô tả tình huống hoặc cảm xúc của em…"
              />
              <button
                type="submit"
                disabled={isSending || !input.trim()}
                className={`inline-flex items-center justify-center px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                  isSending || !input.trim()
                    ? "bg-slate-700 text-slate-300 cursor-not-allowed"
                    : "bg-indigo-500 hover:bg-indigo-400 text-white shadow-lg shadow-indigo-500/40"
                }`}
              >
                {isSending ? "Đang gửi…" : "Gửi"}
              </button>
            </form>

            <p className="mt-1 text-[10px] text-slate-500 text-center">
              Công cụ này chỉ mang tính hỗ trợ và giáo dục, không thay thế cho
              tư vấn chuyên nghiệp hoặc dịch vụ cấp cứu.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}