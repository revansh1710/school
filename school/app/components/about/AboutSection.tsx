'use client';
import Image from "next/image";
import { urlFor } from "../../../sanity/lib/image";
import { GraduationCap, Target, Rocket, CheckCircle2, Star } from "lucide-react";

interface Facility {
  title: string;
  description: string;
  image?: any;
}

interface Achievement {
  title: string;
  year: string;
  description: string;
}

interface AboutData {
  title: string;
  description: string;
  establishedYear: string;
  vision: string;
  mission: string;
  principalName: string;
  designation: string;
  principalMessage: string;
  principalImage?: any;
  facilities?: Facility[];
  achievements?: Achievement[];
}

type AboutProps = {
  data: AboutData;
};

const serifFont = "var(--font-playfair), 'Playfair Display', Georgia, serif";
const sansFont = "var(--font-dm-sans), 'DM Sans', system-ui, sans-serif";

/* ─── Divider ─────────────────────────────────────────────────────────────── */
function DividerOrnament({ text }: { text: string }) {
  return (
    <section id='about'>
    <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "3rem" }}>
      <div style={{ flex: 1, height: "1px", background: "linear-gradient(90deg, transparent, #C8B89A, transparent)" }} />
      <span style={{ fontFamily: sansFont, fontSize: "0.7rem", letterSpacing: "0.2em", textTransform: "uppercase", fontWeight: 600, color: "#8B7355", whiteSpace: "nowrap" }}>
        {text}
      </span>
      <div style={{ flex: 1, height: "1px", background: "linear-gradient(90deg, transparent, #C8B89A, transparent)" }} />
    </div>
    </section>
  );
}

