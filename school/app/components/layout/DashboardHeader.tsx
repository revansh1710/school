'use client'

import { useRouter } from "next/navigation"

export default function DashboardHeader({ parentName }: { parentName?: string }) {

    const router = useRouter();
    const handleLogout = async () => {
        await fetch("/api/auth/logout", {
            method: "POST"
        })
        router.push("/auth/login")
    }

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=Lato:wght@300;400;700&display=swap');

                /* ── Ticker scroll ── */
                @keyframes tickerScroll {
                    0%   { transform: translateX(100%); }
                    100% { transform: translateX(-100%); }
                }
                .ticker-track {
                    animation: tickerScroll 18s linear infinite;
                    white-space: nowrap;
                    display: inline-block;
                }
                .ticker-track:hover { animation-play-state: paused; }

                /* ── Gold shimmer on logo text ── */
                @keyframes goldShimmer {
                    0%   { background-position: -200% center; }
                    100% { background-position:  200% center; }
                }
                .logo-text {
                    font-family: 'Playfair Display', serif;
                    font-weight: 700;
                    font-size: 1.1rem;
                    background: linear-gradient(90deg,
                        #c9a84c 0%, #e8c97a 30%, #fff8e7 50%, #e8c97a 70%, #c9a84c 100%
                    );
                    background-size: 200% auto;
                    -webkit-background-clip: text;
                    background-clip: text;
                    -webkit-text-fill-color: transparent;
                    animation: goldShimmer 4s linear infinite;
                    letter-spacing: 0.04em;
                }

                /* ── Crest pulse ring ── */
                @keyframes crestPulse {
                    0%, 100% { box-shadow: 0 0 0 0 rgba(201,168,76,0.5); }
                    50%       { box-shadow: 0 0 0 6px rgba(201,168,76,0); }
                }
                .crest-orb {
                    animation: crestPulse 2.8s ease-in-out infinite;
                }

                /* ── Header entrance ── */
                @keyframes headerDrop {
                    from { opacity: 0; transform: translateY(-100%); }
                    to   { opacity: 1; transform: translateY(0); }
                }
                .header-root {
                    animation: headerDrop 0.55s cubic-bezier(0.34,1.2,0.64,1) both;
                }

                /* ── Nav link underline sweep ── */
                .nav-link {
                    font-family: 'Lato', sans-serif;
                    font-size: 0.72rem;
                    font-weight: 700;
                    letter-spacing: 0.14em;
                    text-transform: uppercase;
                    color: rgba(244,241,235,0.55);
                    position: relative;
                    padding-bottom: 2px;
                    transition: color 0.25s;
                    cursor: pointer;
                    text-decoration: none;
                    white-space: nowrap;
                }
                .nav-link::after {
                    content: '';
                    position: absolute;
                    bottom: 0; left: 0;
                    width: 0; height: 1.5px;
                    background: linear-gradient(90deg, #c9a84c, #e8c97a);
                    transition: width 0.3s cubic-bezier(0.4,0,0.2,1);
                }
                .nav-link:hover { color: #e8c97a; }
                .nav-link:hover::after { width: 100%; }

                /* ── Avatar ring spin on hover ── */
                .avatar-wrap {
                    position: relative;
                    width: 36px; height: 36px;
                    flex-shrink: 0;
                }
                .avatar-ring {
                    position: absolute;
                    inset: -3px;
                    border-radius: 50%;
                    background: conic-gradient(#c9a84c 0deg, #e8c97a 120deg, transparent 180deg, #c9a84c 360deg);
                    animation: ringRotate 3s linear infinite;
                }
                @keyframes ringRotate { to { transform: rotate(360deg); } }
                .avatar-inner {
                    position: absolute;
                    inset: 2px;
                    border-radius: 50%;
                    background: #162235;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 0.75rem;
                    font-weight: 700;
                    color: #c9a84c;
                    font-family: 'Playfair Display', serif;
                    z-index: 1;
                }

                /* ── Logout button ── */
                .logout-btn {
                    font-family: 'Lato', sans-serif;
                    font-size: 0.68rem;
                    font-weight: 700;
                    letter-spacing: 0.18em;
                    text-transform: uppercase;
                    padding: 7px 16px;
                    border-radius: 8px;
                    border: 1px solid rgba(201,168,76,0.35);
                    background: transparent;
                    color: rgba(244,241,235,0.6);
                    cursor: pointer;
                    position: relative;
                    overflow: hidden;
                    transition: color 0.25s, border-color 0.25s;
                }
                .logout-btn::before {
                    content: '';
                    position: absolute;
                    inset: 0;
                    background: rgba(201,168,76,0.08);
                    transform: translateX(-101%);
                    transition: transform 0.3s cubic-bezier(0.4,0,0.2,1);
                }
                .logout-btn:hover { color: #e8c97a; border-color: #c9a84c; }
                .logout-btn:hover::before { transform: translateX(0); }
                .logout-btn:active { transform: scale(0.97); }

                /* ── Particle floaters ── */
                @keyframes floatUp {
                    0%   { opacity: 0;    transform: translateY(30px) scale(0.6); }
                    20%  { opacity: 0.25; }
                    80%  { opacity: 0.15; }
                    100% { opacity: 0;    transform: translateY(-36px) scale(1); }
                }
                .hdr-particle {
                    position: absolute;
                    pointer-events: none;
                    font-size: 11px;
                    opacity: 0;
                    animation: floatUp 5s ease-in-out infinite;
                }

                /* ── Bottom accent line pulse ── */
                @keyframes accentPulse {
                    0%, 100% { opacity: 0.5; transform: scaleX(0.92); }
                    50%       { opacity: 1;   transform: scaleX(1); }
                }
                .accent-line {
                    animation: accentPulse 3s ease-in-out infinite;
                    transform-origin: center;
                }

                /* ── Greeting fade in ── */
                @keyframes greetFade {
                    from { opacity: 0; transform: translateY(5px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
                .greet-text {
                    animation: greetFade 0.7s 0.4s ease both;
                }

                /* vertical separator */
                .v-sep {
                    width: 1px; height: 24px;
                    background: linear-gradient(180deg, transparent, rgba(201,168,76,0.3), transparent);
                }

                /* ticker wrapper */
                .ticker-overflow {
                    overflow: hidden;
                    flex: 1;
                    max-width: 340px;
                    mask-image: linear-gradient(90deg, transparent 0%, black 12%, black 88%, transparent 100%);
                    -webkit-mask-image: linear-gradient(90deg, transparent 0%, black 12%, black 88%, transparent 100%);
                }
                .ticker-text {
                    font-family: 'Lato', sans-serif;
                    font-size: 0.67rem;
                    font-weight: 300;
                    letter-spacing: 0.1em;
                    color: rgba(244,241,235,0.38);
                    text-transform: uppercase;
                }

                /* ── Responsive ── */
                @media (max-width: 640px) {
                    .ticker-overflow { display: none; }
                    .nav-links-row   { display: none; }
                }
                @media (max-width: 900px) {
                    .nav-links-row { display: none; }
                }
            `}</style>

            <header className="header-root" style={{
                background: "linear-gradient(135deg, #0d1b2a 0%, #162235 60%, #1e304a 100%)",
                position: "sticky",
                top: 0,
                zIndex: 100,
                fontFamily: "'Lato', sans-serif",
            }}>

                {/* Floating school particles */}
                {["📚","✏️","🎓","📐","🔬","⭐"].map((p, i) => (
                    <span key={i} className="hdr-particle" style={{
                        left: `${8 + i * 15}%`,
                        top: "10%",
                        animationDelay: `${i * 0.9}s`,
                        animationDuration: `${4.5 + i * 0.4}s`
                    }}>{p}</span>
                ))}

                {/* Main row */}
                <div style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "0 1.75rem",
                    height: "64px",
                    gap: "1.5rem",
                    position: "relative",
                }}>

                    {/* ── Left: Logo ── */}
                    <a href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "10px", flexShrink: 0 }}>
                        <div className="crest-orb" style={{
                            width: 38, height: 38,
                            borderRadius: "50%",
                            background: "linear-gradient(135deg, #c9a84c, #e8c97a)",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            fontSize: "1.1rem",
                            flexShrink: 0,
                        }}>
                            🎓
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", lineHeight: 1.1 }}>
                            <span className="logo-text">Parent Portal</span>
                        </div>
                    </a>

                    {/* ── Centre: Nav links + ticker ── */}
                    <div style={{ display: "flex", alignItems: "center", gap: "2rem", flex: 1, justifyContent: "center" }}>

                        {/* Scrolling ticker */}
                        <div className="ticker-overflow">
                            <div className="ticker-track ticker-text">
                                ✦ &nbsp; Track your child's admission journey in real-time &nbsp; · &nbsp; Documents reviewed within 3–5 business days &nbsp; · &nbsp; All data is encrypted & secure &nbsp; ✦
                            </div>
                        </div>
                    </div>

                    {/* ── Right: Avatar + name + logout ── */}
                    <div style={{ display: "flex", alignItems: "center", gap: "14px", flexShrink: 0 }}>

                        {/* Avatar */}
                        <div className="avatar-wrap">
                            <div className="avatar-ring" />
                            <div className="avatar-inner">
                                {parentName ? parentName.charAt(0).toUpperCase() : "P"}
                            </div>
                        </div>

                        {/* Greeting */}
                        <div className="greet-text" style={{ display: "flex", flexDirection: "column", lineHeight: 1.2 }}>
                            <span style={{
                                fontSize: "0.6rem",
                                fontWeight: 300,
                                letterSpacing: "0.18em",
                                textTransform: "uppercase",
                                color: "rgba(244,241,235,0.35)",
                            }}>Welcome back</span>
                            <span style={{
                                fontFamily: "'Playfair Display', serif",
                                fontSize: "0.85rem",
                                fontWeight: 600,
                                color: "#e8c97a",
                            }}>
                                {parentName ?? "Parent"}
                            </span>
                        </div>

                        <div className="v-sep" />

                        {/* Logout */}
                        <button onClick={handleLogout} className="logout-btn">
                            Logout
                        </button>
                    </div>
                </div>

                {/* ── Bottom gold accent line ── */}
                <div style={{ height: 2, background: "rgba(13,27,42,0.4)", overflow: "hidden" }}>
                    <div className="accent-line" style={{
                        height: "100%",
                        background: "linear-gradient(90deg, transparent 0%, #c9a84c 25%, #e8c97a 50%, #c9a84c 75%, transparent 100%)",
                    }} />
                </div>
            </header>
        </>
    )
}