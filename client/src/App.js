import { useState } from "react";

const modes = [
  {
    id: "explain",
    label: "Explain Concept",
    emoji: "🧠",
    color: "#6EE7F7",
    bg: "from-cyan-500/20 to-blue-500/20",
    border: "border-cyan-400/50",
    glow: "shadow-cyan-500/25",
    placeholder: "e.g. What is recursion in programming?",
  },
  {
    id: "mcq",
    label: "Generate MCQs",
    emoji: "📝",
    color: "#A78BFA",
    bg: "from-violet-500/20 to-purple-500/20",
    border: "border-violet-400/50",
    glow: "shadow-violet-500/25",
    placeholder: "e.g. JavaScript closures",
  },
  {
    id: "summarize",
    label: "Summarize Text",
    emoji: "📌",
    color: "#34D399",
    bg: "from-emerald-500/20 to-teal-500/20",
    border: "border-emerald-400/50",
    glow: "shadow-emerald-500/25",
    placeholder: "Paste any long text here to summarize...",
  },
  {
    id: "improve",
    label: "Improve Writing",
    emoji: "✨",
    color: "#FBBF24",
    bg: "from-amber-500/20 to-orange-500/20",
    border: "border-amber-400/50",
    glow: "shadow-amber-500/25",
    placeholder: "Paste your text here to improve its quality...",
  },
];

