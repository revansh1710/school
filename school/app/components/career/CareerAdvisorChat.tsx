"use client";

import React, { useState, useRef, useEffect } from "react";
import { MessageSquare, X, Send, Bot, User, Sparkles, ShieldCheck, AlertCircle } from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  guardrails?: {
    suspiciousAttemptDetected?: boolean;
    stepsTaken?: number;
  };
}

const PRESET_QUESTIONS = [
  "What positions are currently open?",
  "Am I eligible with an M.Sc and B.Ed?",
  "What documents are required to apply?",
  "What are the CBSE teaching guidelines?",
];

/* ---------------------------------------------------------------------- */
/*  One-time global stylesheet for the advisor widget.                    */
/*  Scoped with a `ca-` prefix so it can't collide with host site CSS.    */
/* ---------------------------------------------------------------------- */
function CareerAdvisorStyles() {
  return (
    <style>{`
      @keyframes ca-trigger-in {
        0%   { opacity: 0; transform: translateY(18px) scale(0.85); }
        100% { opacity: 1; transform: translateY(0) scale(1); }
      }
      @keyframes ca-ring-pulse {
        0%   { box-shadow: 0 0 0 0 rgba(56,189,248,0.45), 0 0 0 0 rgba(16,185,129,0.35); }
        70%  { box-shadow: 0 0 0 10px rgba(56,189,248,0), 0 0 0 18px rgba(16,185,129,0); }
        100% { box-shadow: 0 0 0 0 rgba(56,189,248,0), 0 0 0 0 rgba(16,185,129,0); }
      }
      @keyframes ca-sparkle-spin {
        0%   { transform: rotate(0deg) scale(1); }
        50%  { transform: rotate(180deg) scale(1.15); }
        100% { transform: rotate(360deg) scale(1); }
      }
      @keyframes ca-window-in {
        0%   { opacity: 0; transform: translateY(28px) scale(0.94); filter: blur(6px); }
        100% { opacity: 1; transform: translateY(0) scale(1); filter: blur(0); }
      }
      @keyframes ca-sheen {
        0%   { transform: translateX(-120%) skewX(-15deg); }
        100% { transform: translateX(220%) skewX(-15deg); }
      }
      @keyframes ca-status-pulse {
        0%   { box-shadow: 0 0 0 0 rgba(52,211,153,0.55); }
        70%  { box-shadow: 0 0 0 6px rgba(52,211,153,0); }
        100% { box-shadow: 0 0 0 0 rgba(52,211,153,0); }
      }
      @keyframes ca-msg-in-left {
        0%   { opacity: 0; transform: translateY(10px) scale(0.94); }
        100% { opacity: 1; transform: translateY(0) scale(1); }
      }
      @keyframes ca-msg-in-right {
        0%   { opacity: 0; transform: translateY(10px) scale(0.94); }
        100% { opacity: 1; transform: translateY(0) scale(1); }
      }
      @keyframes ca-avatar-pop {
        0%   { opacity: 0; transform: scale(0.4) rotate(-12deg); }
        60%  { transform: scale(1.08) rotate(3deg); }
        100% { opacity: 1; transform: scale(1) rotate(0deg); }
      }
      @keyframes ca-dot-wave {
        0%, 60%, 100% { transform: translateY(0); opacity: 0.5; }
        30% { transform: translateY(-5px); opacity: 1; }
      }
      @keyframes ca-thinking-glow {
        0%, 100% { box-shadow: 0 0 0 0 rgba(14,165,233,0.35); }
        50%      { box-shadow: 0 0 0 6px rgba(14,165,233,0); }
      }
      @keyframes ca-pill-in {
        0%   { opacity: 0; transform: translateY(8px) scale(0.92); }
        100% { opacity: 1; transform: translateY(0) scale(1); }
      }
      @keyframes ca-banner-in {
        0%   { opacity: 0; transform: translateY(-10px); }
        100% { opacity: 1; transform: translateY(0); }
      }
      @keyframes ca-shake {
        0%, 100% { transform: translateX(0); }
        20% { transform: translateX(-2px); }
        40% { transform: translateX(2px); }
        60% { transform: translateX(-2px); }
        80% { transform: translateX(2px); }
      }
      @keyframes ca-gradient-flow {
        0%   { background-position: 0% 50%; }
        50%  { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
      }
      @keyframes ca-badge-in {
        0% { opacity: 0; transform: scale(0.6); }
        100% { opacity: 1; transform: scale(1); }
      }

      .ca-trigger-btn {
        animation: ca-trigger-in 0.55s cubic-bezier(0.16, 1, 0.3, 1) both;
        background-size: 200% 200%;
        background-image: linear-gradient(115deg, #0c2b52, #0e4a86 45%, #0c2b52);
        transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.35s ease;
      }
      .ca-trigger-btn:hover {
        transform: translateY(-3px) scale(1.035);
        background-position: 100% 50%;
      }
      .ca-trigger-btn:active { transform: translateY(-1px) scale(0.98); }
      .ca-trigger-ring {
        animation: ca-ring-pulse 2.6s cubic-bezier(0.4, 0, 0.6, 1) infinite;
      }
      .ca-trigger-sparkle { transition: transform 0.4s ease; }
      .ca-trigger-btn:hover .ca-trigger-sparkle { animation: ca-sparkle-spin 0.9s ease; }
      .ca-status-dot { animation: ca-status-pulse 2s ease-out infinite; }

      .ca-window {
        animation: ca-window-in 0.42s cubic-bezier(0.16, 1, 0.3, 1) both;
        transform-origin: bottom right;
      }

      .ca-header { position: relative; overflow: hidden; }
      .ca-header::before {
        content: "";
        position: absolute;
        inset: 0;
        background-image: linear-gradient(120deg, transparent, transparent 40%, rgba(255,255,255,0.09) 50%, transparent 60%, transparent);
      }
      .ca-header::after {
        content: "";
        position: absolute;
        top: 0; left: 0;
        width: 45%; height: 100%;
        background: linear-gradient(115deg, transparent, rgba(255,255,255,0.16), transparent);
        animation: ca-sheen 5.5s ease-in-out infinite;
        animation-delay: 1.2s;
        pointer-events: none;
      }

      .ca-msg-row-assistant { animation: ca-msg-in-left 0.38s cubic-bezier(0.16, 1, 0.3, 1) both; }
      .ca-msg-row-user { animation: ca-msg-in-right 0.38s cubic-bezier(0.16, 1, 0.3, 1) both; }
      .ca-avatar { animation: ca-avatar-pop 0.42s cubic-bezier(0.34, 1.56, 0.64, 1) both; }
      .ca-bubble {
        transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.25s ease;
      }
      .ca-bubble:hover { transform: translateY(-1px); box-shadow: 0 8px 22px -10px rgba(15,23,42,0.28); }

      .ca-typing-avatar { animation: ca-thinking-glow 1.8s ease-in-out infinite; }
      .ca-dot { animation: ca-dot-wave 1.15s ease-in-out infinite; }
      .ca-dot:nth-child(1) { animation-delay: 0s; }
      .ca-dot:nth-child(2) { animation-delay: 0.15s; }
      .ca-dot:nth-child(3) { animation-delay: 0.3s; }

      .ca-pill {
        animation: ca-pill-in 0.4s cubic-bezier(0.16, 1, 0.3, 1) both;
        transition: transform 0.22s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.22s ease, border-color 0.22s ease, background 0.22s ease;
      }
      .ca-pill:hover { transform: translateY(-2px); box-shadow: 0 6px 16px -8px rgba(2,132,199,0.45); }
      .ca-pill:active { transform: translateY(0) scale(0.97); }

      .ca-banner { animation: ca-banner-in 0.3s cubic-bezier(0.16, 1, 0.3, 1) both; }
      .ca-banner-icon { animation: ca-shake 0.5s ease-in-out 0.15s both; }

      .ca-input-wrap {
        position: relative;
        border-radius: 9999px;
        padding: 1.5px;
        background-image: linear-gradient(90deg, #e2e8f0, #e2e8f0);
        background-size: 200% 100%;
        transition: background-image 0.3s ease;
      }
      .ca-input-wrap:focus-within {
        background-image: linear-gradient(90deg, #0ea5e9, #14b8a6, #0ea5e9);
        animation: ca-gradient-flow 3s ease infinite;
        box-shadow: 0 0 0 4px rgba(14,165,233,0.12);
      }
      .ca-input-field {
        transition: background-color 0.2s ease;
      }

      .ca-send-btn {
        background-image: linear-gradient(135deg, #0c4a6e, #0369a1 50%, #0c4a6e);
        background-size: 200% 200%;
        transition: transform 0.22s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.22s ease, background-position 0.4s ease;
      }
      .ca-send-btn:not(:disabled):hover {
        transform: scale(1.08) rotate(-4deg);
        background-position: 100% 100%;
        box-shadow: 0 6px 18px -6px rgba(3,105,161,0.55);
      }
      .ca-send-btn:not(:disabled):active { transform: scale(0.94) rotate(0deg); }
      .ca-send-icon { transition: transform 0.22s ease; }
      .ca-send-btn:not(:disabled):hover .ca-send-icon { transform: translateX(1px) translateY(-1px); }

      .ca-badge-filtered { animation: ca-badge-in 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) both; }

      .ca-scroll::-webkit-scrollbar { width: 6px; }
      .ca-scroll::-webkit-scrollbar-track { background: transparent; }
      .ca-scroll::-webkit-scrollbar-thumb {
        background-color: rgba(100,116,139,0.35);
        border-radius: 9999px;
      }
      .ca-scroll::-webkit-scrollbar-thumb:hover { background-color: rgba(100,116,139,0.55); }
      .ca-scroll { scrollbar-width: thin; scrollbar-color: rgba(100,116,139,0.35) transparent; }

      .ca-close-btn { transition: transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1), background-color 0.2s ease; }
      .ca-close-btn:hover { transform: rotate(90deg) scale(1.08); }

      @media (prefers-reduced-motion: reduce) {
        .ca-trigger-btn, .ca-trigger-ring, .ca-trigger-sparkle, .ca-status-dot,
        .ca-window, .ca-header::after, .ca-msg-row-assistant, .ca-msg-row-user,
        .ca-avatar, .ca-bubble, .ca-typing-avatar, .ca-dot, .ca-pill, .ca-banner,
        .ca-banner-icon, .ca-input-wrap, .ca-send-btn, .ca-send-icon, .ca-badge-filtered,
        .ca-close-btn {
          animation: none !important;
          transition: none !important;
        }
      }
    `}</style>
  );
}

