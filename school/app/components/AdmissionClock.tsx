"use client";

import { useEffect, useRef, useState } from "react";

const DEADLINE = new Date("2026-08-15T23:59:59");
const TOTAL_MS =
  DEADLINE.getTime() - new Date("2026-01-01T00:00:00").getTime();

const ARC_FULL = 477.5;

const ROMAN = [
  "XII",
  "I",
  "II",
  "III",
  "IV",
  "V",
  "VI",
  "VII",
  "VIII",
  "IX",
  "X",
  "XI",
];

function pad(n: number) {
  return String(n).padStart(2, "0");
}

function round(n: number) {
  return Number(n.toFixed(4));
}

export default function AdmissionClock() {
  const [mounted, setMounted] = useState(false);
  const [clockSize, setClockSize] = useState(140);

  const hourRef = useRef<HTMLDivElement>(null);
  const minuteRef = useRef<HTMLDivElement>(null);
  const secondRef = useRef<HTMLDivElement>(null);
  const tailRef = useRef<HTMLDivElement>(null);
  const arcRef = useRef<SVGCircleElement>(null);

  const daysRef = useRef<HTMLSpanElement>(null);
  const hrsRef = useRef<HTMLSpanElement>(null);
  const minsRef = useRef<HTMLSpanElement>(null);
  const secsRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    setMounted(true);

    const updateClockSize = () => {
      const w = window.innerWidth;

      /*
        Smooth scaling between:
        220px → 88
        720px → 160
      */

      const minScreen = 220;
      const maxScreen = 720;

      const minClock = 88;
      const maxClock = 160;

      const clamped = Math.min(
        Math.max(w, minScreen),
        maxScreen
      );

      const scale =
        (clamped - minScreen) /
        (maxScreen - minScreen);

      const size =
        minClock + (maxClock - minClock) * scale;

      setClockSize(size);
    };

    updateClockSize();

    window.addEventListener("resize", updateClockSize);

    return () =>
      window.removeEventListener(
        "resize",
        updateClockSize
      );
  }, []);

  useEffect(() => {
    if (!mounted) return;

    function tick() {
      const now = new Date();

      const h = now.getHours() % 12;
      const m = now.getMinutes();
      const s = now.getSeconds();
      const ms = now.getMilliseconds();

      const sDeg = (s + ms / 1000) * 6;
      const mDeg = (m + s / 60) * 6;
      const hDeg = (h + m / 60) * 30;

      if (hourRef.current) {
        hourRef.current.style.transform =
          `rotate(${hDeg}deg)`;
      }

      if (minuteRef.current) {
        minuteRef.current.style.transform =
          `rotate(${mDeg}deg)`;
      }

      if (secondRef.current) {
        secondRef.current.style.transform =
          `rotate(${sDeg}deg)`;
      }

      if (tailRef.current) {
        tailRef.current.style.transform =
          `rotate(${sDeg + 180}deg)`;
      }

      const diff = DEADLINE.getTime() - now.getTime();

      if (diff > 0) {
        const days = Math.floor(diff / 86400000);

        const hrs = Math.floor(
          (diff % 86400000) / 3600000
        );

        const mins = Math.floor(
          (diff % 3600000) / 60000
        );

        const secs = Math.floor(
          (diff % 60000) / 1000
        );

        if (daysRef.current)
          daysRef.current.textContent =
            String(days);

        if (hrsRef.current)
          hrsRef.current.textContent = pad(hrs);

        if (minsRef.current)
          minsRef.current.textContent = pad(mins);

        if (secsRef.current)
          secsRef.current.textContent = pad(secs);

        const pct = Math.min(
          Math.max((TOTAL_MS - diff) / TOTAL_MS, 0),
          1
        );

        const offset = (
          ARC_FULL -
          pct * ARC_FULL
        ).toFixed(2);

        if (arcRef.current) {
          arcRef.current.setAttribute(
            "stroke-dashoffset",
            offset
          );
        }
      }
    }

    tick();

    const id = setInterval(tick, 1000);

    return () => clearInterval(id);
  }, [mounted]);

  if (!mounted) return null;

  const center = clockSize / 2;

  const romanRadius = clockSize * 0.39;

  const hourHeight = clockSize * 0.3;
  const minuteHeight = clockSize * 0.39;
  const secondHeight = clockSize * 0.42;
  const tailHeight = clockSize * 0.1;

  const dotSize = Math.max(clockSize * 0.055, 4);

  const numeralSize = Math.max(
    Math.min(clockSize * 0.065, 10),
    5
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=DM+Sans:wght@300;400;500&display=swap');

        .ac-root {
          width: clamp(150px, 100%, 240px);

          display: flex;
          flex-direction: column;
          align-items: center;

          padding: clamp(0.7rem, 2vw, 1.25rem);

          background: #faf8f4;

          border: 1px solid #e2d9cc;
          border-radius: clamp(10px, 2vw, 18px);

          font-family: 'DM Sans', sans-serif;

          box-shadow:
            0 2px 16px rgba(26,23,20,0.07);

          overflow: hidden;
        }

        .ac-svg-wrap {
          position: relative;

          width: ${clockSize + 20}px;
          height: ${clockSize + 20}px;

          flex-shrink: 0;
        }

        .ac-ring {
          position: absolute;
          inset: 0;

          width: 100%;
          height: 100%;
        }

        .ac-face {
          position: absolute;

          top: 10px;
          left: 10px;

          width: ${clockSize}px;
          height: ${clockSize}px;

          border-radius: 50%;

          background: #fffdf8;

          border: 2px solid #3d3830;

          box-shadow:
            inset 0 2px 8px rgba(26,23,20,0.06),
            0 0 0 4px #f0ebe0,
            0 0 0 6px #3d3830;
        }

        .ac-inner {
          position: absolute;

          top: 10px;
          left: 10px;

          width: ${clockSize}px;
          height: ${clockSize}px;
        }

        .ac-dot {
          position: absolute;

          top: 50%;
          left: 50%;

          width: ${dotSize}px;
          height: ${dotSize}px;

          border-radius: 50%;

          background: #1a1714;

          transform: translate(-50%, -50%);

          z-index: 10;
        }

        .ac-hand {
          position: absolute;

          left: 50%;
          bottom: 50%;

          transform-origin: bottom center;

          border-radius: 999px;
        }

        .ac-hour {
          width: ${Math.max(clockSize * 0.025, 2)}px;
          height: ${hourHeight}px;

          margin-left: -${Math.max(
            clockSize * 0.0125,
            1
          )}px;

          background: #1a1714;
        }

        .ac-minute {
          width: ${Math.max(clockSize * 0.018, 1.5)}px;
          height: ${minuteHeight}px;

          margin-left: -${Math.max(
            clockSize * 0.009,
            0.75
          )}px;

          background: #3d3830;
        }

        .ac-second {
          width: ${Math.max(clockSize * 0.01, 1)}px;
          height: ${secondHeight}px;

          margin-left: -${Math.max(
            clockSize * 0.005,
            0.5
          )}px;

          background: #c9a84c;
        }

        .ac-tail {
          position: absolute;

          top: 50%;
          left: 50%;

          width: ${Math.max(clockSize * 0.01, 1)}px;
          height: ${tailHeight}px;

          margin-left: -${Math.max(
            clockSize * 0.005,
            0.5
          )}px;

          background: #c9a84c;

          transform-origin: top center;

          border-radius: 999px;
        }

        .ac-roman {
          position: absolute;

          font-family: 'Playfair Display', serif;

          font-size: ${numeralSize}px;
          font-weight: 600;

          color: #3d3830;

          line-height: 1;
          text-align: center;

          transform: translate(-50%, -50%);

          white-space: nowrap;

          letter-spacing: -0.03em;

          pointer-events: none;
        }

        .ac-divider {
          width: 80%;
          height: 1px;

          background: #e2d9cc;

          margin:
            clamp(0.6rem, 1.5vw, 0.9rem)
            0
            clamp(0.45rem, 1vw, 0.7rem);
        }

        .ac-cd-block {
          width: 100%;

          display: flex;
          flex-direction: column;
          align-items: center;

          gap: 2px;
        }

        .ac-cd-top {
          font-size: clamp(0.5rem, 1.8vw, 0.7rem);

          color: #7a7468;

          letter-spacing: 0.08em;
          text-transform: uppercase;

          text-align: center;
        }

        .ac-cd-nums {
          display: flex;
          align-items: baseline;
          justify-content: center;

          gap: 2px;

          width: 100%;

          flex-wrap: nowrap;

          font-family: 'Playfair Display', serif;
        }

        .ac-cd-col {
          display: flex;
          flex-direction: column;
          align-items: center;

          min-width: 0;
        }

        .ac-cd-val {
          font-size: clamp(0.85rem, 4vw, 1.35rem);

          font-weight: 700;

          color: #1a1714;

          letter-spacing: -0.04em;

          text-align: center;
        }

        .ac-cd-sep {
          font-size: clamp(0.7rem, 3vw, 1rem);

          color: #c9a84c;

          margin: 0 1px;
        }

        .ac-cd-unit {
          font-size: clamp(0.42rem, 1.5vw, 0.62rem);

          color: #7a7468;

          text-transform: uppercase;

          letter-spacing: 0.06em;
        }

        .ac-deadline-sub {
          margin-top: 3px;

          font-size: clamp(0.45rem, 1.5vw, 0.65rem);

          color: #c9a84c;

          font-style: italic;

          letter-spacing: 0.04em;

          text-align: center;

          font-family: 'Playfair Display', serif;
        }
      `}</style>

      <div className="ac-root">
        <div className="ac-svg-wrap">
          <svg
            className="ac-ring"
            viewBox="0 0 180 180"
            fill="none"
          >
            <circle
              cx="90"
              cy="90"
              r="86"
              stroke="#e2d9cc"
              strokeWidth="4"
            />

            <circle
              ref={arcRef}
              cx="90"
              cy="90"
              r="86"
              stroke="#c9a84c"
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray={ARC_FULL}
              strokeDashoffset={ARC_FULL}
              transform="rotate(-90 90 90)"
            />

            {Array.from({ length: 60 }, (_, i) => {
              const angle = (i / 60) * 360;

              const rad =
                ((angle - 90) * Math.PI) / 180;

              const isMaj = i % 5 === 0;

              const outerR = 70;

              const innerR =
                outerR - (isMaj ? 8 : 4);

              const x1 = round(
                90 + outerR * Math.cos(rad)
              );

              const y1 = round(
                90 + outerR * Math.sin(rad)
              );

              const x2 = round(
                90 + innerR * Math.cos(rad)
              );

              const y2 = round(
                90 + innerR * Math.sin(rad)
              );

              return (
                <line
                  key={i}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke={
                    isMaj ? "#3d3830" : "#c8bfb4"
                  }
                  strokeWidth={isMaj ? 1.4 : 0.7}
                />
              );
            })}
          </svg>

          <div className="ac-face" />

          <div className="ac-inner">
            <div className="ac-dot" />

            <div
              ref={hourRef}
              className="ac-hand ac-hour"
            />

            <div
              ref={minuteRef}
              className="ac-hand ac-minute"
            />

            <div
              ref={secondRef}
              className="ac-hand ac-second"
            />

            <div
              ref={tailRef}
              className="ac-tail"
            />

            {ROMAN.map((r, i) => {
              const rad =
                ((i / 12) * 360 - 90) *
                (Math.PI / 180);

              const x = round(
                center +
                  romanRadius *
                    Math.cos(rad)
              );

              const y = round(
                center +
                  romanRadius *
                    Math.sin(rad)
              );

              return (
                <div
                  key={r}
                  className="ac-roman"
                  style={{
                    left: `${x}px`,
                    top: `${y}px`,
                  }}
                >
                  {r}
                </div>
              );
            })}
          </div>
        </div>

        <div className="ac-divider" />

        <div className="ac-cd-block">
          <div className="ac-cd-top">
            Time until deadline
          </div>

          <div className="ac-cd-nums">
            <div className="ac-cd-col">
              <span
                ref={daysRef}
                className="ac-cd-val"
              >
                --
              </span>

              <span className="ac-cd-unit">
                days
              </span>
            </div>

            <span className="ac-cd-sep">:</span>

            <div className="ac-cd-col">
              <span
                ref={hrsRef}
                className="ac-cd-val"
              >
                --
              </span>

              <span className="ac-cd-unit">
                hrs
              </span>
            </div>

            <span className="ac-cd-sep">:</span>

            <div className="ac-cd-col">
              <span
                ref={minsRef}
                className="ac-cd-val"
              >
                --
              </span>

              <span className="ac-cd-unit">
                min
              </span>
            </div>

            <span className="ac-cd-sep">:</span>

            <div className="ac-cd-col">
              <span
                ref={secsRef}
                className="ac-cd-val"
              >
                --
              </span>

              <span className="ac-cd-unit">
                sec
              </span>
            </div>
          </div>

          <div className="ac-deadline-sub">
            Aug 15, 2026 · Last date
          </div>
        </div>
      </div>
    </>
  );
}