function MCQDisplay({ text }) {
  try {
    const clean = text.replace(/```json|```/g, "").trim();
    const data = JSON.parse(clean);
    if (!data.questions) throw new Error("no questions");
    return (
      <div className="space-y-6">
        {data.questions.map((q, i) => (
          <div key={i} className="bg-white/5 rounded-2xl p-5 border border-white/10">
            <p className="text-white font-semibold mb-4 text-lg">
              <span className="text-violet-400 mr-2">Q{i + 1}.</span>
              {q.question}
            </p>
            <div className="grid grid-cols-1 gap-2 mb-3">
              {Object.entries(q.options).map(([key, val]) => (
                <div
                  key={key}
                  className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
                    key === q.correct_answer
                      ? "bg-emerald-500/20 border-emerald-400/60 text-emerald-300"
                      : "bg-white/5 border-white/10 text-gray-300"
                  }`}
                >
                  <span className={`font-bold text-sm w-6 h-6 flex items-center justify-center rounded-full ${
                    key === q.correct_answer ? "bg-emerald-400 text-black" : "bg-white/10 text-white"
                  }`}>{key}</span>
                  <span>{val}</span>
                  {key === q.correct_answer && <span className="ml-auto text-emerald-400 text-sm">✓ Correct</span>}
                </div>
              ))}
            </div>
            {q.explanation && (
              <p className="text-sm text-gray-400 italic border-t border-white/10 pt-3">
                💡 {q.explanation}
              </p>
            )}
          </div>
        ))}
      </div>
    );
  } catch {
    return <p className="text-gray-200 leading-relaxed whitespace-pre-wrap">{text}</p>;
  }
}

export default function App() {
  const [prompt, setPrompt] = useState("");
  const [mode, setMode] = useState(modes[0]);
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setError("");
    setResponse("");
    setSubmitted(true);

    try {
      const res = await fetch("http://localhost:5000/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: prompt.trim(), mode: mode.id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");
      setResponse(data.response);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setPrompt("");
    setResponse("");
    setError("");
    setSubmitted(false);
  };

  return (
    <div className="min-h-screen bg-[#080B14] text-white overflow-x-hidden" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Syne:wght@700;800&display=swap" rel="stylesheet" />

      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full opacity-20 blur-3xl" style={{ background: "radial-gradient(circle, #6EE7F7, transparent)" }} />
        <div className="absolute top-1/2 -right-40 w-96 h-96 rounded-full opacity-15 blur-3xl" style={{ background: "radial-gradient(circle, #A78BFA, transparent)" }} />
        <div className="absolute -bottom-40 left-1/3 w-96 h-96 rounded-full opacity-15 blur-3xl" style={{ background: "radial-gradient(circle, #34D399, transparent)" }} />
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
          backgroundSize: "50px 50px"
        }} />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-1.5 text-sm text-gray-400 mb-6">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            AI-Powered • Gemini 1.5 Flash
          </div>
          <h1 className="text-5xl md:text-6xl font-black mb-4 leading-tight" style={{ fontFamily: "'Syne', sans-serif" }}>
            Student{" "}
            <span style={{
              background: "linear-gradient(135deg, #6EE7F7 0%, #A78BFA 50%, #FBBF24 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent"
            }}>Assistant</span>
          </h1>
          <p className="text-gray-600 text-sm mt-2">
          Developed byy <span style={{color: "#6EE7F7"}}>Gayatri Ingole</span>
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          {modes.map((m) => (
            <button
              key={m.id}
              onClick={() => { setMode(m); setResponse(""); setError(""); }}
              className={`relative p-4 rounded-2xl border transition-all duration-300 text-left group ${
                mode.id === m.id
                  ? `bg-gradient-to-br ${m.bg} ${m.border} shadow-lg ${m.glow}`
                  : "bg-white/3 border-white/10 hover:bg-white/8 hover:border-white/20"
              }`}
            >
              <div className="text-2xl mb-2">{m.emoji}</div>
              <div className={`text-sm font-semibold ${mode.id === m.id ? "text-white" : "text-gray-400"}`}>
                {m.label}
              </div>
              {mode.id === m.id && (
                <div className="absolute top-2 right-2 w-2 h-2 rounded-full" style={{ background: m.color }} />
              )}
            </button>
          ))}
        </div>

        <div className={`relative rounded-3xl border p-1 mb-6 transition-all duration-300 bg-gradient-to-br ${mode.bg} ${mode.border} shadow-xl ${mode.glow}`}>
          <div className="bg-[#0D1117] rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xl">{mode.emoji}</span>
              <span className="text-sm font-medium" style={{ color: mode.color }}>{mode.label}</span>
            </div>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder={mode.placeholder}
              rows={5}
              className="w-full bg-transparent text-white placeholder-gray-600 resize-none outline-none text-base leading-relaxed"
              onKeyDown={(e) => { if (e.key === "Enter" && e.ctrlKey) handleSubmit(); }}
            />
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/10">
              <span className="text-xs text-gray-600">{prompt.length}/2000 • Ctrl+Enter to submit</span>
              <div className="flex gap-3">
                {(response || error || prompt) && (
                  <button onClick={handleClear} className="px-4 py-2 rounded-xl text-sm text-gray-400 hover:text-white border border-white/10 hover:border-white/30 transition-all">
                    Clear
                  </button>
                )}
                <button
                  onClick={handleSubmit}
                  disabled={loading || !prompt.trim()}
                  className="px-6 py-2 rounded-xl text-sm font-semibold transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed"
                  style={{ background: loading || !prompt.trim() ? "#374151" : `linear-gradient(135deg, ${mode.color}, ${mode.color}99)`, color: loading || !prompt.trim() ? "#9CA3AF" : "#000" }}
                >
                  {loading ? "Generating..." : "Generate →"}
                </button>
              </div>
            </div>
          </div>
        </div>

        {loading && (
          <div className="rounded-3xl border border-white/10 bg-white/3 p-10 flex flex-col items-center gap-5">
            <div className="relative w-14 h-14">
              <div className="absolute inset-0 rounded-full border-2 border-white/10" />
              <div className="absolute inset-0 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: `${mode.color} transparent transparent transparent` }} />
            </div>
            <div className="text-center">
              <p className="text-white font-medium mb-1">AI is thinking...</p>
              <p className="text-gray-500 text-sm">Crafting your personalized response</p>
            </div>
          </div>
        )}

        {error && !loading && (
          <div className="rounded-3xl border border-red-500/30 bg-red-500/10 p-6">
            <div className="flex items-start gap-3">
              <span className="text-2xl">⚠️</span>
              <div>
                <p className="text-red-400 font-semibold mb-1">Something went wrong</p>
                <p className="text-red-300/70 text-sm">{error}</p>
              </div>
            </div>
          </div>
        )}

        {response && !loading && (
          <div className={`rounded-3xl border p-1 transition-all duration-500 bg-gradient-to-br ${mode.bg} ${mode.border} shadow-xl`}>
            <div className="bg-[#0D1117] rounded-2xl p-6">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm" style={{ background: `${mode.color}20`, border: `1px solid ${mode.color}40` }}>
                    {mode.emoji}
                  </div>
                  <span className="font-semibold text-sm" style={{ color: mode.color }}>AI Response</span>
                </div>
                <button
                  onClick={() => navigator.clipboard.writeText(response)}
                  className="text-xs text-gray-500 hover:text-white border border-white/10 hover:border-white/30 px-3 py-1.5 rounded-lg transition-all"
                >
                  Copy
                </button>
              </div>
              <div className="text-gray-200 leading-relaxed">
                {mode.id === "mcq" ? <MCQDisplay text={response} /> : <p className="whitespace-pre-wrap text-base">{response}</p>}
              </div>
            </div>
          </div>
        )}

        <p className="text-center text-gray-700 text-xs mt-12">
          Built with ❤️ by Gayatri Ingole • MERN Stack Internship Assignment
        </p>
      </div>
    </div>
  );
}