function renderCleanMessage(content: string, isUser: boolean) {
  const lines = content.split("\n");

  return (
    <div className={`space-y-1.5 leading-relaxed ${isUser ? "text-white" : "text-slate-800"}`}>
      {lines.map((line, idx) => {
        const trimmed = line.trim();
        if (!trimmed) {
          return <div key={idx} className="h-1" />;
        }

        // Heading lines (e.g. ### Header)
        if (trimmed.startsWith("###") || trimmed.startsWith("##")) {
          const headingText = trimmed.replace(/^#+\s*/, "").replace(/\*\*/g, "");
          return (
            <p key={idx} className={`font-bold mt-2 first:mt-0 ${isUser ? "text-white" : "text-slate-900 font-semibold"}`}>
              {headingText}
            </p>
          );
        }

        // Bullet point lines (*, -, or •)
        const isBullet = /^[*\-•]\s+/.test(trimmed);
        const lineContent = isBullet ? trimmed.replace(/^[*\-•]\s+/, "") : trimmed;

        // Parse inline bold markers **...** cleanly into <strong> tags
        const parts = lineContent.split(/(\*\*[^*]+\*\*)/g);

        return (
          <div key={idx} className={isBullet ? "flex items-start gap-2 pl-1" : ""}>
            {isBullet && (
              <span className={`mt-1.5 h-1.5 w-1.5 rounded-full shrink-0 ${isUser ? "bg-sky-200" : "bg-sky-700"}`} />
            )}
            <p className="flex-1">
              {parts.map((part, pIdx) => {
                if (part.startsWith("**") && part.endsWith("**")) {
                  return (
                    <strong key={pIdx} className={`font-semibold ${isUser ? "text-white font-bold" : "text-slate-950 font-bold"}`}>
                      {part.slice(2, -2)}
                    </strong>
                  );
                }
                // Strip any stray lone asterisks
                return part.replace(/\*/g, "");
              })}
            </p>
          </div>
        );
      })}
    </div>
  );
}

export default function CareerAdvisorChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome-1",
      role: "assistant",
      content:
        "Hello! I am the School Faculty & Careers Advisor. I can check active openings, verify your eligibility against CBSE standards, and guide your application. How can I help you today?",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorBanner, setErrorBanner] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputValue).trim();
    if (!query || isLoading) return;

    setErrorBanner(null);
    setInputValue("");

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content: query,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const response = await fetch("/api/agent/careers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: query }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 429) {
          setErrorBanner(`Rate limit reached. Please wait ${data.retryAfterSeconds || 60}s.`);
        } else {
          setErrorBanner(data.error || "Failed to reach careers advisor.");
        }
        return;
      }

      const assistantMsg: Message = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: data.reply || "I couldn't find details on that. Please check our careers page or contact careers@school.edu.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        guardrails: data.guardrails,
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err: any) {
      console.error("Chat error:", err);
      setErrorBanner("Network error. Please check your connection.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <CareerAdvisorStyles />

      {/* Floating Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="ca-trigger-btn ca-trigger-ring fixed bottom-6 right-6 z-50 flex items-center gap-2.5 rounded-full px-5 py-3.5 text-sm font-semibold text-white shadow-2xl shadow-sky-900/40 focus:outline-none focus:ring-4 focus:ring-sky-500/30 cursor-pointer"
        >
          <Sparkles className="ca-trigger-sparkle h-4 w-4 text-sky-300" />
          <span>Ask Careers Advisor</span>
          <span className="ca-status-dot flex h-2 w-2 rounded-full bg-emerald-400" />
        </button>
      )}

      {/* Interactive Chat Window */}
      {isOpen && (
        <div className="ca-window fixed bottom-6 right-6 z-50 flex h-[620px] w-[92vw] max-w-[420px] flex-col overflow-hidden rounded-3xl border border-slate-200/80 bg-white/95 shadow-[0_25px_70px_rgba(15,23,42,0.22)] backdrop-blur-xl">
          {/* Header */}
          <div className="ca-header flex items-center justify-between border-b border-slate-100 bg-sky-950 px-5 py-4 text-white">
            <div className="relative flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-sky-800/80 ring-1 ring-white/20">
                <Bot className="h-5 w-5 text-sky-200" />
              </div>
              <div>
                <h3 className="text-sm font-semibold tracking-tight text-white flex items-center gap-1.5">
                  Careers Advisor
                  <span className="inline-flex items-center rounded-md bg-emerald-500/20 px-1.5 py-0.5 text-[10px] font-medium text-emerald-300 ring-1 ring-inset ring-emerald-500/30">
                    AI Active
                  </span>
                </h3>
                <p className="text-xs text-sky-300/80 flex items-center gap-1">
                  <ShieldCheck className="h-3 w-3 text-emerald-400" />
                  Sanity Knowledge Base Grounded
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="ca-close-btn relative rounded-full p-1.5 text-slate-400 hover:bg-white/10 hover:text-white cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Error Banner */}
          {errorBanner && (
            <div className="ca-banner flex items-center gap-2 bg-amber-50 px-4 py-2 text-xs font-medium text-amber-800 border-b border-amber-200">
              <AlertCircle className="ca-banner-icon h-4 w-4 shrink-0 text-amber-600" />
              <span className="flex-1">{errorBanner}</span>
            </div>
          )}

          {/* Messages Feed */}
          <div className="ca-scroll flex-1 overflow-y-auto p-4 space-y-4 text-sm">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${msg.role === "user" ? "justify-end ca-msg-row-user" : "justify-start ca-msg-row-assistant"}`}
              >
                {msg.role === "assistant" && (
                  <div className="ca-avatar flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-sky-100 text-sky-900 mt-0.5">
                    <Bot className="h-4 w-4" />
                  </div>
                )}
                <div
                  className={`ca-bubble max-w-[82%] rounded-2xl px-4 py-3 shadow-xs ${msg.role === "user"
                    ? "bg-sky-900 text-white rounded-br-xs"
                    : "bg-slate-100 text-slate-800 rounded-bl-xs border border-slate-200/60"
                    }`}
                >
                  {renderCleanMessage(msg.content, msg.role === "user")}
                  <div className="mt-1 flex items-center justify-between gap-2 text-[10px] opacity-70">
                    <span>{msg.timestamp}</span>
                    {msg.guardrails?.suspiciousAttemptDetected && (
                      <span className="ca-badge-filtered text-amber-500 font-medium">Input filtered</span>
                    )}
                  </div>
                </div>
                {msg.role === "user" && (
                  <div className="ca-avatar flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-slate-200 text-slate-700 mt-0.5">
                    <User className="h-4 w-4" />
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="ca-msg-row-assistant flex gap-2.5 items-center text-slate-500 text-xs pl-1">
                <div className="ca-typing-avatar flex h-7 w-7 items-center justify-center rounded-xl bg-sky-100 text-sky-900">
                  <Bot className="h-4 w-4" />
                </div>
                <div className="flex items-center gap-2 rounded-2xl border border-slate-200/60 bg-slate-100 px-3.5 py-2.5">
                  <span className="flex items-center gap-1">
                    <span className="ca-dot h-1.5 w-1.5 rounded-full bg-sky-700" />
                    <span className="ca-dot h-1.5 w-1.5 rounded-full bg-sky-700" />
                    <span className="ca-dot h-1.5 w-1.5 rounded-full bg-sky-700" />
                  </span>
                  <span>Consulting Sanity recruitment criteria...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Suggestion Pills */}
          {messages.length <= 2 && (
            <div className="border-t border-slate-100 bg-slate-50/80 px-3 py-2">
              <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5 px-1">
                Suggested Questions
              </p>
              <div className="flex flex-wrap gap-1.5">
                {PRESET_QUESTIONS.map((q, i) => (
                  <button
                    key={q}
                    onClick={() => handleSendMessage(q)}
                    style={{ animationDelay: `${i * 60}ms` }}
                    className="ca-pill rounded-full border border-slate-200 bg-white px-2.5 py-1 text-xs text-slate-700 hover:border-sky-300 hover:bg-sky-50 cursor-pointer"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input Box */}
          <div className="border-t border-slate-200/80 bg-white p-3">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              <div className="ca-input-wrap flex-1">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Ask about qualifications, roles, or criteria..."
                  className="ca-input-field w-full rounded-full bg-slate-50 px-4 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none"
                  disabled={isLoading}
                />
              </div>
              <button
                type="submit"
                disabled={isLoading || !inputValue.trim()}
                className="ca-send-btn flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-white disabled:opacity-40 cursor-pointer"
              >
                <Send className="ca-send-icon h-4 w-4" />
              </button>
            </form>
            <div className="mt-1.5 flex items-center justify-between text-[10px] text-slate-400 px-2">
              <span>CBSE Guidelines & Sanity Context</span>
              <span>Zero-Trust Guarded</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}