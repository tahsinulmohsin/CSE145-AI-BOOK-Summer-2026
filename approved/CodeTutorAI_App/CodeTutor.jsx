import { useState, useRef, useEffect } from "react";

const LANGUAGES = [
  {
    id: "python",
    label: "Python",
    ext: ".py",
    accent: "#4B8BBE",
    accent2: "#FFD43B",
    blurb: "readable, beginner-friendly, huge ecosystem",
    snippet: 'print("hello, world")',
    keywords: ["def", "return", "if", "elif", "else", "for", "while", "in", "import", "from", "class", "print", "True", "False", "None", "and", "or", "not", "try", "except", "with", "as", "lambda", "self"],
  },
  {
    id: "c",
    label: "C",
    ext: ".c",
    accent: "#6C8EEF",
    accent2: "#A9BCFF",
    blurb: "close to the machine, teaches you how computers work",
    snippet: '#include <stdio.h>\nint main(void) {\n  printf("hi");\n}',
    keywords: ["int", "char", "float", "double", "void", "return", "if", "else", "for", "while", "struct", "include", "define", "const", "static", "sizeof", "typedef", "printf", "scanf"],
  },
  {
    id: "cpp",
    label: "C++",
    ext: ".cpp",
    accent: "#F2578A",
    accent2: "#FFA6C1",
    blurb: "C's power plus classes, templates, and the STL",
    snippet: '#include <iostream>\nint main() {\n  std::cout << "hi";\n}',
    keywords: ["int", "char", "float", "double", "void", "return", "if", "else", "for", "while", "class", "struct", "public", "private", "namespace", "using", "std", "include", "const", "new", "delete", "template", "cout", "cin"],
  },
  {
    id: "java",
    label: "Java",
    ext: ".java",
    accent: "#F0883E",
    accent2: "#FFC98B",
    blurb: "strict, object-oriented, runs almost anywhere",
    snippet: 'class Main {\n  public static void main(String[] a) {\n    System.out.println("hi");\n  }\n}',
    keywords: ["public", "private", "protected", "class", "static", "void", "int", "String", "boolean", "return", "if", "else", "for", "while", "new", "extends", "implements", "import", "package", "System", "final"],
  },
];

const GOAL_CHIPS = [
  "Just the absolute basics",
  "Variables, loops & functions",
  "Object-oriented programming",
  "Build a small project",
  "Get ready for coding interviews",
];

