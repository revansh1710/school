'use client'
import { useEffect, useRef } from "react";
import { PortableTextBlock } from "@portabletext/types";
import { PortableText } from "@portabletext/react"
export interface AdmissionsPage {
  hero: HeroSection;
  overview: OverviewSection;
  eligibility: EligibilityItem[];
  process: ProcessStep[];
  documents: DocumentItem[];
  cta: CTASection;
}

export interface HeroSection {
  title: string;
  subtitle: string;
  statusLabel: string;
  backgroundImage: string;
}

export interface OverviewSection {
  heading: string;
  description: PortableTextBlock[];
}

export interface EligibilityItem {
  grade: string;
  criteria: string;
}

export interface ProcessStep {
  title: string;
  description: string;
  order: number;
}

export interface DocumentItem {
  name: string;
  notes?: string;
}

export interface CTASection {
  heading: string;
  description: string;
  primaryButtonText: string;
  primaryButtonLink: string;
  secondaryButtonText?: string;
  secondaryButtonLink?: string;
}

interface Props {
  data: AdmissionsPage
}


// ── Component ─────────────────────────────────────────────────────────────────
export default function AdmissionsPageComponent( {data}:Props ) {
  const revealRefs = useRef<HTMLElement[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            (entry.target as HTMLElement).classList.add("is-visible");
          }
        });
      },
      { threshold: 0.08 }
    );
    revealRefs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const addReveal = (el: HTMLElement | null) => {
    if (el && !revealRefs.current.includes(el)) revealRefs.current.push(el);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Outfit:wght@300;400;500;600&display=swap');

        :root {
          --cream: #F9F6F1;
          --ink: #1C1917;
          --gold: #B8975A;
          --gold-light: #D4B483;
          --muted: #6B6460;
          --border: rgba(184,151,90,0.18);
          --card-bg: rgba(255,255,255,0.72);
        }

        .adm-root * { box-sizing: border-box; margin: 0; padding: 0; }

        .adm-root {
          font-family: 'Outfit', sans-serif;
          background: var(--cream);
          color: var(--ink);
        }

        /* ── HERO ── */
        .adm-hero {
          position: relative;
          min-height: 92vh;
          display: flex;
          align-items: flex-end;
          overflow: hidden;
        }

        .adm-hero-bg {
          position: absolute;
          inset: 0;
          background-size: cover;
          background-position: center;
          transform: scale(1.04);
          transition: transform 8s ease;
        }

        .adm-hero:hover .adm-hero-bg {
          transform: scale(1.0);
        }

        .adm-hero-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to top,
            rgba(28,25,23,0.88) 0%,
            rgba(28,25,23,0.4) 50%,
            rgba(28,25,23,0.1) 100%
          );
        }

        .adm-hero-content {
          position: relative;
          z-index: 2;
          max-width: 1100px;
          margin: 0 auto;
          padding: 0 2rem 5rem;
          width: 100%;
        }

        .adm-status-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.35rem 1rem;
          border: 1px solid rgba(184,151,90,0.5);
          background: rgba(184,151,90,0.12);
          backdrop-filter: blur(8px);
          color: var(--gold-light);
          font-size: 0.7rem;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          font-weight: 500;
          margin-bottom: 1.5rem;
        }

        .adm-status-badge::before {
          content: '';
          width: 6px; height: 6px;
          border-radius: 50%;
          background: #4ade80;
          box-shadow: 0 0 6px #4ade80;
          animation: pulse-dot 2s infinite;
        }

        @keyframes pulse-dot {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }

        .adm-hero h1 {
          font-family: 'Playfair Display', serif;
          font-size: clamp(2.8rem, 6vw, 5.5rem);
          font-weight: 700;
          color: #FAF8F5;
          line-height: 1.05;
          letter-spacing: -0.01em;
          max-width: 700px;
          margin-bottom: 1.5rem;
        }

        .adm-hero h1 em {
          font-style: italic;
          color: var(--gold-light);
        }

        .adm-hero p {
          font-size: 1.05rem;
          color: rgba(250,248,245,0.72);
          font-weight: 300;
          line-height: 1.8;
          max-width: 520px;
        }

        /* ── SECTIONS COMMON ── */
        .adm-section {
          max-width: 1100px;
          margin: 0 auto;
          padding: 6rem 2rem;
        }

        .adm-section-label {
          font-size: 0.62rem;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: var(--gold);
          font-weight: 600;
          margin-bottom: 0.75rem;
        }

        .adm-section-heading {
          font-family: 'Playfair Display', serif;
          font-size: clamp(2rem, 3.5vw, 3rem);
          font-weight: 400;
          color: var(--ink);
          line-height: 1.15;
          letter-spacing: -0.01em;
        }

        .adm-section-heading em {
          font-style: italic;
          color: var(--gold);
        }

        .adm-divider {
          width: 48px;
          height: 1.5px;
          background: linear-gradient(90deg, var(--gold), transparent);
          margin: 1.5rem 0;
        }

        /* ── REVEAL ── */
        .reveal {
          opacity: 0;
          transform: translateY(32px);
          transition: opacity 0.8s cubic-bezier(0.16,1,0.3,1), transform 0.8s cubic-bezier(0.16,1,0.3,1);
        }
        .reveal.is-visible { opacity: 1; transform: translateY(0); }
        .reveal-d1 { transition-delay: 0.1s; }
        .reveal-d2 { transition-delay: 0.2s; }
        .reveal-d3 { transition-delay: 0.3s; }
        .reveal-d4 { transition-delay: 0.4s; }

        /* ── OVERVIEW ── */
        .adm-overview {
          background: var(--ink);
          position: relative;
          overflow: hidden;
        }

        .adm-overview::before {
          content: '';
          position: absolute;
          top: -60px; right: -60px;
          width: 400px; height: 400px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(184,151,90,0.1), transparent 70%);
        }

        .adm-overview-inner {
          max-width: 1100px;
          margin: 0 auto;
          padding: 6rem 2rem;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 5rem;
          align-items: center;
        }

        @media (max-width: 768px) {
          .adm-overview-inner { grid-template-columns: 1fr; gap: 2.5rem; }
        }

        .adm-overview .adm-section-heading { color: #FAF8F5; }
        .adm-overview .adm-section-label { color: var(--gold); }

        .adm-overview-text {
          font-size: 1rem;
          line-height: 1.9;
          color: rgba(250,248,245,0.6);
          font-weight: 300;
        }

        .adm-stat-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5px;
          background: rgba(184,151,90,0.15);
        }

        .adm-stat {
          background: rgba(28,25,23,0.9);
          padding: 2rem 1.75rem;
          transition: background 0.3s ease;
        }

        .adm-stat:hover { background: rgba(184,151,90,0.08); }

        .adm-stat-number {
          font-family: 'Playfair Display', serif;
          font-size: 2.8rem;
          font-weight: 700;
          color: var(--gold-light);
          line-height: 1;
          margin-bottom: 0.4rem;
        }

        .adm-stat-label {
          font-size: 0.78rem;
          color: rgba(250,248,245,0.45);
          font-weight: 300;
          letter-spacing: 0.05em;
        }

        /* ── ELIGIBILITY ── */
        .adm-eligibility-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
          gap: 1px;
          background: var(--border);
          border: 1px solid var(--border);
          margin-top: 3rem;
        }

        .adm-elig-card {
          background: var(--cream);
          padding: 2rem 1.75rem;
          position: relative;
          overflow: hidden;
          transition: background 0.3s ease;
        }

        .adm-elig-card::before {
          content: '';
          position: absolute;
          bottom: 0; left: 0; right: 0;
          height: 2px;
          background: linear-gradient(90deg, var(--gold), transparent);
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 0.4s ease;
        }

        .adm-elig-card:hover { background: white; }
        .adm-elig-card:hover::before { transform: scaleX(1); }

        .adm-elig-grade {
          font-family: 'Playfair Display', serif;
          font-size: 1.4rem;
          font-weight: 700;
          color: var(--ink);
          margin-bottom: 0.6rem;
        }

        .adm-elig-criteria {
          font-size: 0.855rem;
          color: var(--muted);
          font-weight: 300;
          line-height: 1.7;
        }

        /* ── PROCESS ── */
        .adm-process-bg {
          background: #F2EDE5;
        }

        .adm-process-steps {
          margin-top: 3.5rem;
          display: flex;
          flex-direction: column;
          gap: 0;
        }

        .adm-step {
          display: grid;
          grid-template-columns: 80px 1fr;
          gap: 2rem;
          padding: 2.5rem 0;
          border-bottom: 1px solid rgba(184,151,90,0.15);
          align-items: start;
          transition: background 0.2s;
        }

        .adm-step:last-child { border-bottom: none; }

        .adm-step-number {
          font-family: 'Playfair Display', serif;
          font-size: 3.5rem;
          font-weight: 700;
          color: rgba(184,151,90,0.2);
          line-height: 1;
          transition: color 0.3s ease;
        }

        .adm-step:hover .adm-step-number {
          color: var(--gold);
        }

        .adm-step-title {
          font-family: 'Playfair Display', serif;
          font-size: 1.3rem;
          font-weight: 400;
          color: var(--ink);
          margin-bottom: 0.5rem;
        }

        .adm-step-desc {
          font-size: 0.9rem;
          color: var(--muted);
          font-weight: 300;
          line-height: 1.75;
        }

        @media (max-width: 520px) {
          .adm-step { grid-template-columns: 50px 1fr; gap: 1rem; }
          .adm-step-number { font-size: 2.5rem; }
        }

        /* ── DOCUMENTS ── */
        .adm-docs-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 1px;
          background: var(--border);
          border: 1px solid var(--border);
          margin-top: 3rem;
        }

        .adm-doc-item {
          background: var(--cream);
          padding: 1.5rem 1.75rem;
          display: flex;
          align-items: flex-start;
          gap: 1rem;
          transition: background 0.25s ease;
        }

        .adm-doc-item:hover { background: white; }

        .adm-doc-icon {
          width: 36px;
          height: 36px;
          border: 1px solid var(--border);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          color: var(--gold);
          font-size: 0.85rem;
        }

        .adm-doc-name {
          font-size: 0.9rem;
          font-weight: 500;
          color: var(--ink);
          margin-bottom: 0.2rem;
        }

        .adm-doc-note {
          font-size: 0.75rem;
          color: var(--muted);
          font-weight: 300;
        }

        /* ── CTA ── */
        .adm-cta {
          background: var(--ink);
          position: relative;
          overflow: hidden;
          text-align: center;
        }

        .adm-cta::before {
          content: '';
          position: absolute;
          inset: 0;
          background:
            radial-gradient(circle at 20% 50%, rgba(184,151,90,0.12) 0%, transparent 50%),
            radial-gradient(circle at 80% 50%, rgba(184,151,90,0.08) 0%, transparent 40%);
        }

        .adm-cta-inner {
          position: relative;
          z-index: 1;
          max-width: 640px;
          margin: 0 auto;
          padding: 7rem 2rem;
        }

        .adm-cta h2 {
          font-family: 'Playfair Display', serif;
          font-size: clamp(2rem, 4vw, 3.25rem);
          font-weight: 400;
          color: #FAF8F5;
          line-height: 1.2;
          margin-bottom: 1.25rem;
        }

        .adm-cta h2 em {
          font-style: italic;
          color: var(--gold-light);
        }

        .adm-cta p {
          font-size: 0.95rem;
          color: rgba(250,248,245,0.55);
          font-weight: 300;
          line-height: 1.8;
          margin-bottom: 2.5rem;
        }

        .adm-cta-buttons {
          display: flex;
          gap: 1rem;
          justify-content: center;
          flex-wrap: wrap;
        }

        .btn-primary {
          padding: 0.9rem 2.25rem;
          background: var(--gold);
          color: var(--ink);
          font-family: 'Outfit', sans-serif;
          font-size: 0.78rem;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          font-weight: 600;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          transition: background 0.25s ease, transform 0.2s ease;
          border: none;
          cursor: pointer;
        }

        .btn-primary:hover {
          background: var(--gold-light);
          transform: translateY(-2px);
        }

        .btn-secondary {
          padding: 0.9rem 2.25rem;
          background: transparent;
          color: rgba(250,248,245,0.7);
          font-family: 'Outfit', sans-serif;
          font-size: 0.78rem;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          font-weight: 500;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          border: 1px solid rgba(250,248,245,0.2);
          transition: border-color 0.25s ease, color 0.25s ease, transform 0.2s ease;
          cursor: pointer;
        }

        .btn-secondary:hover {
          border-color: var(--gold);
          color: var(--gold-light);
          transform: translateY(-2px);
        }
      `}</style>

      <div className="adm-root">

        {/* ── HERO ── */}
        <section className="adm-hero">
          <div
            className="adm-hero-bg"
            style={{ backgroundImage: `url(${data.hero.backgroundImage})` }}
          />
          <div className="adm-hero-overlay" />
          <div className="adm-hero-content">
            <div className="adm-status-badge">{data.hero.statusLabel}</div>
            <h1 dangerouslySetInnerHTML={{
              __html: data.hero.title.replace(/(\w+\s+\w+)$/, "<em>$1</em>")
            }} />
            <p>{data.hero.subtitle}</p>
          </div>
        </section>

        {/* ── OVERVIEW ── */}
        <section className="adm-overview">
          <div className="adm-overview-inner">
            <div ref={addReveal} className="reveal">
              <p className="adm-section-label">Overview</p>
              <h2 className="adm-section-heading"
                dangerouslySetInnerHTML={{
                  __html: data.overview.heading.replace(/(\w+)$/, "<em>$1</em>")
                }}
              />
              <div className="adm-divider" style={{ background: "linear-gradient(90deg, var(--gold), transparent)" }} />
              <PortableText value={data.overview.description} />
            </div>
            <div ref={addReveal} className="reveal reveal-d2">
              <div className="adm-stat-grid">
                {[
                  { n: "25+", l: "Years of Excellence" },
                  { n: "98%", l: "Board Pass Rate" },
                  { n: "1:18", l: "Teacher–Student Ratio" },
                  { n: "60+", l: "Clubs & Activities" },
                ].map((s) => (
                  <div key={s.l} className="adm-stat">
                    <div className="adm-stat-number">{s.n}</div>
                    <div className="adm-stat-label">{s.l}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── ELIGIBILITY ── */}
        <section className="adm-process-bg">
          <div className="adm-section">
            <div ref={addReveal} className="reveal">
              <p className="adm-section-label">Eligibility</p>
              <h2 className="adm-section-heading">Who Can <em>Apply</em></h2>
              <div className="adm-divider" />
            </div>
            <div className="adm-eligibility-grid">
              {data.eligibility.map((item, i) => (
                <div
                  key={item.grade}
                  ref={addReveal}
                  className={`adm-elig-card reveal reveal-d${Math.min(i + 1, 4)}`}
                >
                  <div className="adm-elig-grade">{item.grade}</div>
                  <p className="adm-elig-criteria">{item.criteria}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── PROCESS ── */}
        <section style={{ background: "var(--cream)" }}>
          <div className="adm-section">
            <div ref={addReveal} className="reveal">
              <p className="adm-section-label">How to Apply</p>
              <h2 className="adm-section-heading">The <em>Admission</em> Process</h2>
              <div className="adm-divider" />
            </div>
            <div className="adm-process-steps">
              {data.process
                .sort((a, b) => a.order - b.order)
                .map((step, i) => (
                  <div
                    key={step.order}
                    ref={addReveal}
                    className={`adm-step reveal reveal-d${Math.min(i + 1, 4)}`}
                  >
                    <div className="adm-step-number">0{step.order}</div>
                    <div>
                      <div className="adm-step-title">{step.title}</div>
                      <p className="adm-step-desc">{step.description}</p>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </section>

        {/* ── DOCUMENTS ── */}
        <section className="adm-process-bg">
          <div className="adm-section">
            <div ref={addReveal} className="reveal">
              <p className="adm-section-label">Checklist</p>
              <h2 className="adm-section-heading">Documents <em>Required</em></h2>
              <div className="adm-divider" />
            </div>
            <div className="adm-docs-grid">
              {data.documents.map((doc, i) => (
                <div
                  key={doc.name}
                  ref={addReveal}
                  className={`adm-doc-item reveal reveal-d${Math.min((i % 4) + 1, 4)}`}
                >
                  <div className="adm-doc-icon">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                      <polyline points="14,2 14,8 20,8" />
                    </svg>
                  </div>
                  <div>
                    <div className="adm-doc-name">{doc.name}</div>
                    {doc.notes && <div className="adm-doc-note">{doc.notes}</div>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </>
  );
}