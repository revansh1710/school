"use client"

import { useState, useEffect } from "react"
import { statusConfig } from "../../../lib/admissionStatusConfig"

const badgeStyles: Record<string, { bg: string; color: string }> = {
  accepted:  { bg: "#e8f5e3", color: "#2e7d32" },
  pending:   { bg: "#fff8e1", color: "#b45309" },
  rejected:  { bg: "#fdecea", color: "#b71c1c" },
  review:    { bg: "#e8f0fe", color: "#1a56db" },
  new:       { bg: "#f1effe", color: "#5b21b6" },
}

const stampByStatus: Record<string, string> = {
  accepted: "Admitted",
  pending:  "In Review",
  rejected: "Closed",
  review:   "Pending",
  new:      "Received",
}

export default function AdmissionStatus({ status }: { status: string }) {
  const [open, setOpen] = useState(false)


  const normalizedStatus = status?.trim().toLowerCase()
  const config =
    statusConfig[normalizedStatus as keyof typeof statusConfig] ||
    statusConfig["new"]

  const badge  = badgeStyles[normalizedStatus]  || badgeStyles["new"]
  const stamp  = stampByStatus[normalizedStatus] || "Received"

  useEffect(() => {
    const t = setTimeout(() => setOpen(true), 600)
    return () => clearTimeout(t)
  }, [])

  return (
    <div style={styles.scene}>
      {/* Book wrapper */}
      <div style={styles.bookWrap}>

        {/* Left: pages */}
        <div style={styles.pagesBlock}>
          {/* Ruled lines decoration */}
          <div style={styles.pageLines} aria-hidden>
            {Array.from({ length: 14 }).map((_, i) => (
              <div key={i} style={styles.pageLine} />
            ))}
          </div>

          {/* Page content — fades in after cover opens */}
          <div
            style={{
              ...styles.pageContent,
              opacity:    open ? 1 : 0,
              transform:  open ? "translateY(0)" : "translateY(8px)",
              transition: "opacity 0.6s ease 1.0s, transform 0.6s ease 1.0s",
            }}
          >
            <span
              style={{
                ...styles.pageBadge,
                background: badge.bg,
                color:      badge.color,
              }}
            >
              {config.label}
            </span>

            <p style={styles.pageTitle}>{config.label}</p>

            <div style={styles.divider} />

            <p style={styles.pageMessage}>{config.message}</p>
          </div>

          {/* Footer */}
          <div
            style={{
              ...styles.pageFooter,
              opacity:    open ? 1 : 0,
              transition: "opacity 0.5s ease 1.4s",
            }}
          >
            <span style={styles.pageNum}>— 1 —</span>
            <span style={styles.stamp}>{stamp}</span>
          </div>
        </div>

        {/* Spine */}
        <div style={styles.spine} />

        {/* Right: cover — rotates open */}
        <div
          style={{
            ...styles.cover,
            transform: open ? "rotateY(-160deg)" : "rotateY(0deg)",
            transition: "transform 1.1s cubic-bezier(0.4, 0, 0.2, 1)",
          }}
        >
          <div style={styles.coverFront}>
            <div style={styles.coverSeal}>🏫</div>
            <p style={styles.coverTitle}>Admission{"\n"}Office</p>
            <div style={styles.coverLine} />
            <p style={styles.coverSub}>Official Record</p>
          </div>
        </div>
      </div>

      {/* Ground shadow */}
      <div
        style={{
          ...styles.shadow,
          width: open ? 400 : 220,
          transition: "width 0.9s ease",
        }}
      />

      {/* Action Buttons */}
      <div style={styles.actionBlock}>
        {/* Toggle hint */}
        <button
          onClick={() => setOpen((v) => !v)}
          style={styles.hintBtn}
          aria-label={open ? "Close book" : "Open book"}
        >
          {open ? "Close" : "Open the letter"}
        </button>
      </div>
    </div>
  )
}

/* ─── styles ──────────────────────────────────────────────────────────────── */

const BOOK_W = 260
const BOOK_H = 320

