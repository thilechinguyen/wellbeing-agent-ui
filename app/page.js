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

  // Handle send message
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
          ...studentProfile, // NEW: send profile to backend
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
        { role: "assistant", content: "Lỗi kết nối server." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#0c0f1a] text-white flex flex-col items-center p-6">

      <h1 className="text-3xl font-bold mb-4">
        Wellbeing Companion (v2.0)
      </h1>

      {/* 🔥 NEW: Dropdown chọn student profile */}
      <div className="bg-[#1a1f2e] p-4 rounded-xl w-full max-w-xl mb-4 shadow-lg">
        <h2 className="font-semibold text-lg mb-2">Student Profile</h2>

        <label className="block text-sm mb-1">Student Type</label>
        <select
          className="w-full mb-3 p-2 rounded bg-[#0c0f1a] border border-gray-600"
          value={studentProfile.student_type}
          onChange={(e) =>
            setStudentProfile((prev) => ({
              ...prev,
              student_type: e.target.value,
            }))
          }
        >
          <option value="domestic">Domestic (Australia)</option>
          <option value="international">International</option>
        </select>

        <label className="block text-sm mb-1">Region</label>
        <select
          className="w-full p-2 rounded bg-[#0c0f1a] border border-gray-600"
          value={studentProfile.student_region}
          onChange={(e) =>
            setStudentProfile((prev) => ({
              ...prev,
              student_region: e.target.value,
            }))
          }
        >
          <option value="au">🇦🇺 Australia</option>
          <option value="se_asia">🌏 SE Asia</option>
          <option value="europe">🇪🇺 Europe</option>
          <option value="other">🌍 Other Regions</option>
        </select>
      </div>

      {/* Chat UI */}
      <div className="w-full max-w-xl bg-[#1a1f2e] p-4 rounded-xl mb-4 h-[60vh] overflow-y-auto shadow-lg">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`mb-3 p-3 rounded-lg ${
              m.role === "user"
                ? "bg-blue-600 text-white self-end"
                : "bg-gray-700 text-white"
            }`}
          >
            {m.content}
          </div>
        ))}
      </div>

      {/* Input box */}
      <div className="w-full max-w-xl flex gap-2">
        <input
          className="flex-1 p-3 rounded bg-[#1a1f2e] border border-gray-700 focus:outline-none"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Nhập tin nhắn..."
        />
        <button
          onClick={sendMessage}
          disabled={loading}
          className="px-4 py-3 bg-blue-600 hover:bg-blue-700 rounded-xl"
        >
          {loading ? "..." : "Gửi"}
        </button>
      </div>

    </main>
  );
}
