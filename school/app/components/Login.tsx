'use client'
import { useState } from "react"
export default function LoginComponent() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [isError, setIsError] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage("")

    const res = await fetch("/api/auth/request-login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    })

    const data = await res.json()
    setLoading(false)

    if (data.error) {
      setIsError(true)
      setMessage(data.error)
    } else {
      setIsError(false)
      setMessage("Check your email for the login link")
    }
  }
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&family=Fredoka+One&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .login-root {
          min-height: 100vh;
          background-color: #FFF8F0;
          background-image:
            radial-gradient(circle at 15% 85%, #FFE0B2 0px, transparent 320px),
            radial-gradient(circle at 85% 10%, #E8F5E9 0px, transparent 280px),
            radial-gradient(circle at 50% 50%, #EDE7F6 0px, transparent 400px);
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Nunito', sans-serif;
          position: relative;
          overflow: hidden;
          padding: 2rem;
        }

        /* Decorative ruled lines (like notebook paper) */
        .login-root::before {
          content: '';
          position: fixed;
          inset: 0;
          background-image: repeating-linear-gradient(
            transparent,
            transparent 39px,
            #E8D9C8 39px,
            #E8D9C8 40px
          );
          opacity: 0.25;
          pointer-events: none;
        }

        /* Floating shape decorations */
        .shape {
          position: fixed;
          border-radius: 50%;
          pointer-events: none;
          z-index: 0;
        }
        .shape-1 {
          width: 120px; height: 120px;
          background: #FFCC80;
          top: 8%; left: 6%;
          border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%;
          opacity: 0.5;
          animation: float1 7s ease-in-out infinite;
        }
        .shape-2 {
          width: 80px; height: 80px;
          background: #A5D6A7;
          bottom: 12%; right: 8%;
          border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%;
          opacity: 0.5;
          animation: float2 9s ease-in-out infinite;
        }
        .shape-3 {
          width: 60px; height: 60px;
          background: #CE93D8;
          top: 20%; right: 12%;
          border-radius: 50%;
          opacity: 0.4;
          animation: float1 6s ease-in-out infinite reverse;
        }
        .shape-4 {
          width: 45px; height: 45px;
          background: #80DEEA;
          bottom: 25%; left: 10%;
          border-radius: 40% 60% 60% 40% / 40% 40% 60% 60%;
          opacity: 0.45;
          animation: float2 8s ease-in-out infinite;
        }
        .shape-star {
          position: fixed;
          pointer-events: none;
          z-index: 0;
          opacity: 0.3;
          font-size: 36px;
          animation: spin 12s linear infinite;
        }
        .star-1 { top: 15%; left: 20%; animation-duration: 14s; font-size: 28px; }
        .star-2 { bottom: 20%; right: 20%; animation-duration: 10s; }
        .star-3 { top: 70%; left: 30%; font-size: 20px; animation-duration: 16s; }

        @keyframes float1 {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          33% { transform: translate(12px, -18px) rotate(8deg); }
          66% { transform: translate(-8px, 10px) rotate(-5deg); }
        }
        @keyframes float2 {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          50% { transform: translate(-14px, -12px) rotate(-10deg); }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes shimmer {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        @keyframes pulse-ring {
          0% { box-shadow: 0 0 0 0 rgba(255, 167, 38, 0.4); }
          70% { box-shadow: 0 0 0 10px rgba(255, 167, 38, 0); }
          100% { box-shadow: 0 0 0 0 rgba(255, 167, 38, 0); }
        }

        /* Card */
        .login-card {
          position: relative;
          z-index: 1;
          background: #FFFFFF;
          border-radius: 28px;
          padding: 3rem 2.75rem 2.5rem;
          width: 100%;
          max-width: 440px;
          border: 2.5px solid #E8D5C0;
          box-shadow:
            8px 8px 0px 0px #E8C9A0,
            0 20px 60px rgba(0,0,0,0.08);
          animation: fadeSlideUp 0.6s ease both;
        }

        /* Top badge */
        .school-badge {
          position: absolute;
          top: -22px;
          left: 50%;
          transform: translateX(-50%);
          background: linear-gradient(135deg, #FFA726, #FF7043);
          background-size: 200% 200%;
          animation: shimmer 3s ease infinite;
          color: white;
          font-family: 'Fredoka One', cursive;
          font-size: 13px;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          padding: 6px 20px;
          border-radius: 20px;
          white-space: nowrap;
          box-shadow: 0 4px 12px rgba(255, 112, 67, 0.35);
        }

        /* Pencil icon area */
        .icon-wrap {
          width: 72px;
          height: 72px;
          background: linear-gradient(135deg, #FFF3E0, #FFE0B2);
          border-radius: 22px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 1.5rem;
          font-size: 36px;
          border: 2px solid #FFCC80;
          box-shadow: 3px 3px 0 #FFB74D;
          animation: pulse-ring 3s ease-in-out infinite;
        }

        .login-title {
          font-family: 'Fredoka One', cursive;
          font-size: 2rem;
          color: #4A3728;
          text-align: center;
          margin-bottom: 0.35rem;
          line-height: 1.1;
        }

        .login-subtitle {
          font-size: 14px;
          color: #8B7355;
          text-align: center;
          margin-bottom: 2rem;
          font-weight: 600;
        }

        .field-label {
          display: block;
          font-size: 13px;
          font-weight: 800;
          color: #6D4C41;
          text-transform: uppercase;
          letter-spacing: 0.8px;
          margin-bottom: 8px;
        }

        .email-input {
          width: 100%;
          padding: 14px 16px;
          border-radius: 14px;
          border: 2px solid #E0CDB8;
          background: #FFFAF5;
          font-family: 'Nunito', sans-serif;
          font-size: 15px;
          font-weight: 600;
          color: #3E2723;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
          box-shadow: inset 0 2px 4px rgba(0,0,0,0.04);
        }
        .email-input::placeholder { color: #C4A882; font-weight: 500; }
        .email-input:focus {
          border-color: #FFA726;
          background: #FFFFFF;
          box-shadow: 0 0 0 4px rgba(255, 167, 38, 0.15), inset 0 2px 4px rgba(0,0,0,0.03);
        }

        .submit-btn {
          width: 100%;
          margin-top: 1.25rem;
          padding: 15px;
          border-radius: 14px;
          border: none;
          background: linear-gradient(135deg, #FFA726 0%, #FF7043 100%);
          color: white;
          font-family: 'Fredoka One', cursive;
          font-size: 1.1rem;
          letter-spacing: 0.5px;
          cursor: pointer;
          transition: transform 0.15s, box-shadow 0.15s, opacity 0.2s;
          box-shadow: 0 4px 0 #E64A19, 0 8px 20px rgba(255, 112, 67, 0.3);
          position: relative;
          overflow: hidden;
        }
        .submit-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 6px 0 #E64A19, 0 12px 24px rgba(255, 112, 67, 0.35);
        }
        .submit-btn:active:not(:disabled) {
          transform: translateY(2px);
          box-shadow: 0 2px 0 #E64A19, 0 4px 12px rgba(255, 112, 67, 0.2);
        }
        .submit-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }
        .submit-btn::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.15), transparent);
          border-radius: inherit;
        }

        /* Loading dots */
        .loading-dots {
          display: inline-flex;
          gap: 4px;
          align-items: center;
        }
        .loading-dots span {
          width: 6px; height: 6px;
          background: white;
          border-radius: 50%;
          animation: dotBounce 1.2s ease-in-out infinite;
        }
        .loading-dots span:nth-child(2) { animation-delay: 0.15s; }
        .loading-dots span:nth-child(3) { animation-delay: 0.3s; }
        @keyframes dotBounce {
          0%, 80%, 100% { transform: scale(0.8); opacity: 0.6; }
          40% { transform: scale(1.2); opacity: 1; }
        }

        /* Message */
        .feedback-msg {
          margin-top: 1rem;
          padding: 12px 16px;
          border-radius: 12px;
          font-size: 14px;
          font-weight: 700;
          text-align: center;
          animation: fadeSlideUp 0.4s ease both;
        }
        .feedback-msg.success {
          background: #E8F5E9;
          color: #2E7D32;
          border: 1.5px solid #A5D6A7;
        }
        .feedback-msg.error {
          background: #FFF3E0;
          color: #E65100;
          border: 1.5px solid #FFCC80;
        }

        /* Footer */
        .login-footer {
          margin-top: 1.75rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          font-size: 12px;
          color: #B09880;
          font-weight: 600;
        }
        .login-footer::before,
        .login-footer::after {
          content: '';
          flex: 1;
          height: 1.5px;
          background: #EDE0D0;
          border-radius: 2px;
        }

        /* Doodle corner */
        .doodle-corner {
          position: absolute;
          bottom: 16px;
          right: 20px;
          font-size: 11px;
          color: #C4A882;
          font-weight: 700;
          transform: rotate(-8deg);
          letter-spacing: 0.5px;
        }
      `}</style>

      <div className="login-root">
        {/* Background shapes */}
        <div className="shape shape-1" />
        <div className="shape shape-2" />
        <div className="shape shape-3" />
        <div className="shape shape-4" />
        <div className="shape-star star-1">✦</div>
        <div className="shape-star star-2">✦</div>
        <div className="shape-star star-3">✧</div>

        <div className="login-card">
          <div className="school-badge">✏️ Parent Portal</div>

          <div className="icon-wrap">📬</div>

          <h1 className="login-title">Welcome Back!</h1>
          <p className="login-subtitle">We'll send a Login link straight to your inbox</p>

          <div>
            <label htmlFor="email" className="field-label">Your Email</label>
            <input
              id="email"
              type="email"
              className="email-input"
              placeholder="parent@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <button
            className="submit-btn"
            disabled={loading}
            onClick={handleSubmit}
          >
            {loading ? (
              <span className="loading-dots">
                <span /><span /><span />
              </span>
            ) : (
              "Send Login Link ✉️"
            )}
          </button>

          {message && (
            <div className={`feedback-msg ${isError ? "error" : "success"}`}>
              {isError ? "⚠️ " : "🎉 "}{message}
            </div>
          )}
        </div>
      </div>
    </>
  )
}