// ---------- lightweight syntax highlighting ----------
function highlight(code, lang) {
  const meta = LANGUAGES.find((l) => l.id === lang) || LANGUAGES.find((l) => l.id === "python");
  const keywords = new Set(meta.keywords);
  const tokens = [];
  const regex = /("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')|(\/\/.*|#(?!include|define).*)|(\b\d+\.?\d*\b)|([A-Za-z_][A-Za-z0-9_]*)|([{}()[\];,.<>+\-*/%=!&|:]+)|(\s+)/g;
  let m;
  let last = 0;
  while ((m = regex.exec(code)) !== null) {
    if (m.index > last) tokens.push({ t: code.slice(last, m.index), type: "plain" });
    if (m[1]) tokens.push({ t: m[1], type: "string" });
    else if (m[2]) tokens.push({ t: m[2], type: "comment" });
    else if (m[3]) tokens.push({ t: m[3], type: "number" });
    else if (m[4]) tokens.push({ t: m[4], type: keywords.has(m[4]) ? "keyword" : "plain" });
    else if (m[5]) tokens.push({ t: m[5], type: "punct" });
    else if (m[6]) tokens.push({ t: m[6], type: "plain" });
    last = regex.lastIndex;
  }
  if (last < code.length) tokens.push({ t: code.slice(last), type: "plain" });
  return tokens;
}

const TOKEN_COLORS = {
  keyword: "#F2578A",
  string: "#9FD88A",
  comment: "#6f7178",
  number: "#FFD43B",
  punct: "#8fa1c7",
  plain: "#e3e1da",
};

function CodeBlock({ code, lang, accent }) {
  const [copied, setCopied] = useState(false);
  const tokens = highlight(code, lang);

  return (
    <div
      style={{
        position: "relative",
        background: "#0c0d10",
        border: "1px solid #22252c",
        borderRadius: 9,
        margin: "12px 0",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "7px 12px",
          borderBottom: "1px solid #1c1e24",
          background: "#111217",
        }}
      >
        <span style={{ color: accent, fontSize: 10.5, letterSpacing: 0.6, textTransform: "uppercase", fontFamily: "'JetBrains Mono', monospace" }}>
          {lang || "code"}
        </span>
        <button
          onClick={() => {
            navigator.clipboard?.writeText(code);
            setCopied(true);
            setTimeout(() => setCopied(false), 1400);
          }}
          style={{
            background: "transparent",
            border: "none",
            color: copied ? accent : "#6f7178",
            fontSize: 10.5,
            fontFamily: "'JetBrains Mono', monospace",
            cursor: "pointer",
            padding: "2px 4px",
            transition: "color 0.15s ease",
          }}
        >
          {copied ? "copied ✓" : "copy"}
        </button>
      </div>
      <pre
        style={{
          margin: 0,
          padding: "12px 14px",
          overflowX: "auto",
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 13.5,
          lineHeight: 1.65,
        }}
      >
        <code>
          {tokens.map((tok, i) => (
            <span key={i} style={{ color: TOKEN_COLORS[tok.type] }}>
              {tok.t}
            </span>
          ))}
        </code>
      </pre>
    </div>
  );
}

function parseContent(text) {
  const parts = [];
  const regex = /```(\w*)\n?([\s\S]*?)```/g;
  let last = 0;
  let m;
  while ((m = regex.exec(text)) !== null) {
    if (m.index > last) parts.push({ type: "text", content: text.slice(last, m.index) });
    parts.push({ type: "code", lang: m[1] || "", content: m[2].replace(/\n$/, "") });
    last = regex.lastIndex;
  }
  if (last < text.length) parts.push({ type: "text", content: text.slice(last) });
  return parts;
}

function MessageContent({ text, accent, langId }) {
  const parts = parseContent(text);
  return (
    <div>
      {parts.map((p, i) =>
        p.type === "code" ? (
          <CodeBlock key={i} code={p.content} lang={p.lang || langId} accent={accent} />
        ) : (
          <span key={i} style={{ whiteSpace: "pre-wrap" }}>
            {p.content}
          </span>
        )
      )}
    </div>
  );
}

function TypingDots({ accent }) {
  return (
    <span style={{ display: "inline-flex", gap: 4, alignItems: "center", height: 14 }}>
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          style={{
            width: 5,
            height: 5,
            borderRadius: "50%",
            background: accent,
            display: "inline-block",
            animation: `bounce 1.2s ${i * 0.15}s infinite ease-in-out`,
          }}
        />
      ))}
    </span>
  );
}

