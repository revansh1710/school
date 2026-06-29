"use client"

import { useState, useEffect } from "react"
import { statusConfig } from "../../../lib/admissionStatusConfig"

const badgeStyles: Record<string, { bg: string; color: string }> = {
  accepted: { bg: "#e8f5e3", color: "#2e7d32" },
  pending:  { bg: "#fff8e1", color: "#b45309" },
  rejected: { bg: "#fdecea", color: "#b71c1c" },
  review:   { bg: "#e8f0fe", color: "#1a56db" },
  new:      { bg: "#f1effe", color: "#5b21b6" },
}

const stampByStatus: Record<string, string> = {
  accepted: "Admitted",
  pending:  "In Review",
  rejected: "Closed",
  review:   "Pending",
  new:      "Received",
}

const accentByStatus: Record<string, { rule: string; stamp: string; stampBorder: string; stampText: string }> = {
  accepted: { rule: "#2e7d32", stamp: "#e8f5e3", stampBorder: "#4caf50", stampText: "#1b5e20" },
  pending:  { rule: "#BA7517", stamp: "#FAEEDA", stampBorder: "#EF9F27", stampText: "#633806" },
  rejected: { rule: "#b71c1c", stamp: "#fdecea", stampBorder: "#e57373", stampText: "#7f0000" },
  review:   { rule: "#1a56db", stamp: "#e8f0fe", stampBorder: "#4285f4", stampText: "#0d2f8a" },
  new:      { rule: "#BA7517", stamp: "#FAEEDA", stampBorder: "#EF9F27", stampText: "#633806" },
}

export default function AdmissionStatus({ status }: { status: string }) {
  const [open, setOpen] = useState(false)

  const normalizedStatus = status?.trim().toLowerCase()
  const config = statusConfig[normalizedStatus as keyof typeof statusConfig] || statusConfig["new"]
  const badge  = badgeStyles[normalizedStatus]  || badgeStyles["new"]
  const stamp  = stampByStatus[normalizedStatus] || "Received"
  const accent = accentByStatus[normalizedStatus] || accentByStatus["new"]

  useEffect(() => {
    const t = setTimeout(() => setOpen(true), 600)
    return () => clearTimeout(t)
  }, [])

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;1,400&family=EB+Garamond:ital,wght@0,400;0,500;1,400&display=swap');

        .admission-status-wrap {
          font-family: 'EB Garamond', Georgia, serif;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0;
          padding: 0.5rem 0 0.25rem;
        }

        .admission-stamp {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 4px 18px;
          border-radius: 3px;
          border: 1.5px solid var(--stamp-border);
          background: var(--stamp-bg);
          font-family: 'Playfair Display', serif;
          font-size: 11px;
          font-style: italic;
          letter-spacing: 0.18em;
          color: var(--stamp-text);
          margin-bottom: 1rem;
          position: relative;
          transform: rotate(-1.2deg);
          opacity: 0;
          transition: opacity 0.5s ease 0.3s;
        }
        .admission-stamp.visible {
          opacity: 1;
        }
        .admission-stamp::before,
        .admission-stamp::after {
          content: '–';
          margin: 0 6px;
          opacity: 0.5;
          font-style: normal;
        }

        .admission-label {
          font-family: 'Playfair Display', serif;
          font-size: 20px;
          font-weight: 500;
          color: var(--label-color);
          text-align: center;
          margin: 0 0 6px;
          line-height: 1.2;
        }

        .admission-ornament {
          display: flex;
          align-items: center;
          gap: 8px;
          width: 100%;
          max-width: 320px;
          margin: 8px auto;
        }
        .admission-ornament-line {
          flex: 1;
          height: 0.5px;
          background: #E8DFC8;
        }
        .admission-ornament-diamond {
          width: 4px;
          height: 4px;
          background: var(--rule-color);
          transform: rotate(45deg);
          flex-shrink: 0;
        }

        .admission-message {
          font-family: 'EB Garamond', serif;
          font-size: 15px;
          font-style: italic;
          color: var(--message-color);
          text-align: center;
          line-height: 1.6;
          max-width: 340px;
          margin: 0 auto;
          padding: 0 1rem;
        }
      `}</style>

      <div
        className="admission-status-wrap"
        style={{
          "--stamp-bg": accent.stamp,
          "--stamp-border": accent.stampBorder,
          "--stamp-text": accent.stampText,
          "--label-color": badge.color,
          "--rule-color": accent.rule,
          "--message-color": "#6b5c3e",
        } as React.CSSProperties}
      >
        {/* Rotated stamp */}
        <span className={`admission-stamp${open ? " visible" : ""}`}>
          {stamp}
        </span>

        {/* Status label */}
        <p className="admission-label">{config.label}</p>

        {/* Ornamental divider */}
        <div className="admission-ornament">
          <div className="admission-ornament-line" />
          <div className="admission-ornament-diamond" />
          <div className="admission-ornament-diamond" style={{ margin: "0 -3px" }} />
          <div className="admission-ornament-diamond" />
          <div className="admission-ornament-line" />
        </div>

        {/* Message */}
        <p className="admission-message">{config.message}</p>
      </div>
    </>
  )
}