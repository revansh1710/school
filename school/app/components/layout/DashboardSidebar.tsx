'use client'

import Link from "next/link"
import { usePathname } from "next/navigation"

// Pre-computed to avoid floating-point SSR/client hydration mismatch
const MANDALA_OUTER = [0,30,60,90,120,150,180,210,240,270,300,330].map(d => {
  const rad = d * Math.PI / 180
  const cx = parseFloat((Math.cos(rad) * 40).toFixed(4))
  const cy = parseFloat((Math.sin(rad) * 40).toFixed(4))
  return { cx, cy, transform: `rotate(${d} ${cx} ${cy})` }
})

const MANDALA_INNER = [0,45,90,135,180,225,270,315].map(d => {
  const rad = d * Math.PI / 180
  const cx = parseFloat((Math.cos(rad) * 22).toFixed(4))
  const cy = parseFloat((Math.sin(rad) * 22).toFixed(4))
  return { cx, cy, transform: `rotate(${d} ${cx} ${cy})` }
})

const navItems = [
  { name: "Documents", href: "/dashboard/documents", icon: "📄", sanskrit: "दस्तावेज़" },
  { name: "Admission Status", href: "/dashboard", icon: "📊", sanskrit: "प्रवेश" },
]

export default function DashboardSidebar() {

  const pathname = usePathname()

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Tiro+Devanagari+Sanskrit:ital@0;1&family=Cinzel:wght@400;600;700&family=Lato:wght@300;400;700&display=swap');

        /* ══════════════════════════════════════════
           SIDEBAR SHELL
        ══════════════════════════════════════════ */
        .takshashila-sidebar {
          width: 240px;
          min-width: 240px;
          min-height: 100vh;
          background: #1a0e05;
          display: flex;
          flex-direction: column;
          position: relative;
          overflow: hidden;
          border-right: 2px solid #8b5a1a;
          flex-shrink: 0;
        }

        /* Stone-wall texture overlay */
        .takshashila-sidebar::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image:
            repeating-linear-gradient(0deg,   transparent, transparent 28px, rgba(139,90,26,0.06) 28px, rgba(139,90,26,0.06) 29px),
            repeating-linear-gradient(90deg,  transparent, transparent 28px, rgba(139,90,26,0.04) 28px, rgba(139,90,26,0.04) 29px);
          pointer-events: none;
          z-index: 0;
        }

        /* Warm amber ambient glow from below */
        .takshashila-sidebar::after {
          content: '';
          position: absolute;
          bottom: -60px; left: 50%;
          transform: translateX(-50%);
          width: 180px; height: 180px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(200,120,20,0.18) 0%, transparent 70%);
          pointer-events: none;
          z-index: 0;
          animation: amberGlow 4s ease-in-out infinite;
        }
        @keyframes amberGlow {
          0%, 100% { opacity: 0.6; transform: translateX(-50%) scale(1); }
          50%       { opacity: 1;   transform: translateX(-50%) scale(1.15); }
        }

        /* ══════════════════════════════════════════
           TEMPLE SHIKHARA (top ornament)
        ══════════════════════════════════════════ */
        .shikhara-top {
          position: relative;
          z-index: 2;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding-top: 1.5rem;
          padding-bottom: 0;
        }

        /* Kalash (pot finial) */
        .kalash {
          position: relative;
          width: 36px; height: 36px;
          display: flex; align-items: center; justify-content: center;
          font-size: 1.5rem;
          animation: kalashSway 5s ease-in-out infinite;
          filter: drop-shadow(0 0 10px rgba(255,160,40,0.6));
        }
        @keyframes kalashSway {
          0%, 100% { transform: rotate(-3deg); }
          50%       { transform: rotate(3deg); }
        }

        /* SVG temple arch below kalash */
        .temple-arch-svg {
          width: 100%;
          max-width: 240px;
          overflow: visible;
        }

        /* Animated diya flame inside arch */
        @keyframes flameFlicker {
          0%, 100% { transform: scaleY(1)   rotate(-2deg); opacity: 0.9; }
          33%       { transform: scaleY(1.15) rotate(2deg);  opacity: 1; }
          66%       { transform: scaleY(0.9) rotate(-1deg); opacity: 0.85; }
        }
        .diya-flame {
          transform-origin: center bottom;
          animation: flameFlicker 1.8s ease-in-out infinite;
        }

        /* ── Rangoli mandala spinner ── */
        @keyframes mandalaRotate {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes mandalaRotateReverse {
          from { transform: rotate(0deg); }
          to   { transform: rotate(-360deg); }
        }
        .mandala-outer { animation: mandalaRotate 22s linear infinite; }
        .mandala-inner { animation: mandalaRotateReverse 14s linear infinite; }

        /* ══════════════════════════════════════════
           PORTAL TITLE BLOCK
        ══════════════════════════════════════════ */
        .portal-title-block {
          position: relative;
          z-index: 2;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 0.6rem 1.25rem 0;
          text-align: center;
        }

        /* Sanskrit title */
        .sanskrit-title {
          font-family: 'Tiro Devanagari Sanskrit', serif;
          font-size: 1.05rem;
          color: #e8c97a;
          letter-spacing: 0.06em;
          line-height: 1.2;
          text-shadow: 0 0 18px rgba(232,201,122,0.5);
          animation: textGlow 3s ease-in-out infinite;
        }
        @keyframes textGlow {
          0%, 100% { text-shadow: 0 0 10px rgba(232,201,122,0.4); }
          50%       { text-shadow: 0 0 22px rgba(232,201,122,0.8); }
        }

        /* English subtitle */
        .portal-subtitle {
          font-family: 'Cinzel', serif;
          font-size: 0.55rem;
          letter-spacing: 0.28em;
          text-transform: uppercase;
          color: rgba(232,201,122,0.45);
          margin-top: 3px;
        }

        /* Divider with lotuses */
        .lotus-divider {
          display: flex;
          align-items: center;
          gap: 6px;
          width: 100%;
          margin: 0.85rem 0 0;
          padding: 0 1rem;
        }
        .lotus-line {
          flex: 1;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(139,90,26,0.8), transparent);
        }
        .lotus-icon {
          font-size: 0.75rem;
          opacity: 0.65;
          animation: lotusRotate 8s ease-in-out infinite;
        }
        @keyframes lotusRotate {
          0%, 100% { transform: scale(1); }
          50%       { transform: scale(1.2); }
        }

        /* ══════════════════════════════════════════
           NAV ITEMS
        ══════════════════════════════════════════ */
        .nav-area {
          position: relative;
          z-index: 2;
          display: flex;
          flex-direction: column;
          gap: 6px;
          padding: 0.6rem 0.85rem 1.5rem;
          flex: 1;
        }

        .nav-section-label {
          font-family: 'Cinzel', serif;
          font-size: 0.52rem;
          letter-spacing: 0.25em;
          text-transform: uppercase;
          color: rgba(139,90,26,0.7);
          padding: 0 6px;
          margin-bottom: 2px;
        }

        .nav-item {
          position: relative;
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 12px;
          border-radius: 4px;
          text-decoration: none;
          overflow: hidden;
          border: 1px solid transparent;
          transition: border-color 0.3s, background 0.3s;
          cursor: pointer;
        }

        /* Inactive */
        .nav-item.inactive {
          background: transparent;
          border-color: rgba(139,90,26,0.12);
        }
        .nav-item.inactive:hover {
          background: rgba(139,90,26,0.12);
          border-color: rgba(200,140,40,0.35);
        }

        /* Active — carved stone look */
        .nav-item.active {
          background: linear-gradient(135deg, rgba(139,90,26,0.35) 0%, rgba(80,40,10,0.5) 100%);
          border-color: rgba(200,140,40,0.55);
          box-shadow: inset 0 1px 0 rgba(232,201,122,0.15), 0 2px 12px rgba(0,0,0,0.4);
        }

        /* Left pillar accent line */
        .nav-item::before {
          content: '';
          position: absolute;
          left: 0; top: 15%; bottom: 15%;
          width: 2px;
          background: linear-gradient(180deg, transparent, #c9a84c, transparent);
          transform: scaleY(0);
          transform-origin: center;
          transition: transform 0.35s cubic-bezier(0.4,0,0.2,1);
          border-radius: 1px;
        }
        .nav-item.active::before,
        .nav-item:hover::before { transform: scaleY(1); }

        /* Sweep fill on hover */
        .nav-item::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(90deg, rgba(200,140,40,0.07), transparent);
          transform: translateX(-101%);
          transition: transform 0.4s cubic-bezier(0.4,0,0.2,1);
        }
        .nav-item:hover::after { transform: translateX(0); }
        .nav-item.active::after { transform: translateX(0); background: transparent; }

        /* Icon orb */
        .nav-icon-orb {
          width: 32px; height: 32px;
          border-radius: 6px;
          display: flex; align-items: center; justify-content: center;
          font-size: 1rem;
          flex-shrink: 0;
          background: rgba(139,90,26,0.18);
          border: 1px solid rgba(139,90,26,0.3);
          transition: all 0.3s;
          position: relative; z-index: 1;
        }
        .nav-item.active .nav-icon-orb {
          background: rgba(200,140,40,0.22);
          border-color: rgba(200,140,40,0.5);
          box-shadow: 0 0 10px rgba(200,140,40,0.2);
        }
        .nav-item:hover .nav-icon-orb { transform: rotate(-6deg) scale(1.1); }

        /* Text labels */
        .nav-label-wrap {
          display: flex;
          flex-direction: column;
          gap: 1px;
          position: relative; z-index: 1;
        }
        .nav-en {
          font-family: 'Cinzel', serif;
          font-size: 0.72rem;
          font-weight: 600;
          letter-spacing: 0.06em;
          transition: color 0.25s;
        }
        .nav-item.active .nav-en    { color: #e8c97a; }
        .nav-item.inactive .nav-en  { color: rgba(232,201,122,0.55); }
        .nav-item:hover .nav-en     { color: #e8c97a; }

        .nav-sa {
          font-family: 'Tiro Devanagari Sanskrit', serif;
          font-size: 0.6rem;
          color: rgba(139,90,26,0.7);
          transition: color 0.25s;
        }
        .nav-item.active .nav-sa { color: rgba(200,140,40,0.8); }
        .nav-item:hover  .nav-sa { color: rgba(200,140,40,0.7); }

        /* Active dot */
        .active-dot {
          margin-left: auto;
          width: 6px; height: 6px;
          border-radius: 50%;
          background: #c9a84c;
          box-shadow: 0 0 6px #c9a84c;
          position: relative; z-index: 1;
          animation: dotPulse 2s ease-in-out infinite;
        }
        @keyframes dotPulse {
          0%, 100% { box-shadow: 0 0 4px #c9a84c; }
          50%       { box-shadow: 0 0 12px #c9a84c; }
        }

        /* ══════════════════════════════════════════
           BOTTOM FOOTER INSCRIPTION
        ══════════════════════════════════════════ */
        .sidebar-footer {
          position: relative; z-index: 2;
          border-top: 1px solid rgba(139,90,26,0.3);
          padding: 1rem 1.25rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
        }

        /* Slow mandala watermark */
        .mandala-watermark {
          position: absolute;
          bottom: 0; right: -40px;
          width: 120px; height: 120px;
          opacity: 0.04;
          pointer-events: none;
          z-index: 0;
        }

        .footer-sanskrit {
          font-family: 'Tiro Devanagari Sanskrit', serif;
          font-size: 0.75rem;
          color: rgba(200,140,40,0.45);
          text-align: center;
          letter-spacing: 0.04em;
        }
        .footer-tagline {
          font-family: 'Cinzel', serif;
          font-size: 0.48rem;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: rgba(139,90,26,0.45);
          text-align: center;
        }
        .footer-divider {
          width: 40px; height: 1px;
          background: linear-gradient(90deg, transparent, rgba(139,90,26,0.6), transparent);
        }

        /* ══════════════════════════════════════════
           RESPONSIVE — collapse to icon-only rail
        ══════════════════════════════════════════ */
        @media (max-width: 768px) {
          .takshashila-sidebar {
            width: 68px;
            min-width: 68px;
          }
          .shikhara-top { padding-top: 1rem; }
          .temple-arch-svg { display: none; }
          .portal-title-block { display: none; }
          .nav-label-wrap { display: none; }
          .nav-section-label { display: none; }
          .lotus-divider { padding: 0 0.5rem; }
          .nav-area { padding: 0.5rem 0.5rem 1rem; gap: 4px; }
          .nav-item { justify-content: center; padding: 10px 8px; }
          .nav-icon-orb { width: 38px; height: 38px; font-size: 1.1rem; }
          .active-dot { display: none; }
          .sidebar-footer { display: none; }
          .kalash { font-size: 1.2rem; }
        }
      `}</style>

      <aside className="takshashila-sidebar">

        {/* ── Temple Shikhara Top ── */}
        <div className="shikhara-top">

          {/* Kalash finial */}
          <div className="kalash">🪔</div>

          {/* Temple arch SVG */}
          <svg className="temple-arch-svg" viewBox="0 0 240 90" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Arch outline */}
            <path d="M20 88 L20 45 Q20 10 120 10 Q220 10 220 45 L220 88"
              stroke="rgba(139,90,26,0.7)" strokeWidth="1.5" fill="none" />
            {/* Inner arch */}
            <path d="M34 88 L34 50 Q34 24 120 24 Q206 24 206 50 L206 88"
              stroke="rgba(200,140,40,0.35)" strokeWidth="1" fill="none" strokeDasharray="4 3" />

            {/* Turrets left */}
            <rect x="6"  y="56" width="14" height="32" rx="1" fill="rgba(139,90,26,0.25)" stroke="rgba(139,90,26,0.5)" strokeWidth="0.8" />
            <path d="M6 56 Q13 46 20 56" fill="rgba(200,140,40,0.3)" />
            {/* Turrets right */}
            <rect x="220" y="56" width="14" height="32" rx="1" fill="rgba(139,90,26,0.25)" stroke="rgba(139,90,26,0.5)" strokeWidth="0.8" />
            <path d="M220 56 Q227 46 234 56" fill="rgba(200,140,40,0.3)" />

            {/* Horizontal jali bands */}
            <line x1="20" y1="68" x2="220" y2="68" stroke="rgba(139,90,26,0.2)" strokeWidth="0.8" />
            <line x1="20" y1="78" x2="220" y2="78" stroke="rgba(139,90,26,0.2)" strokeWidth="0.8" />

            {/* Lotus medallion centre */}
            <g transform="translate(120,48)">
              <circle cx="0" cy="0" r="9" fill="rgba(80,40,10,0.8)" stroke="rgba(200,140,40,0.6)" strokeWidth="1" />
              {[0,45,90,135,180,225,270,315].map((deg, i) => (
                <ellipse
                  key={i}
                  cx={Math.cos(deg * Math.PI / 180) * 6}
                  cy={Math.sin(deg * Math.PI / 180) * 6}
                  rx="3" ry="1.5"
                  transform={`rotate(${deg} ${Math.cos(deg * Math.PI / 180) * 6} ${Math.sin(deg * Math.PI / 180) * 6})`}
                  fill="rgba(200,140,40,0.5)"
                />
              ))}
              <circle cx="0" cy="0" r="3" fill="rgba(200,140,40,0.7)" />
            </g>

            {/* Diya flame */}
            <g transform="translate(120,30)">
              <ellipse cx="0" cy="4" rx="4" ry="2" fill="rgba(139,90,26,0.5)" />
              <ellipse className="diya-flame" cx="0" cy="0" rx="2.5" ry="5"
                fill="url(#flameGrad)" />
              <defs>
                <radialGradient id="flameGrad" cx="50%" cy="80%" r="50%">
                  <stop offset="0%"   stopColor="#fff5c0" />
                  <stop offset="50%"  stopColor="#f97316" />
                  <stop offset="100%" stopColor="rgba(249,115,22,0)" />
                </radialGradient>
              </defs>
            </g>

            {/* Corner ornament dots */}
            {[30, 60, 90, 150, 180, 210].map((x, i) => (
              <circle key={i} cx={x} cy="88" r="1.5" fill="rgba(139,90,26,0.4)" />
            ))}
          </svg>
        </div>

        {/* ── Title block ── */}
        <div className="portal-title-block">
          <div className="lotus-divider">
            <div className="lotus-line" />
            <span className="lotus-icon">🪷</span>
            <div className="lotus-line" />
          </div>
        </div>

        {/* ── Nav items ── */}
        <nav className="nav-area">
          <span className="nav-section-label">— Pathways —</span>

          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`nav-item ${isActive ? "active" : "inactive"}`}
              >
                <div className="nav-icon-orb">{item.icon}</div>
                <div className="nav-label-wrap">
                  <span className="nav-en">{item.name}</span>
                  <span className="nav-sa">{item.sanskrit}</span>
                </div>
                {isActive && <div className="active-dot" />}
              </Link>
            )
          })}
        </nav>

        {/* ── Mandala watermark ── */}
        <svg className="mandala-watermark" viewBox="0 0 120 120">
          <g className="mandala-outer" transform="translate(60,60)">
            {MANDALA_OUTER.map((p, i) => (
              <ellipse key={i} cx={p.cx} cy={p.cy} rx="8" ry="3"
                transform={p.transform} fill="#c9a84c" />
            ))}
          </g>
          <g className="mandala-inner" transform="translate(60,60)">
            {MANDALA_INNER.map((p, i) => (
              <ellipse key={i} cx={p.cx} cy={p.cy} rx="5" ry="2"
                transform={p.transform} fill="#c9a84c" />
            ))}
          </g>
          <circle cx="60" cy="60" r="6" fill="#c9a84c" />
        </svg>

        {/* ── Footer inscription ── */}
        <div className="sidebar-footer">
          <div className="footer-divider" />
          <span className="footer-sanskrit">सा विद्या या विमुक्तये</span>
          <span className="footer-tagline">Knowledge is that which liberates</span>
        </div>

      </aside>
    </>
  )
}