export default function CodeTutor() {
  const [screen, setScreen] = useState("setup");
  const [language, setLanguage] = useState(null);
  const [goal, setGoal] = useState("");
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
    }
  }, [messages, loading]);

  const lang = language || LANGUAGES[0];

  async function callTutor(history) {
    const systemPrompt = `You are a warm, patient, expert programming tutor teaching ${lang.label} to a complete beginner.

The student's stated goal is: "${goal || "learn the basics"}".

Rules for how you teach:
- Teach ONE concept at a time. Never dump a full course in one message.
- Explain the concept in plain, simple language first, no jargon without defining it.
- Give one short, runnable ${lang.label} code example illustrating it, in a fenced code block tagged with the language.
- End almost every message with a small question or a tiny exercise to check understanding before moving on.
- Keep messages focused and not too long — a few short paragraphs at most.
- When the student answers or submits code, give specific, encouraging feedback: what's right, what to fix, and why.
- Adapt pace and depth to their stated goal. Stay strictly beginner-friendly unless they show they're ready for more.
- Never overwhelm. One idea, one example, one check-in.`;

    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 1000,
        system: systemPrompt,
        messages: history,
      }),
    });
    if (!res.ok) throw new Error("Request failed: " + res.status);
    const data = await res.json();
    const text = data.content
      .map((b) => (b.type === "text" ? b.text : ""))
      .filter(Boolean)
      .join("\n");
    return text;
  }

  async function startLesson(chosenLang, chosenGoal) {
    setLanguage(chosenLang);
    setGoal(chosenGoal);
    setScreen("chat");
    setLoading(true);
    setError(null);
    const kickoff = [
      {
        role: "user",
        content: `I'm a beginner and I want to learn ${chosenLang.label}. My goal: ${chosenGoal || "learn the basics"}. Please start teaching me from the very beginning.`,
      },
    ];
    try {
      const reply = await callTutor(kickoff);
      setMessages([...kickoff, { role: "assistant", content: reply }]);
    } catch (e) {
      setError("Couldn't reach the tutor. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function sendMessage() {
    if (!input.trim() || loading) return;
    const next = [...messages, { role: "user", content: input.trim() }];
    setMessages(next);
    setInput("");
    setLoading(true);
    setError(null);
    try {
      const reply = await callTutor(next);
      setMessages([...next, { role: "assistant", content: reply }]);
    } catch (e) {
      setError("Couldn't reach the tutor. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "radial-gradient(ellipse 90% 60% at 50% -10%, #1a1c24 0%, #101114 55%)",
        color: "#EDEBE4",
        fontFamily: "'Inter', sans-serif",
        position: "relative",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');
        * { box-sizing: border-box; }
        ::selection { background: rgba(232,163,61,0.35); }

        .blink { animation: blink 1.1s steps(1) infinite; }
        @keyframes blink { 50% { opacity: 0; } }

        @keyframes bounce {
          0%, 60%, 100% { transform: translateY(0); opacity: 0.5; }
          30% { transform: translateY(-4px); opacity: 1; }
        }

        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .msg-in { animation: fadeSlideUp 0.35s ease both; }
        .stagger { animation: fadeSlideUp 0.5s ease both; }

        .card-btn { transition: transform 0.18s ease, border-color 0.18s ease, background 0.18s ease, box-shadow 0.18s ease; }
        .card-btn:hover { transform: translateY(-3px); box-shadow: 0 10px 24px -12px rgba(0,0,0,0.6); }
        .chip { transition: background 0.15s ease, border-color 0.15s ease, transform 0.15s ease; }
        .chip:hover { border-color: #E8A33D !important; transform: translateY(-1px); }
        .send-btn { transition: filter 0.15s ease, transform 0.1s ease; }
        .send-btn:hover:not(:disabled) { filter: brightness(1.12); }
        .send-btn:active:not(:disabled) { transform: scale(0.97); }
        textarea:focus, input:focus { outline: none; box-shadow: 0 0 0 2px rgba(232,163,61,0.25); }

        .scrollpane::-webkit-scrollbar { width: 8px; }
        .scrollpane::-webkit-scrollbar-track { background: transparent; }
        .scrollpane::-webkit-scrollbar-thumb { background: #2a2d34; border-radius: 8px; }
        .scrollpane::-webkit-scrollbar-thumb:hover { background: #3a3d46; }

        @media (prefers-reduced-motion: reduce) {
          .blink, .msg-in, .stagger { animation: none !important; }
          .card-btn:hover { transform: none; }
        }
      `}</style>

      {screen === "setup" ? (
        <SetupScreen onStart={startLesson} />
      ) : (
        <ChatScreen
          lang={lang}
          goal={goal}
          messages={messages}
          input={input}
          setInput={setInput}
          onSend={sendMessage}
          loading={loading}
          error={error}
          scrollRef={scrollRef}
          onRestart={() => {
            setScreen("setup");
            setMessages([]);
            setLanguage(null);
            setGoal("");
          }}
        />
      )}
    </div>
  );
}

function SetupScreen({ onStart }) {
  const [selected, setSelected] = useState(null);
  const [goal, setGoal] = useState("");

  return (
    <div style={{ maxWidth: 780, margin: "0 auto", padding: "56px 20px 80px" }}>
      <div
        className="stagger"
        style={{
          border: "1px solid #2a2d34",
          borderRadius: 10,
          background: "#16171b",
          overflow: "hidden",
          marginBottom: 40,
          animationDelay: "0s",
        }}
      >
        <div
          style={{
            display: "flex",
            gap: 7,
            padding: "10px 14px",
            borderBottom: "1px solid #2a2d34",
            background: "#1a1c21",
          }}
        >
          <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#4d4f57" }} />
          <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#4d4f57" }} />
          <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#4d4f57" }} />
        </div>
        <div style={{ padding: "22px 24px", fontFamily: "'JetBrains Mono', monospace", fontSize: 14, color: "#9a9ca3" }}>
          <div>
            <span style={{ color: "#E8A33D" }}>$</span> tutor --init
          </div>
          <div style={{ marginTop: 6, color: "#EDEBE4", fontFamily: "'Space Grotesk', sans-serif", fontSize: 26, fontWeight: 600 }}>
            Pick a language. Tell me your goal.
            <span className="blink" style={{ color: "#E8A33D" }}>
              _
            </span>
          </div>
        </div>
      </div>

      <div
        className="stagger"
        style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: "#6f7178", marginBottom: 12, letterSpacing: 0.5, textTransform: "uppercase", animationDelay: "0.08s" }}
      >
        01 — language
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 12, marginBottom: 36 }}>
        {LANGUAGES.map((l, idx) => {
          const isSel = selected?.id === l.id;
          return (
            <button
              key={l.id}
              className="card-btn stagger"
              onClick={() => setSelected(l)}
              style={{
                textAlign: "left",
                cursor: "pointer",
                border: `1px solid ${isSel ? l.accent : "#2a2d34"}`,
                background: isSel ? `${l.accent}14` : "#16171b",
                borderRadius: 10,
                padding: "16px 16px 14px",
                animationDelay: `${0.12 + idx * 0.06}s`,
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: 17, color: "#EDEBE4" }}>
                  {l.label}
                </span>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: l.accent }}>{l.ext}</span>
              </div>
              <div style={{ fontSize: 12.5, color: "#9a9ca3", marginTop: 6, lineHeight: 1.4 }}>{l.blurb}</div>
              <pre
                style={{
                  marginTop: 12,
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 10.5,
                  color: "#6f7178",
                  background: "#0c0d10",
                  border: "1px solid #22252c",
                  borderRadius: 6,
                  padding: "8px 9px",
                  overflowX: "auto",
                  whiteSpace: "pre",
                }}
              >
                {l.snippet}
              </pre>
            </button>
          );
        })}
      </div>

      <div
        className="stagger"
        style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: "#6f7178", marginBottom: 12, letterSpacing: 0.5, textTransform: "uppercase", animationDelay: "0.4s" }}
      >
        02 — how much do you want to learn
      </div>
      <div className="stagger" style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 14, animationDelay: "0.46s" }}>
        {GOAL_CHIPS.map((g) => (
          <button
            key={g}
            className="chip"
            onClick={() => setGoal(g)}
            style={{
              cursor: "pointer",
              padding: "7px 13px",
              borderRadius: 20,
              fontSize: 12.5,
              fontFamily: "'Inter', sans-serif",
              border: `1px solid ${goal === g ? "#E8A33D" : "#2a2d34"}`,
              background: goal === g ? "rgba(232,163,61,0.12)" : "#16171b",
              color: goal === g ? "#E8A33D" : "#c9c9c9",
            }}
          >
            {g}
          </button>
        ))}
      </div>
      <input
        className="stagger"
        value={goal}
        onChange={(e) => setGoal(e.target.value)}
        placeholder="or type your own goal, e.g. 'enough to automate spreadsheets'"
        style={{
          width: "100%",
          background: "#16171b",
          border: "1px solid #2a2d34",
          borderRadius: 8,
          padding: "12px 14px",
          color: "#EDEBE4",
          fontSize: 13.5,
          fontFamily: "'Inter', sans-serif",
          marginBottom: 30,
          animationDelay: "0.52s",
        }}
      />

      <button
        disabled={!selected}
        onClick={() => selected && onStart(selected, goal)}
        className="send-btn stagger"
        style={{
          width: "100%",
          padding: "14px 0",
          borderRadius: 10,
          border: "none",
          cursor: selected ? "pointer" : "not-allowed",
          background: selected ? selected.accent : "#2a2d34",
          color: selected ? "#101114" : "#6f7178",
          fontFamily: "'Space Grotesk', sans-serif",
          fontWeight: 600,
          fontSize: 15,
          animationDelay: "0.58s",
        }}
      >
        {selected ? `Start learning ${selected.label} →` : "Choose a language to continue"}
      </button>
    </div>
  );
}

function ChatScreen({ lang, goal, messages, input, setInput, onSend, loading, error, scrollRef, onRestart }) {
  return (
    <div style={{ maxWidth: 760, margin: "0 auto", padding: "0 20px", display: "flex", flexDirection: "column", height: "100vh" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "18px 0 14px",
          borderBottom: "1px solid #22252c",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 11,
              color: lang.accent,
              border: `1px solid ${lang.accent}55`,
              borderRadius: 5,
              padding: "3px 7px",
            }}
          >
            {lang.ext}
          </span>
          <div>
            <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: 15 }}>Learning {lang.label}</div>
            <div style={{ fontSize: 11.5, color: "#6f7178" }}>{goal || "the basics"}</div>
          </div>
        </div>
        <button
          onClick={onRestart}
          style={{
            background: "transparent",
            border: "1px solid #2a2d34",
            color: "#9a9ca3",
            borderRadius: 7,
            padding: "6px 12px",
            fontSize: 12,
            cursor: "pointer",
            fontFamily: "'Inter', sans-serif",
            transition: "border-color 0.15s ease, color 0.15s ease",
          }}
        >
          Switch language
        </button>
      </div>

      <div ref={scrollRef} className="scrollpane" style={{ flex: 1, overflowY: "auto", padding: "20px 0" }}>
        {messages
          .filter((m) => typeof m.content === "string")
          .map((m, i) => (
            <div key={i} className="msg-in" style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start", marginBottom: 16 }}>
              <div
                style={{
                  maxWidth: "85%",
                  background: m.role === "user" ? "rgba(232,163,61,0.1)" : "#16171b",
                  border: `1px solid ${m.role === "user" ? "rgba(232,163,61,0.35)" : "#22252c"}`,
                  borderRadius: 12,
                  padding: "12px 15px",
                  fontSize: 14,
                  lineHeight: 1.55,
                }}
              >
                <div
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: 10.5,
                    color: m.role === "user" ? "#E8A33D" : lang.accent,
                    marginBottom: 5,
                    letterSpacing: 0.5,
                  }}
                >
                  {m.role === "user" ? "you" : "tutor"}
                </div>
                <MessageContent text={m.content} accent={lang.accent} langId={lang.id} />
              </div>
            </div>
          ))}
        {loading && (
          <div className="msg-in" style={{ display: "flex", justifyContent: "flex-start", marginBottom: 16 }}>
            <div style={{ background: "#16171b", border: "1px solid #22252c", borderRadius: 12, padding: "12px 15px" }}>
              <TypingDots accent={lang.accent} />
            </div>
          </div>
        )}
        {error && <div style={{ color: "#F2578A", fontSize: 12.5, marginTop: 4 }}>{error}</div>}
      </div>

      <div style={{ display: "flex", gap: 8, padding: "14px 0 20px" }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && onSend()}
          placeholder="Type your answer or question..."
          disabled={loading}
          style={{
            flex: 1,
            background: "#16171b",
            border: "1px solid #2a2d34",
            borderRadius: 8,
            padding: "12px 14px",
            color: "#EDEBE4",
            fontSize: 13.5,
            fontFamily: "'Inter', sans-serif",
          }}
        />
        <button
          onClick={onSend}
          disabled={loading || !input.trim()}
          className="send-btn"
          style={{
            padding: "0 22px",
            borderRadius: 8,
            border: "none",
            cursor: loading ? "not-allowed" : "pointer",
            background: lang.accent,
            color: "#101114",
            fontFamily: "'Space Grotesk', sans-serif",
            fontWeight: 600,
            fontSize: 13.5,
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
}
