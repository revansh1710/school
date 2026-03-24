"use client"

import { useState } from "react";

type props = {
    requiredDocs?: string[] // ✅ made optional
}

export default function DocumentUpload({ requiredDocs = [] }: props) { // ✅ default fallback

    const [files, setFiles] = useState<any>({})
    const [preview, setPreview] = useState<any>({})
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    const handleChange = (e: any, key: string) => {
        const file = e.target.files[0]
        if (!file) return
        if (file.size > 5 * 1024 * 1024) {
            setError("File size should be less than 5MB")
            return
        }
        setFiles({ ...files, [key]: file })
        setPreview({ ...preview, [key]: file.name })
        setError("")
    }

    const handleSubmit = async () => {
        if (!requiredDocs.length) {
            setError("No documents required")
            return
        }

        for (let doc of requiredDocs) {
            if (!files[doc]) {
                setError(`Please upload ${doc}`)
                return
            }
        }

        setLoading(true)

        const formData = new FormData()
        Object.keys(files).forEach(key => {
            formData.append(key, files[key])
        })

        const res = await fetch("/api/admissions/upload-documents", {
            method: "POST",
            body: formData
        })

        setLoading(false)

        if (!res.ok) {
            setError("Upload failed. Try again.")
        } else {
            alert("✅ Documents uploaded successfully")
            window.location.reload()
        }
    }

    const uploadedCount = Object.keys(preview).length
    const totalCount = requiredDocs.length || 1 // ✅ prevent division by 0
    const allDone = requiredDocs.length > 0 && uploadedCount === requiredDocs.length
    console.log(requiredDocs)
    return (
        <>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=Lato:wght@300;400;700&display=swap');

        .doc-upload-root {
          font-family: 'Lato', sans-serif;
        }

        /* ── Floating book particles ── */
        .particles {
          position: absolute;
          inset: 0;
          pointer-events: none;
          overflow: hidden;
          border-radius: inherit;
        }
        .particle {
          position: absolute;
          opacity: 0;
          font-size: 14px;
          animation: floatUp 6s ease-in-out infinite;
        }
        .particle:nth-child(1)  { left: 8%;  animation-delay: 0s;    animation-duration: 7s; }
        .particle:nth-child(2)  { left: 22%; animation-delay: 1.2s;  animation-duration: 5.5s; }
        .particle:nth-child(3)  { left: 45%; animation-delay: 2.4s;  animation-duration: 6.5s; }
        .particle:nth-child(4)  { left: 65%; animation-delay: 0.8s;  animation-duration: 8s; }
        .particle:nth-child(5)  { left: 82%; animation-delay: 3.1s;  animation-duration: 5s; }
        @keyframes floatUp {
          0%   { opacity: 0;   transform: translateY(60px) rotate(-10deg) scale(0.6); }
          20%  { opacity: 0.35; }
          80%  { opacity: 0.2; }
          100% { opacity: 0;   transform: translateY(-80px) rotate(15deg) scale(1); }
        }

        /* ── Header section ── */
        .upload-header {
          background: linear-gradient(135deg, #0d1b2a 0%, #162235 60%, #1e304a 100%);
          border-radius: 16px 16px 0 0;
          padding: 1.75rem 2rem 1.5rem;
          position: relative;
          overflow: hidden;
        }
        .upload-header::before {
          content: '';
          position: absolute;
          bottom: 0; left: 0; right: 0;
          height: 2px;
          background: linear-gradient(90deg, transparent, #c9a84c, #e8c97a, #c9a84c, transparent);
          animation: shimmer 3s ease-in-out infinite;
        }
        @keyframes shimmer {
          0%, 100% { opacity: 0.6; }
          50%       { opacity: 1; }
        }

        .crest-line {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 12px;
        }
        .crest-divider {
          flex: 1;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(201,168,76,0.4), transparent);
        }
        .crest-text {
          font-family: 'Playfair Display', serif;
          font-size: 0.65rem;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          color: #c9a84c;
          white-space: nowrap;
        }

        .header-title {
          font-family: 'Playfair Display', serif;
          font-size: 1.35rem;
          font-weight: 700;
          color: #f4f1eb;
          line-height: 1.2;
        }
        .header-sub {
          font-size: 0.72rem;
          font-weight: 300;
          color: rgba(244,241,235,0.45);
          margin-top: 4px;
          letter-spacing: 0.06em;
        }

        /* ── Progress ring ── */
        .progress-ring-wrap {
          position: absolute;
          top: 1.25rem;
          right: 1.5rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
        }
        .ring-svg { transform: rotate(-90deg); }
        .ring-bg   { fill: none; stroke: rgba(255,255,255,0.08); stroke-width: 4; }
        .ring-fill {
          fill: none;
          stroke: url(#goldGrad);
          stroke-width: 4;
          stroke-linecap: round;
          transition: stroke-dashoffset 0.7s cubic-bezier(0.4,0,0.2,1);
        }
        .ring-label {
          font-size: 0.6rem;
          font-weight: 700;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: rgba(244,241,235,0.4);
          text-align: center;
        }
        .ring-count {
          position: absolute;
          top: 50%; left: 50%;
          transform: translate(-50%, -50%) rotate(90deg);
          font-family: 'Playfair Display', serif;
          font-size: 1rem;
          font-weight: 700;
          color: #c9a84c;
          line-height: 1;
        }

        /* ── Scroll container ── */
        .cards-area {
          background: #f4f1eb;
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        /* ── Document card ── */
        .doc-card {
          background: #fff;
          border-radius: 14px;
          border: 2px solid transparent;
          box-shadow: 0 2px 8px rgba(13,27,42,0.06);
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4,0,0.2,1);
          position: relative;
          overflow: hidden;
          animation: cardReveal 0.5s ease both;
        }
        .doc-card:nth-child(1) { animation-delay: 0.05s; }
        .doc-card:nth-child(2) { animation-delay: 0.15s; }
        .doc-card:nth-child(3) { animation-delay: 0.25s; }

        @keyframes cardReveal {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .doc-card:hover {
          border-color: #c9a84c;
          box-shadow: 0 8px 28px rgba(201,168,76,0.18);
          transform: translateY(-2px);
        }
        .doc-card.uploaded {
          border-color: #34d399;
          background: linear-gradient(135deg, #f0fdf8 0%, #fff 100%);
        }
        .doc-card.uploaded:hover {
          border-color: #10b981;
          box-shadow: 0 8px 28px rgba(52,211,153,0.18);
        }

        /* card top accent stripe */
        .card-stripe {
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 3px;
          background: linear-gradient(90deg, #c9a84c, #e8c97a);
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 0.4s cubic-bezier(0.4,0,0.2,1);
        }
        .doc-card:hover .card-stripe,
        .doc-card.uploaded .card-stripe {
          transform: scaleX(1);
        }
        .doc-card.uploaded .card-stripe {
          background: linear-gradient(90deg, #34d399, #6ee7b7);
        }

        .card-inner {
          padding: 1rem 1.25rem;
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        /* icon orb */
        .doc-icon-orb {
          width: 48px; height: 48px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.4rem;
          background: #f4f1eb;
          border: 1px solid rgba(201,168,76,0.2);
          flex-shrink: 0;
          transition: all 0.3s;
        }
        .doc-card.uploaded .doc-icon-orb {
          background: rgba(52,211,153,0.12);
          border-color: rgba(52,211,153,0.3);
        }
        .doc-card:hover .doc-icon-orb {
          transform: rotate(-6deg) scale(1.08);
        }

        .doc-text { flex: 1; min-width: 0; }
        .doc-label {
          font-family: 'Playfair Display', serif;
          font-size: 0.92rem;
          font-weight: 600;
          color: #0d1b2a;
        }
        .doc-hint {
          font-size: 0.7rem;
          font-weight: 300;
          color: #94a3b8;
          margin-top: 2px;
          letter-spacing: 0.02em;
        }
        .doc-filename {
          font-size: 0.7rem;
          font-weight: 700;
          color: #059669;
          margin-top: 3px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 180px;
          animation: fadeIn 0.3s ease;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateX(-6px); }
          to   { opacity: 1; transform: translateX(0); }
        }

        /* status pill */
        .status-pill {
          font-size: 0.6rem;
          font-weight: 700;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          padding: 4px 10px;
          border-radius: 99px;
          flex-shrink: 0;
          transition: all 0.3s;
        }
        .status-pill.pending  { background: rgba(201,168,76,0.1); color: #92700a; border: 1px solid rgba(201,168,76,0.3); }
        .status-pill.uploaded { background: rgba(52,211,153,0.12); color: #065f46; border: 1px solid rgba(52,211,153,0.4); }

        /* check mark animation */
        .check-circle {
          width: 28px; height: 28px;
          border-radius: 50%;
          background: #10b981;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
          font-size: 0.8rem;
          flex-shrink: 0;
          animation: popIn 0.4s cubic-bezier(0.34,1.56,0.64,1) both;
        }
        @keyframes popIn {
          from { opacity: 0; transform: scale(0.4); }
          to   { opacity: 1; transform: scale(1); }
        }

        /* ── Footer area ── */
        .upload-footer {
          background: #f4f1eb;
          padding: 0 1.5rem 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 0.875rem;
        }

        /* error */
        .error-bar {
          display: flex;
          align-items: center;
          gap: 8px;
          background: #fff1f2;
          border: 1px solid #fca5a5;
          border-radius: 10px;
          padding: 0.75rem 1rem;
          color: #dc2626;
          font-size: 0.8rem;
          font-weight: 500;
          animation: shake 0.4s ease;
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20%       { transform: translateX(-5px); }
          40%       { transform: translateX(5px); }
          60%       { transform: translateX(-3px); }
          80%       { transform: translateX(3px); }
        }

        /* submit button */
        .submit-btn {
          width: 100%;
          border: none;
          outline: none;
          border-radius: 12px;
          padding: 14px;
          font-family: 'Lato', sans-serif;
          font-size: 0.8rem;
          font-weight: 700;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          cursor: pointer;
          position: relative;
          overflow: hidden;
          transition: all 0.3s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }
        .submit-btn.ready {
          background: linear-gradient(135deg, #0d1b2a, #162235);
          color: #c9a84c;
          box-shadow: 0 4px 20px rgba(13,27,42,0.3);
        }
        .submit-btn.ready:hover {
          background: linear-gradient(135deg, #162235, #1e304a);
          box-shadow: 0 8px 32px rgba(13,27,42,0.4);
          transform: translateY(-1px);
        }
        .submit-btn.ready:active { transform: scale(0.98); }
        .submit-btn.disabled {
          background: #e2e8f0;
          color: #94a3b8;
          cursor: not-allowed;
        }

        /* ripple sweep on button */
        .submit-btn.ready::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(90deg, transparent, rgba(201,168,76,0.08), transparent);
          transform: translateX(-100%);
          animation: btnSweep 2.5s ease-in-out infinite;
        }
        @keyframes btnSweep {
          0%   { transform: translateX(-100%); }
          50%, 100% { transform: translateX(100%); }
        }

        .spinner {
          width: 16px; height: 16px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: #fff;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        .trust-note {
          text-align: center;
          font-size: 0.62rem;
          font-weight: 300;
          color: #94a3b8;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
        }
        .trust-note::before,
        .trust-note::after {
          content: '';
          width: 24px; height: 1px;
          background: linear-gradient(90deg, transparent, #cbd5e1);
        }
        .trust-note::after {
          background: linear-gradient(90deg, #cbd5e1, transparent);
        }

        /* ── All done celebration ── */
        .all-done-banner {
          background: linear-gradient(135deg, #0d1b2a, #162235);
          border-radius: 12px;
          padding: 1rem 1.25rem;
          display: flex;
          align-items: center;
          gap: 12px;
          border: 1px solid rgba(201,168,76,0.3);
          animation: fadeIn 0.5s ease;
        }
        .star-burst {
          font-size: 1.5rem;
          animation: starSpin 3s ease-in-out infinite;
        }
        @keyframes starSpin {
          0%, 100% { transform: rotate(0deg) scale(1); }
          50%       { transform: rotate(15deg) scale(1.15); }
        }
        .all-done-text { display: flex; flex-direction: column; gap: 2px; }
        .all-done-title {
          font-family: 'Playfair Display', serif;
          font-size: 0.88rem;
          font-weight: 600;
          color: #f4f1eb;
        }
        .all-done-sub {
          font-size: 0.68rem;
          font-weight: 300;
          color: rgba(201,168,76,0.7);
          letter-spacing: 0.05em;
        }

        /* ── Outer wrapper ── */
        .upload-shell {
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 12px 48px rgba(13,27,42,0.14);
          border: 1px solid rgba(201,168,76,0.15);
        }
      `}</style>

            <div className="doc-upload-root upload-shell">

                {/* ── Animated Header ── */}
                <div className="upload-header">

                    {/* floating school icons */}
                    <div className="particles">
                        {["📚", "✏️", "🎓", "📐", "🔬"].map((p, i) => (
                            <span key={i} className="particle">{p}</span>
                        ))}
                    </div>

                    {/* SVG gradient def */}
                    <svg width="0" height="0" style={{ position: "absolute" }}>
                        <defs>
                            <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="#c9a84c" />
                                <stop offset="100%" stopColor="#e8c97a" />
                            </linearGradient>
                        </defs>
                    </svg>

                    {/* crest ornament line */}
                    <div className="crest-line">
                        <div className="crest-divider" />
                        <span className="crest-text">✦ Document Submission ✦</span>
                        <div className="crest-divider" />
                    </div>

                    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
                        <div>
                            <div className="header-title">Upload Your Documents</div>
                            <div className="header-sub">
                                Secure · Encrypted · Reviewed within 3 – 5 business days
                            </div>
                        </div>

                        {/* Progress ring */}
                        <div className="progress-ring-wrap">
                            <div style={{ position: "relative", width: 56, height: 56 }}>
                                <svg className="ring-svg" width="56" height="56" viewBox="0 0 56 56">
                                    <circle className="ring-bg" cx="28" cy="28" r="22" />
                                    <circle
                                        className="ring-fill"
                                        cx="28" cy="28" r="22"
                                        strokeDasharray={`${2 * Math.PI * 22}`}
                                        strokeDashoffset={`${2 * Math.PI * 22 * (1 - uploadedCount / totalCount)}`}
                                    />
                                </svg>
                                <div className="ring-count">{uploadedCount}/{totalCount}</div>
                            </div>
                            <div className="ring-label">Done</div>
                        </div>
                    </div>
                </div>

                {/* ── Cards area ── */}
                <div className="cards-area">
                    {requiredDocs?.map((doc) => {
                        const isUploaded = !!preview[doc]
                        return (
                            <label key={doc} htmlFor={`file-${doc}`} className={`doc-card ${isUploaded ? "uploaded" : ""}`}>
                                <div className="card-stripe" />
                                <div className="card-inner">
                                    <div className="doc-text">
                                        {isUploaded ? (
                                            <div className="doc-filename">📎 {preview[doc]}</div>
                                        ) : (
                                            <div className="doc-hint">{doc}</div>
                                        )}
                                    </div>  

                                    {isUploaded
                                        ? <div className="check-circle">✓</div>
                                        : <div className={`status-pill pending`}>Required</div>
                                    }
                                </div>

                                <input
                                    id={`file-${doc}`}
                                    type="file"
                                    onChange={(e) => handleChange(e, doc)}
                                    className="sr-only"
                                />
                            </label>
                        )
                    })}
                </div>

                {/* ── Footer ── */}
                <div className="upload-footer">

                    {/* All done banner */}
                    {allDone && (
                        <div className="all-done-banner">
                            <span className="star-burst">🎓</span>
                            <div className="all-done-text">
                                <span className="all-done-title">All documents ready!</span>
                                <span className="all-done-sub">Click submit to complete your application.</span>
                            </div>
                        </div>
                    )}

                    {/* Error */}
                    {error && (
                        <div className="error-bar">
                            <span>⚠️</span>
                            <span>{error}</span>
                        </div>
                    )}

                    {/* Submit */}
                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className={`submit-btn ${loading || !allDone ? "disabled" : "ready"}`}
                    >
                        {loading ? (
                            <>
                                <div className="spinner" />
                                <span>Uploading…</span>
                            </>
                        ) : (
                            <>
                                <span>Submit Documents</span>
                                <span style={{ fontSize: "1rem" }}>→</span>
                            </>
                        )}
                    </button>
                </div>
            </div>
        </>
    )
}