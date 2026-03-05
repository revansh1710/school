'use client';

interface Department {
  name: string;
  description: string;
}

export interface Academics {
  title: string;
  overview: string;
  board: string;
  classes: string[];
  departments?: Department[];
  methodology: string;
  highlights: string[];
}

type Props = {
  data: Academics;
};

const departmentIcons: Record<number, string> = {
  0: "⚗️", 1: "📐", 2: "📚", 3: "🌍", 4: "🎨", 5: "💻", 6: "🎵", 7: "🏛️", 8: "🔬",
};

export default function AcademicsSection({ data }: Props) {
  return (
    <section style={{ position: "relative", overflow: "hidden", background: "#ffffff" }} id="academics">

      {/* RESPONSIVE FIX */}
      <style>{`

        @media (min-width:320px) and (max-width:425px){

          p{
            font-size:0.6rem !important;
          }

          h1{
            font-size:1.7rem !important;
            line-height:1.2 !important;
          }

          h2{
            font-size:1.4rem !important;
          }

          h3{
            font-size:1rem !important;
          }

          section[id="academics"] > div{
            padding-left:20px !important;
            padding-right:20px !important;
          }

          section[id="academics"] > div:first-child{
            padding-top:60px !important;
            padding-bottom:70px !important;
          }

          section[id="academics"] span{
            font-size:0.6rem !important;
          }

          .methodology-section{
            padding:0 20px 60px !important;
          }

          .methodology-card{
          padding:28px 20px !important;
          }

          .methodology-flex{
          flex-direction:column !important;
          gap:18px !important;
          }

          .methodology-title{
          width:100% !important;
          }

          .methodology-text{
          min-width:0 !important;
          }

          .methodology-text p{
          font-size:0.6rem !important;
          }

        }

      `}</style>

      {/* ===== Hero ===== */}
      <div style={{
        position: "relative",
        background: "linear-gradient(135deg, #0c2340 0%, #0f2d55 60%, #123768 100%)",
        overflow: "hidden",
        padding: "80px 64px 96px",
      }}>
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: "radial-gradient(rgba(255,255,255,0.06) 1px, transparent 1px)",
          backgroundSize: "24px 24px", opacity: 0.4, pointerEvents: "none",
        }} />

        <div style={{
          position: "absolute", top: -120, right: -120,
          width: 420, height: 420,
          background: "radial-gradient(circle, rgba(59,130,246,0.35), transparent 70%)",
          filter: "blur(40px)", pointerEvents: "none",
        }} />

        <div style={{ maxWidth: 1152, margin: "0 auto", position: "relative", zIndex: 10 }}>
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-end", justifyContent: "space-between", gap: 32 }}>
            <div style={{ maxWidth: 640 }}>

              <div style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                fontSize: "0.75rem", letterSpacing: "0.12em", textTransform: "uppercase",
                color: "#93c5fd", background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.12)",
                padding: "8px 14px", borderRadius: 999, marginBottom: 24,
              }}>
                <span>🎓</span> Academic Excellence
              </div>

              <h1 style={{
                fontFamily: "var(--font-playfair), Georgia, serif",
                fontSize: "clamp(2.8rem, 7vw, 4.5rem)",
                fontWeight: 700, color: "#ffffff",
                lineHeight: 1.08, marginBottom: 24,
              }}>
                {data.title}
              </h1>

              <p style={{
                color: "#bfdbfe", fontSize: "1.1rem",
                lineHeight: 1.7, fontWeight: 300, maxWidth: 520,
              }}>
                {data.overview}
              </p>
            </div>

            {data.board && (
              <div style={{
                background: "rgba(255,255,255,0.07)",
                border: "1px solid rgba(255,255,255,0.15)",
                borderRadius: 20, padding: "20px 28px",
                backdropFilter: "blur(10px)", textAlign: "center", flexShrink: 0,
              }}>
                <div style={{
                  fontSize: "0.75rem", letterSpacing: "0.18em",
                  textTransform: "uppercase", fontWeight: 600,
                  color: "#60a5fa", marginBottom: 4,
                }}>
                  Affiliated Board
                </div>
                <div style={{
                  fontFamily: "var(--font-playfair), Georgia, serif",
                  color: "#ffffff", fontWeight: 700, fontSize: "0.9rem",
                }}>
                  {data.board}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ===== Classes Offered ===== */}
      {data.classes && data.classes.length > 0 && (
        <div style={{
          borderBottom: "1px solid #e5e7eb",
          padding: "48px 64px",
        }}>
          <div style={{ maxWidth: 1152, margin: "0 auto" }}>
            <div style={{
              fontSize: "0.75rem", letterSpacing: "0.18em",
              textTransform: "uppercase", fontWeight: 600,
              color: "#60a5fa", marginBottom: 20,
            }}>
              Grade Range
            </div>

            <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
              {data.classes.map((cls, i) => (
                <span key={i} style={{
                  background: "#f1f5f9", color: "#0c2340",
                  borderRadius: 999, padding: "8px 16px",
                  fontSize: "0.8rem", fontWeight: 500,
                  border: "1px solid #e2e8f0",
                }}>
                  {cls}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ===== Departments ===== */}
      {data.departments && data.departments.length > 0 && (
        <div style={{ padding: "80px 64px" }}>
          <div style={{ maxWidth: 1152, margin: "0 auto" }}>

            <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 32 }}>
              <div style={{ flex: 1, height: 1, background: "#e5e7eb" }} />
              <span style={{
                fontSize: "0.75rem", letterSpacing: "0.18em",
                textTransform: "uppercase", fontWeight: 600, color: "#8b7355",
                whiteSpace: "nowrap",
              }}>
                Academic Departments
              </span>
              <div style={{ flex: 1, height: 1, background: "#e5e7eb" }} />
            </div>

            <div style={{ marginBottom: 40 }}>
              <h2 style={{
                fontFamily: "var(--font-playfair), Georgia, serif",
                fontSize: "clamp(2rem, 5vw, 3.5rem)",
                fontWeight: 700, color: "#0c2340", lineHeight: 1.1, marginBottom: 12,
              }}>
                Our Disciplines
              </h2>

              <p style={{ color: "#64748b", maxWidth: 480, fontWeight: 300, lineHeight: 1.7 }}>
                Specialised departments delivering world-class instruction across every field of knowledge.
              </p>
            </div>

            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: 20,
            }}>
              {data.departments.map((dept, i) => (
                <DeptCard key={i} dept={dept} icon={departmentIcons[i % 9]} />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ===== Teaching Methodology ===== */}
      {data.methodology && (
        <div className="methodology-section" style={{ padding: "0 64px 80px" }}>
          <div style={{ maxWidth: 1152, margin: "0 auto" }}>
            <div
              className="methodology-card"
              style={{
                position: "relative",
                background: "#ffffff",
                borderRadius: 20,
                border: "1px solid #e5e7eb",
                overflow: "hidden",
                padding: "48px 56px",
              }}
            >

              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "radial-gradient(circle at 20% 20%, rgba(59,130,246,0.07), transparent 60%)",
                  pointerEvents: "none",
                }}
              />

              <div
                className="methodology-flex"
                style={{
                  position: "relative",
                  zIndex: 1,
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 40,
                  alignItems: "flex-start",
                }}
              >
                <div
                  className="methodology-title"
                  style={{ flexShrink: 0, width: 240 }}
                >
                  <div
                    style={{
                      width: 54,
                      height: 4,
                      borderRadius: 999,
                      background: "linear-gradient(90deg, #3b82f6, #60a5fa)",
                      marginBottom: 12,
                    }}
                  />

                  <h2
                    style={{
                      fontFamily: "var(--font-playfair), Georgia, serif",
                      fontSize: "clamp(1.8rem, 4vw, 2.8rem)",
                      fontWeight: 700,
                      color: "#0c2340",
                      lineHeight: 1.15,
                    }}
                  >
                    Teaching Methodology
                  </h2>
                </div>

                <div
                  className="methodology-text"
                  style={{ flex: 1, minWidth: 260, paddingTop: 8 }}
                >
                  <p
                    style={{
                      color: "#374151",
                      lineHeight: 1.9,
                      fontSize: "1.05rem",
                      fontWeight: 300,
                      marginBottom: 24,
                    }}
                  >
                    {data.methodology}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===== Academic Highlights ===== */}
      {data.highlights && data.highlights.length > 0 && (
        <div style={{ background: "#0c2340", padding: "80px 64px" }}>
          <div style={{ maxWidth: 1152, margin: "0 auto" }}>
            <div style={{ marginBottom: 48 }}>
              <div style={{
                fontSize: "0.75rem", letterSpacing: "0.18em",
                textTransform: "uppercase", fontWeight: 600,
                color: "#60a5fa", marginBottom: 8,
              }}>
                Why Choose Us
              </div>

              <h2 style={{
                fontFamily: "var(--font-playfair), Georgia, serif",
                fontSize: "clamp(2rem, 5vw, 3.5rem)",
                fontWeight: 700, color: "#ffffff", lineHeight: 1.1,
              }}>
                Academic Highlights
              </h2>
            </div>

            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
              gap: 14,
            }}>
              {data.highlights.map((item, i) => (
                <div key={i} style={{
                  background: "#ffffff",
                  borderRadius: 14,
                  padding: "18px 18px 18px 60px",
                  position: "relative",
                  border: "1px solid #1e3a5f",
                }}>
                  <div style={{
                    position: "absolute", left: 18, top: 18,
                    fontSize: "0.8rem", fontWeight: 700, color: "#60a5fa",
                    background: "rgba(96,165,250,0.1)",
                    width: 32, height: 32, borderRadius: 8,
                    display: "grid", placeItems: "center",
                  }}>
                    {String(i + 1).padStart(2, "0")}
                  </div>

                  <p style={{ color: "#374151", fontSize: "0.9rem", lineHeight: 1.7, fontWeight: 400 }}>
                    {item}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

function DeptCard({ dept, icon }: { dept: Department; icon: string }) {
  return (
    <div style={{
      background: "#ffffff", borderRadius: 16, padding: 22,
      border: "1px solid #e5e7eb",
    }}>
      <div style={{
        fontSize: "1.4rem", marginBottom: 10,
        width: 42, height: 42, borderRadius: 10,
        display: "grid", placeItems: "center",
        background: "#f1f5f9",
      }}>
        {icon}
      </div>

      <h3 style={{
        fontFamily: "var(--font-playfair), Georgia, serif",
        fontSize: "1.3rem", fontWeight: 600, color: "#0c2340", marginBottom: 8,
      }}>
        {dept.name}
      </h3>

      <p style={{ color: "#64748b", fontSize: "0.875rem", lineHeight: 1.7, fontWeight: 300 }}>
        {dept.description}
      </p>
    </div>
  );
}