const styles: Record<string, React.CSSProperties> = {
  scene: {
    display:        "flex",
    flexDirection:  "column",
    alignItems:     "center",
    justifyContent: "center",
    padding:        "3rem 1rem 2rem",
    perspective:    "1200px",
  },
  bookWrap: {
    position:         "relative",
    width:            BOOK_W * 2,
    height:           BOOK_H,
    transformStyle:   "preserve-3d",
  },
  pagesBlock: {
    position:     "absolute",
    left:         0,
    top:          3,
    width:        BOOK_W,
    height:       BOOK_H - 6,
    background:   "linear-gradient(to right, #e8e8e0 0%, #f5f3ee 4%, #fffdf6 6%)",
    borderRadius: "3px 0 0 3px",
    display:      "flex",
    flexDirection:"column",
    alignItems:   "flex-start",
    justifyContent:"flex-start",
    padding:      "32px 28px 28px",
    overflow:     "hidden",
    boxShadow:    "inset -2px 0 4px rgba(0,0,0,0.08)",
  },
  pageLines: {
    position: "absolute",
    inset:    0,
    overflow: "hidden",
    opacity:  0.18,
  },
  pageLine: {
    height:     0.5,
    background: "#8a7a5a",
    margin:     "22px 28px 0",
  },
  pageContent: {
    position: "relative",
    zIndex:   2,
    width:    "100%",
  },
  pageBadge: {
    display:      "inline-flex",
    alignItems:   "center",
    fontSize:     11,
    fontWeight:   500,
    letterSpacing:"0.07em",
    textTransform:"uppercase",
    padding:      "4px 10px",
    borderRadius: 20,
    marginBottom: 14,
  },
  pageTitle: {
    fontFamily:   "Georgia, serif",
    fontSize:     17,
    fontWeight:   400,
    color:        "#1a1a18",
    lineHeight:   1.3,
    margin:       "0 0 10px",
  },
  divider: {
    width:        40,
    height:       1.5,
    background:   "#d4a017",
    borderRadius: 1,
    marginBottom: 10,
  },
  pageMessage: {
    fontFamily: "system-ui, sans-serif",
    fontSize:   12.5,
    fontWeight: 400,
    color:      "#4a4535",
    lineHeight: 1.65,
    margin:     0,
  },
  pageFooter: {
    position:       "absolute",
    bottom:         16,
    left:           28,
    right:          28,
    display:        "flex",
    justifyContent: "space-between",
    alignItems:     "center",
  },
  pageNum: {
    fontSize: 10,
    color:    "#9a8a6a",
  },
  stamp: {
    fontSize:     10,
    color:        "#c0a84a",
    fontWeight:   500,
    letterSpacing:"0.06em",
    textTransform:"uppercase",
    border:       "1px solid #c0a84a",
    padding:      "2px 7px",
    borderRadius: 2,
    opacity:      0.7,
    transform:    "rotate(-4deg)",
    display:      "inline-block",
  },
  spine: {
    position:     "absolute",
    left:         BOOK_W - 16,
    top:          0,
    width:        16,
    height:       BOOK_H,
    background:   "#122a50",
    zIndex:       5,
    borderRadius: "2px 0 0 2px",
  },
  cover: {
    position:         "absolute",
    right:            0,
    width:            BOOK_W,
    height:           BOOK_H,
    background:       "#1a3a6b",
    borderRadius:     "0 6px 6px 0",
    transformOrigin:  "left center",
    transformStyle:   "preserve-3d",
    boxShadow:        "4px 6px 20px rgba(0,0,0,0.35)",
    zIndex:           10,
    backfaceVisibility:"hidden",
  },
  coverFront: {
    position:       "absolute",
    inset:          0,
    display:        "flex",
    flexDirection:  "column",
    alignItems:     "center",
    justifyContent: "center",
    gap:            12,
    padding:        "28px 22px",
    backfaceVisibility:"hidden",
    borderRadius:   "0 6px 6px 0",
  },
  coverSeal: {
    width:          56,
    height:         56,
    borderRadius:   "50%",
    background:     "#d4a017",
    display:        "flex",
    alignItems:     "center",
    justifyContent: "center",
    fontSize:       24,
    marginBottom:   4,
  },
  coverTitle: {
    fontFamily:  "system-ui, sans-serif",
    fontSize:    15,
    fontWeight:  500,
    color:       "#e8d99a",
    textAlign:   "center",
    letterSpacing:"0.04em",
    lineHeight:  1.4,
    whiteSpace:  "pre-line",
    margin:      0,
  },
  coverLine: {
    width:      "60%",
    height:     0.5,
    background: "#d4a017",
    opacity:    0.6,
  },
  coverSub: {
    fontFamily:   "system-ui, sans-serif",
    fontSize:     11,
    fontWeight:   400,
    color:        "rgba(200,190,160,0.75)",
    textAlign:    "center",
    letterSpacing:"0.08em",
    textTransform:"uppercase",
    margin:       0,
  },
  shadow: {
    height:     12,
    background: "radial-gradient(ellipse, rgba(0,0,0,0.18) 0%, transparent 70%)",
    marginTop:  -4,
  },
  actionBlock: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  }
}