'use client';
import { useEffect, useRef } from "react";
type ContactProps = {
  data: any;
};

export default function ContactSection({ data }: ContactProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const elements = sectionRef.current?.querySelectorAll(".reveal");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            (entry.target as HTMLElement).style.opacity = "1";
            (entry.target as HTMLElement).style.transform = "translateY(0)";
          }
        });
      },
      { threshold: 0.1 }
    );
    elements?.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=DM+Sans:wght@300;400;500&display=swap');

        .contact-section {
          font-family: 'DM Sans', sans-serif;
          background-color: #FAF8F5;
          position: relative;
          overflow: hidden;
        }

        .contact-section::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image: 
            radial-gradient(circle at 80% 10%, rgba(196, 164, 132, 0.12) 0%, transparent 50%),
            radial-gradient(circle at 10% 90%, rgba(139, 110, 82, 0.08) 0%, transparent 40%);
          pointer-events: none;
        }

        .noise-overlay {
          position: absolute;
          inset: 0;
          opacity: 0.025;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
          pointer-events: none;
        }

        .display-font {
          font-family: 'Cormorant Garamond', serif;
        }

        .reveal {
          opacity: 0;
          transform: translateY(28px);
          transition: opacity 0.75s cubic-bezier(0.16, 1, 0.3, 1), transform 0.75s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .reveal-delay-1 { transition-delay: 0.1s; }
        .reveal-delay-2 { transition-delay: 0.2s; }
        .reveal-delay-3 { transition-delay: 0.3s; }
        .reveal-delay-4 { transition-delay: 0.4s; }
        .reveal-delay-5 { transition-delay: 0.5s; }

        .contact-label {
          font-size: 0.65rem;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #9E8A76;
          font-weight: 500;
          margin-bottom: 0.35rem;
        }

        .contact-value {
          color: #2C2420;
          font-size: 0.95rem;
          line-height: 1.7;
          font-weight: 300;
        }

        .contact-card {
          background: rgba(255,255,255,0.65);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(196, 164, 132, 0.2);
          border-radius: 2px;
          padding: 2.5rem;
          transition: border-color 0.3s ease, box-shadow 0.3s ease;
        }

        .contact-card:hover {
          border-color: rgba(196, 164, 132, 0.45);
          box-shadow: 0 8px 32px rgba(139, 110, 82, 0.08);
        }

        .divider-line {
          width: 40px;
          height: 1px;
          background: linear-gradient(90deg, #C4A484, transparent);
          margin: 1.5rem 0;
        }

        .map-wrapper {
          position: relative;
          border-radius: 2px;
          overflow: hidden;
          box-shadow: 0 20px 60px rgba(44, 36, 32, 0.1);
        }

        .map-wrapper::after {
          content: '';
          position: absolute;
          inset: 0;
          border: 1px solid rgba(196, 164, 132, 0.3);
          border-radius: 2px;
          pointer-events: none;
        }

        .cta-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.6rem;
          padding: 0.85rem 2.25rem;
          background: #2C2420;
          color: #FAF8F5;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.8rem;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          font-weight: 500;
          border: none;
          cursor: pointer;
          position: relative;
          overflow: hidden;
          transition: background 0.3s ease;
        }

        .cta-btn::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, #C4A484, #8B6E52);
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .cta-btn:hover::before {
          opacity: 1;
        }

        .cta-btn span {
          position: relative;
          z-index: 1;
        }

        .cta-btn .arrow {
          position: relative;
          z-index: 1;
          transition: transform 0.3s ease;
        }

        .cta-btn:hover .arrow {
          transform: translateX(4px);
        }

        .tag-chip {
          display: inline-block;
          padding: 0.2rem 0.75rem;
          background: rgba(196, 164, 132, 0.15);
          color: #8B6E52;
          font-size: 0.7rem;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          font-weight: 500;
          border-radius: 1px;
          margin-bottom: 1.25rem;
        }

        .grid-info {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2rem;
        }

        @media (max-width: 600px) {
          .grid-info {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 768px) {
          .main-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>

      <section className="contact-section" ref={sectionRef} style={{ padding: "6rem 1.5rem" }} id='contact'>
        <div className="noise-overlay" />

        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>

          {/* Header */}
          <div className="reveal" style={{ marginBottom: "4rem", maxWidth: "600px" }}>
            <div className="tag-chip">Get in touch</div>
            <h1
              className="display-font"
              style={{
                fontSize: "clamp(2.5rem, 5vw, 4rem)",
                fontWeight: 300,
                color: "#2C2420",
                lineHeight: 1.1,
                letterSpacing: "-0.01em",
                marginBottom: "1.25rem",
              }}
            >
              {data.title || "Let's start a\nconversation"}
            </h1>
            <p style={{ color: "#6B5E56", fontSize: "1rem", lineHeight: 1.8, fontWeight: 300 }}>
              {data.description || "We'd love to hear from you. Reach out and we'll get back to you as soon as possible."}
            </p>
          </div>

          {/* Main Grid */}
          <div
            className="main-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1.4fr",
              gap: "2rem",
              alignItems: "start",
            }}
          >
            {/* Contact Card */}
            <div className="contact-card reveal reveal-delay-1">
              <div className="grid-info">
                {data.address && (
                  <div>
                    <p className="contact-label">Address</p>
                    <p className="contact-value">{data.address}</p>
                  </div>
                )}

                {data.email && (
                  <div>
                    <p className="contact-label">Email</p>
                    <p className="contact-value" style={{ wordBreak: "break-word" }}>{data.email}</p>
                  </div>
                )}

                {data.phone && data.phone.length > 0 && (
                  <div>
                    <p className="contact-label">Phone</p>
                    {data.phone.map((p: string, i: number) => (
                      <p key={i} className="contact-value">{p}</p>
                    ))}
                  </div>
                )}

                {data.officeHours && data.officeHours.length > 0 && (
                  <div>
                    <p className="contact-label">Office Hours</p>
                    {data.officeHours.map((h: string, i: number) => (
                      <p key={i} className="contact-value">{h}</p>
                    ))}
                  </div>
                )}
              </div>

              <div className="divider-line" />

              {data.ctaText && (
                <a href='/admissions'  className="cta-btn">
                  <span>{data.ctaText}</span>
                  <span className="arrow">→</span>
                </a>
              )}
            </div>

            {/* Map */}
            {data.mapUrl && (
              <div className="map-wrapper reveal reveal-delay-2" style={{ height: "420px" }}>
                <iframe
                  src={data.mapUrl}
                  style={{ width: "100%", height: "100%", border: "none", display: "block" }}
                  loading="lazy"
                  title="Office location map"
                />
              </div>
            )}

            {/* Fallback if no map */}
            {!data.mapUrl && (
              <div
                className="reveal reveal-delay-2"
                style={{
                  height: "420px",
                  background: "linear-gradient(135deg, rgba(196,164,132,0.1), rgba(139,110,82,0.06))",
                  border: "1px solid rgba(196,164,132,0.2)",
                  borderRadius: "2px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#9E8A76",
                  fontSize: "0.8rem",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                }}
              >
                Map unavailable
              </div>
            )}
          </div>

        </div>
      </section>
    </>
  );
}