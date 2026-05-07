import { useState, useEffect } from "react";

function App() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  // ✨ Typewriter state
  const [displayText, setDisplayText] = useState("");
  const [doneTyping, setDoneTyping] = useState(false);

  const fullText = "Company.AI is an agentic AI assistant designed to help users quickly find answers from company documents. Instead of manually searching through PDFs or reports, users can simply ask a question in natural language, and the system provides a clear, relevant answer. Behind the scenes, Company.AI uses a Retrieval-Augmented Generation (RAG) approach—first retrieving the most relevant sections from the company’s documents, then using an AI model to generate a precise response based on that context. In simple terms, Company.AI acts like a smart assistant that reads your company documents and gives you exactly the information you need, instantly"
  // ✨ Typewriter effect
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
      }, 50);
    }, 100); // slight delay

    return () => clearTimeout(timeout);
  }, []);

  const previewPdf = () => {
    window.open("http://localhost:3000/document.pdf", "_blank");
  };

  const handleAsk = async () => {
    if (!question.trim()) return;

    try {
      setLoading(true);
      setAnswer("");

      const res = await fetch("http://localhost:3000/api/chat", {
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
    <div className="relative min-h-screen flex">
      {/* 🌄 Background Image */}
      <div className="absolute inset-0 bg-[url('../frontend/bg.jpg')] bg-cover bg-center"></div>

      {/* LEFT PANEL */}
      <div className="w-[30%] gap-2 z-10 flex flex-col items-center justify-center text-2xl bg-black/25 backdrop-blur-md shadow-xl shadow-black">
        <div className="absolute top-8 text-3xl text-white px-4 py-2 shadow-3xl shadow-black">
          Company.Ai
        </div>

        <div className="p-5">
          <p className="text-white text-xl leading-relaxed text-center">
            {displayText}
            {!doneTyping && <span className="animate-pulse">|</span>}
          </p>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="w-[70%] z-10 flex items-center justify-center">
        <div className="flex flex-col items-center justify-center min-h-screen gap-16 px-4">
          {/* 🔤 Heading */}
          <h1 className="text-2xl md:text-6xl tracking-wide text-white drop-shadow-[0_10px_15px_rgba(0,0,0,0.9)]">
            Ask anything!
          </h1>
          {/* 📄 Preview Button */}
          <div
            onClick={previewPdf}
            className="absolute bottom-6 right-8 text-white px-4 py-2 shadow-2xl shadow-black hover:bg-white/90 hover:text-black bg-white/10 backdrop-blur-md border border-white/20 rounded-lg transition cursor-pointer"
          >
            Preview PDF
          </div>

          {/* 💬 Chat Section */}
          <div className="flex flex-col items-center gap-4 w-full">
            {/* ✨ Glass Input */}
            <div className="flex w-full max-w-xl bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl overflow-hidden shadow-2xl hover:shadow-3xl transition">
              <input
                type="text"
                placeholder="Ask something..."
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                className="flex-1 w-5xl p-4 bg-transparent text-white placeholder-white outline-none shadow-xl"
              />

              <button
                onClick={handleAsk}
                className="px-6 text-black bg-white/40 hover:bg-white/90 cursor-pointer transition"
              >
                Ask
              </button>
            </div>

            {/* ⏳ Loading */}
            {loading && <p className="text-white animate-pulse">Thinking...</p>}

            {/* 📩 Answer */}
            {answer && (
              <div className="max-w-xl w-full bg-white/10 backdrop-blur-md border border-white/10 p-4 rounded-xl">
                <p className="text-white">{answer}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