/* ─── Vision / Mission Card ───────────────────────────────────────────────── */
function VMCard({
  icon, labelText, labelColor, heading, body, gradient, glowColor,
}: {
  icon: React.ReactNode;
  labelText: string;
  labelColor: string;
  heading: string;
  body: string;
  gradient: string;
  glowColor: string;
}) {
  return (
    <div
      className="vm-card"
      style={{
        borderRadius: "1.5rem",
        padding: "clamp(1.5rem, 4vw, 2rem)",
        color: "#fff",
        position: "relative",
        overflow: "hidden",
        background: gradient,
        transition: "transform 0.3s ease, box-shadow 0.3s ease",
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLDivElement;
        el.style.transform = "translateY(-5px)";
        el.style.boxShadow = `0 24px 48px ${glowColor}`;
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLDivElement;
        el.style.transform = "translateY(0)";
        el.style.boxShadow = "none";
      }}
    >
      {/* Shine orb */}
      <div style={{ position: "absolute", top: -40, right: -40, width: 160, height: 160, borderRadius: "50%", background: "rgba(255,255,255,0.06)", pointerEvents: "none" }} />

      <div style={{ display: "flex", alignItems: "flex-start", gap: "1.25rem" }}>
        <div style={{ width: 48, height: 48, borderRadius: "1rem", display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(255,255,255,0.15)", flexShrink: 0 }}>
          {icon}
        </div>
        <div>
          <p style={{ fontFamily: sansFont, fontSize: "0.7rem", letterSpacing: "0.2em", textTransform: "uppercase", fontWeight: 600, color: labelColor, marginBottom: "0.5rem" }}>
            {labelText}
          </p>
          <h2 style={{ fontFamily: serifFont, fontSize: "clamp(1.2rem, 2.5vw, 1.6rem)", fontWeight: 700, color: "#fff", marginBottom: "0.75rem", lineHeight: 1.2 }}>
            {heading}
          </h2>
          <p style={{ fontFamily: sansFont, color: "rgba(255,255,255,0.82)", lineHeight: 1.8, fontWeight: 300, fontSize: "0.95rem" }}>
            {body}
          </p>
        </div>
      </div>
    </div>
  );
}

/* ─── Facility Card ───────────────────────────────────────────────────────── */
function FacilityCard({ facility, index }: { facility: Facility; index: number }) {
  const facilityImageUrl = facility.image
    ? urlFor(facility.image)?.width(800).height(500).url()
    : null;

  return (
    <div
      className="facility-card"
      style={{
        borderRadius: "1.5rem",
        overflow: "hidden",
        background: "#ffffff",
        border: "1px solid rgba(200,151,58,0.12)",
        boxShadow: "0 4px 20px rgba(15,35,71,0.07)",
        transition: "transform 0.35s cubic-bezier(0.175,0.885,0.32,1.275), box-shadow 0.35s ease",
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLDivElement;
        el.style.transform = "translateY(-8px)";
        el.style.boxShadow = "0 20px 48px rgba(15,35,71,0.15)";
        const img = el.querySelector<HTMLElement>(".fac-img");
        if (img) img.style.transform = "scale(1.07)";
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLDivElement;
        el.style.transform = "translateY(0)";
        el.style.boxShadow = "0 4px 20px rgba(15,35,71,0.07)";
        const img = el.querySelector<HTMLElement>(".fac-img");
        if (img) img.style.transform = "scale(1)";
      }}
    >
      {/* Image area */}
      <div style={{ position: "relative", overflow: "hidden", height: "13rem", background: "#dde4f0" }}>
        {/* Index badge */}
        <div style={{
          position: "absolute", top: "1rem", left: "1rem", zIndex: 10,
          width: 36, height: 36, borderRadius: "0.75rem",
          display: "flex", alignItems: "center", justifyContent: "center",
          background: "linear-gradient(135deg, #1B3A6B, #2563EB)",
          color: "#fff", fontFamily: serifFont, fontWeight: 700, fontSize: "0.9rem",
        }}>
          {index + 1}
        </div>

        {facilityImageUrl ? (
          <Image
            src={facilityImageUrl}
            alt={facility.title}
            width={400}
            height={300}
            className="fac-img"
            style={{ objectFit: "cover", width: "100%", height: "100%", display: "block", transition: "transform 0.5s ease" }}
          />
        ) : (
          <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(135deg, #dde4f0, #bfcfe8)" }}>
            <GraduationCap size={48} color="#7B9DC7" />
          </div>
        )}

        {/* Gradient overlay */}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(15,35,71,0.72) 0%, transparent 55%)" }} />

        {/* Title over image */}
        <div style={{ position: "absolute", bottom: "1rem", left: "1rem", right: "1rem" }}>
          <h3 style={{ fontFamily: sansFont, fontWeight: 700, color: "#fff", fontSize: "1rem", textTransform: "uppercase", letterSpacing: "0.05em", lineHeight: 1.3, margin: 0 }}>
            {facility.title}
          </h3>
        </div>
      </div>

      {/* Description */}
      <div style={{ padding: "1.25rem 1.5rem" }}>
        <p style={{ fontFamily: sansFont, color: "#64748B", fontSize: "0.875rem", lineHeight: 1.75, fontWeight: 300, margin: 0 }}>
          {facility.description}
        </p>
      </div>
    </div>
  );
}

/* ─── Achievement Item ────────────────────────────────────────────────────── */
function AchievementItem({ item }: { item: Achievement }) {
  return (
    <div
      className="achievement-item"
      style={{
        display: "flex",
        gap: "1.25rem",
        padding: "1.5rem",
        borderRadius: "1rem",
        borderLeft: "3px solid transparent",
        transition: "background 0.22s ease, border-color 0.22s ease",
        cursor: "default",
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLDivElement;
        el.style.background = "#ffffff";
        el.style.borderLeftColor = "#2563EB";
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLDivElement;
        el.style.background = "transparent";
        el.style.borderLeftColor = "transparent";
      }}
    >
      <div style={{ flexShrink: 0, marginTop: "0.25rem" }}>
        <div style={{ width: 40, height: 40, borderRadius: "0.75rem", display: "flex", alignItems: "center", justifyContent: "center", background: "#FFFBEB" }}>
          <CheckCircle2 size={18} color="#F59E0B" />
        </div>
      </div>
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.35rem", flexWrap: "wrap" }}>
          <span style={{ fontFamily: sansFont, fontSize: "0.72rem", fontWeight: 700, color: "#2563EB", background: "#EFF6FF", padding: "0.2rem 0.75rem", borderRadius: "999px" }}>
            {item.year}
          </span>
          <h3 style={{ fontFamily: serifFont, fontWeight: 700, fontSize: "1.05rem", color: "#1B3A6B", margin: 0 }}>
            {item.title}
          </h3>
        </div>
        <p style={{ fontFamily: sansFont, color: "#64748B", fontSize: "0.875rem", lineHeight: 1.75, margin: 0 }}>
          {item.description}
        </p>
      </div>
    </div>
  );
}

/* ─── Main Component ─────────────────────────────────────────────────────── */
export default function AboutSection({ data }: AboutProps) {
  const principalImageUrl = data.principalImage
    ? urlFor(data.principalImage)?.width(600).height(600).quality(90).url()
    : null;

  return (
    <section style={{ background: "#FAF7F2", fontFamily: sansFont, position: "relative", overflow: "hidden" }}>
      <style>{`
        .fac-img { transition: transform 0.5s ease; }

        /* VM cards grid */
        .vm-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1.25rem;
        }
        @media (min-width: 768px) {
          .vm-grid { grid-template-columns: 1fr 1fr; }
        }

        /* Facilities grid */
        .fac-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1.5rem;
        }
        @media (min-width: 640px) {
          .fac-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (min-width: 1024px) {
          .fac-grid { grid-template-columns: repeat(3, 1fr); }
        }

        /* Achievements grid */
        .ach-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 0.5rem;
        }
        @media (min-width: 768px) {
          .ach-grid { grid-template-columns: repeat(2, 1fr); }
        }

        /* Principal flex layout */
        .principal-layout {
          display: flex;
          flex-direction: column;
          gap: 2.5rem;
          align-items: center;
        }
        @media (min-width: 768px) {
          .principal-layout {
            flex-direction: row;
            align-items: flex-start;
          }
        }

        /* Hero inner layout */
        .hero-inner {
          display: flex;
          flex-direction: column;
          gap: 2rem;
          align-items: center;
          text-align: center;
        }
        @media (min-width: 768px) {
          .hero-inner {
            flex-direction: row;
            align-items: flex-end;
            justify-content: space-between;
            text-align: left;
          }
        }

        /* Section header layout */
        .section-header {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          margin-bottom: 3.5rem;
        }
        @media (min-width: 768px) {
          .section-header {
            flex-direction: row;
            align-items: flex-end;
            justify-content: space-between;
          }
        }

        /* VM section overlap */
        .vm-section {
          padding: 0 clamp(1.5rem, 5vw, 4rem);
          margin-top: -1px;
        }
      `}</style>

      {/* ===== Hero Banner ===== */}
      <div style={{
        padding: "clamp(4rem, 8vw, 6rem) clamp(1.5rem, 5vw, 4rem)",
        position: "relative",
        overflow: "hidden",
        background: "linear-gradient(135deg, #0F2347 0%, #1B3A6B 55%, #1a3260 100%)",
      }}>
        {/* Dot grid */}
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none", opacity: 0.6,
          backgroundImage: "radial-gradient(rgba(255,255,255,0.055) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }} />
        {/* Gold top line */}
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: "linear-gradient(90deg, transparent, #C8973A, transparent)", opacity: 0.6, pointerEvents: "none" }} />
        {/* Blue glow orb */}
        <div style={{ position: "absolute", top: -160, right: -100, width: 480, height: 480, background: "radial-gradient(circle, rgba(37,99,235,0.28), transparent 70%)", filter: "blur(50px)", pointerEvents: "none" }} />
        {/* Warm glow */}
        <div style={{ position: "absolute", bottom: -80, left: -80, width: 320, height: 320, background: "radial-gradient(circle, rgba(200,151,58,0.14), transparent 70%)", filter: "blur(40px)", pointerEvents: "none" }} />

        <div style={{ maxWidth: "72rem", margin: "0 auto", position: "relative", zIndex: 10 }}>
          <div className="hero-inner">
            {/* Title + description */}
            <div style={{ maxWidth: "42rem" }}>
              <h1 style={{
                fontFamily: serifFont,
                fontSize: "clamp(2.4rem, 6vw, 4.5rem)",
                fontWeight: 900,
                color: "#fff",
                lineHeight: 1.08,
                marginBottom: "1.25rem",
              }}>
                {data.title}
              </h1>
              <p style={{
                fontFamily: sansFont,
                color: "rgba(191,207,232,0.9)",
                lineHeight: 1.8,
                fontSize: "clamp(0.95rem, 1.5vw, 1.1rem)",
                fontWeight: 300,
                maxWidth: "40rem",
              }}>
                {data.description}
              </p>
            </div>

            {/* Established card */}
            <div style={{
              padding: "1.25rem 2rem",
              borderRadius: "1.25rem",
              background: "rgba(255,255,255,0.07)",
              border: "1px solid rgba(255,255,255,0.13)",
              backdropFilter: "blur(12px)",
              textAlign: "center",
              flexShrink: 0,
            }}>
              <p style={{ fontFamily: sansFont, fontSize: "0.7rem", letterSpacing: "0.2em", textTransform: "uppercase", fontWeight: 600, color: "rgba(191,207,232,0.7)", marginBottom: "0.35rem" }}>
                Established
              </p>
              <p style={{ fontFamily: serifFont, fontSize: "2rem", fontWeight: 700, color: "#fff", margin: 0 }}>
                {data.establishedYear}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ===== Vision & Mission ===== */}
      <div className="vm-section" style={{ paddingTop: "2.5rem", paddingBottom: "0" }}>
        <div style={{ maxWidth: "72rem", margin: "0 auto" }}>
          <div className="vm-grid">
            <VMCard
              icon={<Target size={22} color="#fff" />}
              labelText="Our Vision"
              labelColor="rgba(147,197,253,0.9)"
              heading="Where We're Headed"
              body={data.vision}
              gradient="linear-gradient(135deg, #1D4ED8, #2563EB)"
              glowColor="rgba(37,99,235,0.3)"
            />
            <VMCard
              icon={<Rocket size={22} color="#fff" />}
              labelText="Our Mission"
              labelColor="rgba(254,215,170,0.9)"
              heading="How We Get There"
              body={data.mission}
              gradient="linear-gradient(135deg, #EA580C, #F97316)"
              glowColor="rgba(249,115,22,0.3)"
            />
          </div>
        </div>
      </div>

      {/* ===== Principal's Message ===== */}
      <div style={{ padding: "clamp(3.5rem, 6vw, 5rem) clamp(1.5rem, 5vw, 4rem)" }}>
        <div style={{ maxWidth: "72rem", margin: "0 auto" }}>
          <DividerOrnament text="Principal's Message" />

          <div style={{
            borderRadius: "2rem",
            padding: "clamp(2rem, 5vw, 3.5rem)",
            overflow: "hidden",
            position: "relative",
            background: "linear-gradient(135deg, #FFFBF0, #FFF7E6)",
            border: "1px solid rgba(200,151,58,0.22)",
          }}>
            {/* Decorative quote mark */}
            <div style={{ position: "absolute", top: "1rem", left: "2.25rem", fontFamily: serifFont, fontSize: "8rem", lineHeight: 1, color: "#C8973A", opacity: 0.18, pointerEvents: "none", userSelect: "none" }}>
              "
            </div>
            {/* Corner glow */}
            <div style={{ position: "absolute", bottom: 0, right: 0, width: 224, height: 224, background: "radial-gradient(circle at bottom right, rgba(200,151,58,0.1), transparent 70%)", pointerEvents: "none" }} />

            <div className="principal-layout" style={{ position: "relative", zIndex: 10 }}>
              {principalImageUrl && (
                <div style={{ flexShrink: 0, position: "relative", alignSelf: "center" }}>
                  {/* Aura */}
                  <div style={{
                    position: "absolute", inset: -8, borderRadius: "1.5rem",
                    background: "linear-gradient(135deg, rgba(37,99,235,0.2), rgba(200,151,58,0.2))",
                    filter: "blur(16px)", opacity: 0.7,
                  }} />
                  <Image
                    src={principalImageUrl}
                    alt={data.principalName}
                    width={200}
                    height={260}
                    style={{
                      display: "block",
                      borderRadius: "1.5rem",
                      objectFit: "cover",
                      boxShadow: "0 20px 48px rgba(15,35,71,0.18)",
                      position: "relative",
                      width: "clamp(140px, 22vw, 200px)",
                      height: "auto",
                    }}
                  />
                </div>
              )}

              <div style={{ flex: 1 }}>
                <p style={{ fontFamily: sansFont, fontSize: "0.7rem", letterSpacing: "0.2em", textTransform: "uppercase", fontWeight: 600, color: "#C8973A", marginBottom: "0.6rem" }}>
                  Meet Our Principal
                </p>
                <h2 style={{ fontFamily: serifFont, fontSize: "clamp(1.6rem, 3.5vw, 2.5rem)", fontWeight: 700, color: "#1B3A6B", lineHeight: 1.1, marginBottom: "0.35rem" }}>
                  {data.principalName}
                </h2>
                <p style={{ fontFamily: sansFont, fontWeight: 500, fontStyle: "italic", color: "#EA580C", fontSize: "0.95rem", marginBottom: "1.75rem" }}>
                  {data.designation}
                </p>

                <p style={{
                  fontFamily: sansFont,
                  color: "#374151",
                  lineHeight: 1.9,
                  fontSize: "clamp(0.95rem, 1.5vw, 1.05rem)",
                  fontWeight: 300,
                  paddingLeft: "1.25rem",
                  borderLeft: "3px solid #C8973A",
                }}>
                  {data.principalMessage}
                </p>

                <div style={{ marginTop: "1.5rem", display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  <div style={{ display: "flex" }}>
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={13} fill="#F59E0B" color="#F59E0B" />
                    ))}
                  </div>
                  <span style={{ fontFamily: sansFont, fontSize: "0.85rem", fontWeight: 500, color: "#64748B" }}>
                    Excellence in Education
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ===== Facilities ===== */}
      {data.facilities && data.facilities.length > 0 && (
        <div style={{
          padding: "clamp(3.5rem, 6vw, 5rem) clamp(1.5rem, 5vw, 4rem)",
          position: "relative",
          overflow: "hidden",
          background: "linear-gradient(180deg, #0F2347 0%, #0c1d3a 100%)",
        }}>
          {/* Dot texture */}
          <div style={{ position: "absolute", inset: 0, pointerEvents: "none", backgroundImage: "radial-gradient(rgba(255,255,255,0.03) 1px, transparent 1px)", backgroundSize: "32px 32px" }} />
          {/* Gold top line */}
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: "linear-gradient(90deg, transparent, #C8973A, transparent)", opacity: 0.35, pointerEvents: "none" }} />

          <div style={{ maxWidth: "72rem", margin: "0 auto", position: "relative", zIndex: 10 }}>
            <div className="section-header">
              <div>
                <p style={{ fontFamily: sansFont, fontSize: "0.7rem", letterSpacing: "0.2em", textTransform: "uppercase", fontWeight: 600, color: "rgba(200,151,58,0.85)", marginBottom: "0.6rem" }}>
                  World-Class Infrastructure
                </p>
                <h2 style={{ fontFamily: serifFont, fontSize: "clamp(2rem, 5vw, 3.2rem)", fontWeight: 700, color: "#fff", lineHeight: 1.1, margin: 0 }}>
                  Our Facilities
                </h2>
              </div>
              <p style={{ fontFamily: sansFont, color: "rgba(191,207,232,0.7)", lineHeight: 1.75, fontSize: "0.95rem", maxWidth: "22rem", fontWeight: 300 }}>
                State-of-the-art environments designed to inspire learning and holistic growth.
              </p>
            </div>

            <div className="fac-grid">
              {data.facilities.map((facility, i) => (
                <FacilityCard key={i} facility={facility} index={i} />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ===== Achievements ===== */}
      {data.achievements && data.achievements.length > 0 && (
        <div style={{ padding: "clamp(3.5rem, 6vw, 5rem) clamp(1.5rem, 5vw, 4rem)", background: "#FAF7F2" }}>
          <div style={{ maxWidth: "72rem", margin: "0 auto" }}>
            <DividerOrnament text="School Achievements" />

            <div className="section-header">
              <h2 style={{ fontFamily: serifFont, fontSize: "clamp(2rem, 5vw, 3.2rem)", fontWeight: 700, color: "#1B3A6B", lineHeight: 1.1, margin: 0 }}>
                Institutional<br />Excellence
              </h2>
              <p style={{ fontFamily: sansFont, color: "#64748B", lineHeight: 1.75, fontSize: "0.95rem", maxWidth: "22rem", fontWeight: 300 }}>
                Recognised nationally for providing world-class, globally minded education.
              </p>
            </div>

            <div className="ach-grid">
              {data.achievements.map((item, i) => (
                <AchievementItem key={i} item={item} />
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}