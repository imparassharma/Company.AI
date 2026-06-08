import { useState, useEffect } from "react";

function App() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  const [displayText, setDisplayText] = useState("");
  const [doneTyping, setDoneTyping] = useState(false);

  const fullText =
    "Coompany.AI is an agentic AI assistant that helps users instantly find answers from company documents using advanced RAG-based AI retrieval.";

  // ✨ Typewriter Effect
  useEffect(() => {
    let i = 0;

    const timeout = setTimeout(() => {
      const interval = setInterval(() => {
        setDisplayText((prev) => prev + fullText.charAt(i));
        i++;

        if (i >= fullText.length) {
          clearInterval(interval);
          setDoneTyping(true);
        }
      }, 20);
    }, 200);

    return () => clearTimeout(timeout);
  }, []);

  // 📄 PDF Preview
  const previewPdf = () => {
    window.open(
      "https://drive.google.com/file/d/1XokS_brYHFaa9ejzuc7H5UtpRoNJkV6j/view?usp=drive_link",
      "_blank",
    );
  };

  // 🤖 Ask AI
  const handleAsk = async () => {
    if (!question.trim()) return;

    try {
      setLoading(true);
      setAnswer("");

      const res = await fetch("https://company-ai.onrender.com/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question }),
      });

      const data = await res.json();
      setAnswer(data.answer);
    } catch (err) {
      console.error("Error:", err);
      setAnswer("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="relative min-h-screen overflow-hidden bg-black select-none"
      onCopy={(e) => e.preventDefault()}
      onCut={(e) => e.preventDefault()}
    >
      {/* 🌌 Background */}
      <div className="absolute inset-0 bg-[url('../frontend/bgdark.png')]"></div>

      {/* ✨ Shooting Stars */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="shooting-star star1"></div>
        <div className="shooting-star star2"></div>
        <div className="shooting-star star3"></div>
        <div className="shooting-star star4"></div>
      </div>

      {/* MAIN CONTENT */}
      {/* On mobile: column layout, full screen height, no overflow on outer container */}
      <div className="relative z-10 flex flex-col md:flex-row h-screen">
        {/* LEFT PANEL — fixed height on mobile so typewriter never causes layout shift */}
        <div className="w-full h-[260px] shrink-0 md:h-auto md:w-[30%] flex flex-col justify-center items-center px-5 md:px-8 md:py-12 bg-white/5 backdrop-blur-xl border-b md:border-b-0 md:border-r border-white/10">
          {/* Logo */}
          <div className="mb-2 md:mb-8">
            <h1 className="text-3xl md:text-4xl font-semibold tracking-wide text-white">
              Company.AI
            </h1>
          </div>

          {/* Description — fixed height on mobile so typewriter growth doesn't shift layout */}
          <div className="h-[88px] md:h-auto w-full max-w-xs md:max-w-sm flex items-start justify-center md:items-center overflow-hidden">
            <p className="text-white/80 text-sm md:text-lg leading-relaxed text-center">
              {displayText}
              {!doneTyping && <span className="animate-pulse">|</span>}
            </p>
          </div>

          {/* PDF Button */}
          <button
            onClick={previewPdf}
            className="mt-3 md:mt-5 px-5 py-2.5 md:py-3 rounded-xl border border-white/10 bg-white/10 backdrop-blur-xl text-white hover:bg-white hover:text-black transition-all duration-300 shadow-[0_0_25px_rgba(255,255,255,0.08)]"
          >
            Preview PDF
          </button>
        </div>

        {/* RIGHT PANEL — takes remaining height, scrolls internally */}
        <div className="flex-1 flex flex-col min-h-0 md:w-[70%]">
          {/* 
            Mobile: input pinned at top (shrink-0), answer scrolls below.
            Desktop: entire content centered via justify-center on a scrollable column.
          */}

          {/* Mobile layout */}
          <div className="flex flex-col min-h-0 flex-1 md:hidden">
            {/* Input — pinned top on mobile */}
            <div className="shrink-0 flex flex-col items-center gap-4 px-4 pt-8 pb-4">
              <h1 className="text-4xl sm:text-5xl text-center text-white drop-shadow-[0_0_25px_rgba(255,255,255,0.35)]">
                Ask anything!
              </h1>

              <div className="relative w-full max-w-3xl overflow-hidden rounded-2xl border border-white/20 bg-white/10 backdrop-blur-2xl shadow-[0_0_35px_rgba(255,255,255,0.08)]">
                <div className="absolute inset-0 shine pointer-events-none"></div>
                <div className="flex flex-col sm:flex-row">
                  <input
                    type="text"
                    placeholder="Ask something..."
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleAsk();
                    }}
                    className="flex-1 px-5 py-4 bg-transparent text-white placeholder-white/50 outline-none text-base"
                  />
                  <button
                    onClick={handleAsk}
                    className="px-8 py-4 bg-white/80 hover:bg-white text-black font-medium transition-all duration-300"
                  >
                    Ask
                  </button>
                </div>
              </div>
            </div>

            {/* Answer — scrollable below input on mobile */}
            <div className="flex-1 overflow-y-auto px-4 pb-6 flex flex-col items-center gap-4">
              {loading && (
                <p className="text-white animate-pulse mt-2">Thinking...</p>
              )}
              {answer && (
                <div className="w-full max-w-3xl rounded-2xl border border-white/10 bg-white/10 backdrop-blur-xl p-5 shadow-2xl">
                  <p className="text-white whitespace-pre-wrap leading-relaxed">
                    {answer}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Desktop layout — centered, scrollable */}
          <div className="hidden md:flex flex-col flex-1 overflow-y-auto">
            <div className="flex flex-col items-center justify-center min-h-full gap-10 px-8 py-12">
              <h1 className="text-7xl text-center text-white drop-shadow-[0_0_25px_rgba(255,255,255,0.35)]">
                Ask anything!
              </h1>

              <div className="relative w-full max-w-3xl overflow-hidden rounded-2xl border border-white/20 bg-white/10 backdrop-blur-2xl shadow-[0_0_35px_rgba(255,255,255,0.08)]">
                <div className="absolute inset-0 shine pointer-events-none"></div>
                <div className="flex">
                  <input
                    type="text"
                    placeholder="Ask something..."
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleAsk();
                    }}
                    className="flex-1 px-5 py-5 bg-transparent text-white placeholder-white/50 outline-none text-lg"
                  />
                  <button
                    onClick={handleAsk}
                    className="px-8 py-4 bg-white/80 hover:bg-white text-black font-medium transition-all duration-300"
                  >
                    Ask
                  </button>
                </div>
              </div>

              {loading && (
                <p className="text-white animate-pulse">Thinking...</p>
              )}

              {answer && (
                <div className="w-full max-w-3xl rounded-2xl border border-white/10 bg-white/10 backdrop-blur-xl p-5 shadow-2xl">
                  <p className="text-white whitespace-pre-wrap leading-relaxed">
                    {answer}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ✨ Custom CSS */}
      <style>{`
        .shooting-star {
          position: absolute;
          width: 2px;
          height: 120px;
          background: linear-gradient(to bottom, white, transparent);
          opacity: 0.8;
          transform: rotate(45deg);
          animation: shooting 6s linear infinite;
        }

        .star1 { top: 10%; left: 20%; animation-delay: 0s; }
        .star2 { top: 0%;  left: 70%; animation-delay: 2s; }
        .star3 { top: 20%; left: 90%; animation-delay: 4s; }
        .star4 { top: 5%;  left: 50%; animation-delay: 1s; }

        @keyframes shooting {
          0%   { transform: translateY(0) translateX(0) rotate(45deg); opacity: 0; }
          10%  { opacity: 1; }
          100% { transform: translateY(900px) translateX(-900px) rotate(45deg); opacity: 0; }
        }

        .shine {
          background: linear-gradient(
            120deg,
            transparent 20%,
            rgba(255, 255, 255, 0.12) 40%,
            transparent 60%
          );
          animation: shineMove 4s linear infinite;
        }

        @keyframes shineMove {
          0%   { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
}

export default App;
