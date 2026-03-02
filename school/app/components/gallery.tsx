'use client';
import { useState } from "react";

// ─── Interfaces ───────────────────────────────────────────────────────────────

export interface Gallery {
  _id: string;
  title: string;
  images: GalleryImage[];
}

export interface GalleryImage {
  url: string;
  alt?: string;
  caption?: string;
  metadata?: {
    lqip?: string;
    dimensions?: {
      width: number;
      height: number;
    };
  };
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

type Size = "large" | "medium" | "small";

/** Cycles through a visual pattern so the grid always looks composed */
function getSize(index: number): Size {
  const pattern: Size[] = ["large", "small", "small", "medium", "medium", "large"];
  return pattern[index % pattern.length];
}

// ─── GallerySection ───────────────────────────────────────────────────────────

interface GallerySectionProps {
  gallery: Gallery;
}

export default function GallerySection({ gallery }: GallerySectionProps) {
  const [lightbox, setLightbox] = useState<GalleryImage | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const openLightbox = (img: GalleryImage, i: number) => {
    setLightbox(img);
    setLightboxIndex(i);
  };

  const closeLightbox = () => setLightbox(null);

  const navigateLightbox = (dir: 1 | -1) => {
    const next = (lightboxIndex + dir + gallery.images.length) % gallery.images.length;
    setLightbox(gallery.images[next]);
    setLightboxIndex(next);
  };

  // Split gallery title for the hollow-text hero treatment
  const words = gallery.title.trim().split(/\s+/);
  const line1 = words.slice(0, Math.ceil(words.length / 2)).join(" ").toUpperCase();
  const line2 = words.slice(Math.ceil(words.length / 2)).join(" ").toUpperCase();

  return (
    <section id='gallery'>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .g-root {
          background: #080808;
          min-height: 100vh;
          font-family: 'DM Sans', sans-serif;
          color: #f0ede6;
          padding: 80px 40px;
          position: relative;
          overflow: hidden;
        }

        .g-root::before {
          content: '';
          position: fixed;
          inset: 0;
          background:
            radial-gradient(ellipse 80% 50% at 20% 20%, rgba(255,80,30,0.06) 0%, transparent 60%),
            radial-gradient(ellipse 60% 40% at 80% 80%, rgba(50,120,255,0.06) 0%, transparent 60%);
          pointer-events: none;
          z-index: 0;
        }

        .g-grain {
          position: fixed;
          inset: 0;
          opacity: 0.035;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
          pointer-events: none;
          z-index: 200;
        }

        /* ── Header ── */
        .g-header {
          max-width: 1300px;
          margin: 0 auto 64px;
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 24px;
          flex-wrap: wrap;
          position: relative;
          z-index: 1;
        }

        .g-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(240,237,230,0.06);
          border: 1px solid rgba(240,237,230,0.1);
          border-radius: 100px;
          padding: 6px 14px;
          font-size: 11px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: rgba(240,237,230,0.4);
          margin-bottom: 16px;
        }
        .g-badge strong { color: #f0ede6; font-weight: 500; }

        .g-title {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(72px, 10vw, 140px);
          line-height: 0.9;
          letter-spacing: -0.02em;
          color: #f0ede6;
        }
        .g-title .hollow {
          -webkit-text-stroke: 1px rgba(240,237,230,0.25);
          color: transparent;
        }

        .g-subtitle {
          font-size: 13px;
          font-weight: 300;
          color: rgba(240,237,230,0.4);
          letter-spacing: 0.08em;
          text-transform: uppercase;
          max-width: 200px;
          line-height: 1.7;
        }

        /* ── Grid ── */
        .g-grid {
          max-width: 1300px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: repeat(12, 1fr);
          grid-auto-rows: 140px;
          gap: 12px;
          position: relative;
          z-index: 1;
        }

        .g-item {
          position: relative;
          overflow: hidden;
          border-radius: 6px;
          cursor: pointer;
          background: #111;
        }

        .g-item.large  { grid-column: span 7; grid-row: span 4; }
        .g-item.medium { grid-column: span 5; grid-row: span 3; }
        .g-item.small  { grid-column: span 5; grid-row: span 2; }

        @media (max-width: 900px) {
          .g-item.large,
          .g-item.medium,
          .g-item.small {
            grid-column: span 12;
            grid-row: span 2;
          }
        }

        /* LQIP blur placeholder */
        .g-lqip {
          position: absolute;
          inset: 0;
          background-size: cover;
          background-position: center;
          filter: blur(14px);
          transform: scale(1.06);
          transition: opacity 0.6s ease;
          z-index: 1;
        }
        .g-lqip.done { opacity: 0; pointer-events: none; }

        .g-img {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          transition: transform 0.7s cubic-bezier(0.25,0.46,0.45,0.94), filter 0.5s ease;
          filter: saturate(0.85) brightness(0.9);
          z-index: 2;
        }
        .g-item:hover .g-img {
          transform: scale(1.06);
          filter: saturate(1.1) brightness(1);
        }

        /* Overlay */
        .g-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(8,8,8,0.88) 0%, rgba(8,8,8,0.18) 50%, transparent 100%);
          opacity: 0;
          transition: opacity 0.4s ease;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          padding: 24px;
          z-index: 3;
        }
        .g-item:hover .g-overlay { opacity: 1; }

        .g-caption {
          font-size: 10px;
          font-weight: 500;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: rgba(240,237,230,0.5);
          margin-bottom: 6px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .g-alt {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 28px;
          letter-spacing: 0.02em;
          color: #f0ede6;
          line-height: 1;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .g-arrow {
          position: absolute;
          top: 20px; right: 20px;
          width: 36px; height: 36px;
          border: 1px solid rgba(240,237,230,0.4);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #f0ede6;
          font-size: 14px;
          transform: rotate(-45deg) scale(0.6);
          opacity: 0;
          transition: all 0.35s ease;
          z-index: 4;
        }
        .g-item:hover .g-arrow { opacity: 1; transform: rotate(0deg) scale(1); }

        .g-num {
          position: absolute;
          top: 16px; left: 20px;
          font-size: 10px;
          font-weight: 500;
          letter-spacing: 0.12em;
          color: rgba(240,237,230,0.3);
          z-index: 4;
        }

        /* ── Lightbox ── */
        .lb-bg {
          position: fixed;
          inset: 0;
          background: rgba(4,4,4,0.95);
          backdrop-filter: blur(20px);
          z-index: 1000;
          display: flex;
          align-items: center;
          justify-content: center;
          animation: lbFade 0.3s ease;
        }
        @keyframes lbFade { from { opacity: 0; } to { opacity: 1; } }

        .lb-inner {
          position: relative;
          max-width: 90vw;
          max-height: 85vh;
          animation: lbScale 0.4s cubic-bezier(0.34,1.56,0.64,1);
        }
        @keyframes lbScale {
          from { transform: scale(0.88); opacity: 0; }
          to   { transform: scale(1);    opacity: 1; }
        }

        .lb-inner img {
          max-width: 90vw;
          max-height: 72vh;
          object-fit: contain;
          display: block;
          border-radius: 8px;
        }

        .lb-info {
          display: flex;
          align-items: baseline;
          gap: 14px;
          padding: 18px 4px 0;
        }
        .lb-alt {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 34px;
          letter-spacing: 0.02em;
          color: #f0ede6;
        }
        .lb-caption {
          font-size: 11px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: rgba(240,237,230,0.35);
          font-weight: 400;
        }

        .lb-close {
          position: fixed;
          top: 28px; right: 32px;
          background: none;
          border: 1px solid rgba(240,237,230,0.2);
          color: rgba(240,237,230,0.6);
          font-family: 'DM Sans', sans-serif;
          font-size: 11px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          padding: 10px 18px;
          border-radius: 100px;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .lb-close:hover { background: rgba(240,237,230,0.08); color: #f0ede6; }

        .lb-nav {
          position: fixed;
          top: 50%; transform: translateY(-50%);
          background: none;
          border: 1px solid rgba(240,237,230,0.18);
          color: rgba(240,237,230,0.6);
          width: 44px; height: 44px;
          border-radius: 50%;
          font-size: 18px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
        }
        .lb-nav:hover { background: rgba(240,237,230,0.08); color: #f0ede6; border-color: rgba(240,237,230,0.4); }
        .lb-nav.prev { left: 24px; }
        .lb-nav.next { right: 24px; }

        .lb-counter {
          position: fixed;
          bottom: 28px;
          left: 50%; transform: translateX(-50%);
          font-size: 11px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: rgba(240,237,230,0.3);
        }
        .lb-counter strong { color: rgba(240,237,230,0.7); font-weight: 500; }
      `}</style>

      <div className="g-root">
        <div className="g-grain" />

        {/* ── Header ── */}
        <div className="g-header">
          <h1 className='text-5xl'>Best Moments captured</h1>
        </div>

        {/* ── Grid ── */}
        <div className="g-grid">
          {gallery.images.map((img, i) => (
            <GalleryCard
              key={`${gallery._id}-${i}`}
              img={img}
              index={i}
              size={getSize(i)}
              onClick={() => openLightbox(img, i)}
            />
          ))}
        </div>
      </div>

      {/* ── Lightbox ── */}
      {lightbox && (
        <div className="lb-bg" onClick={closeLightbox}>
          <div className="lb-inner" onClick={(e) => e.stopPropagation()}>
            <img src={lightbox.url} alt={lightbox.alt ?? ""} />
            <div className="lb-info">
              {lightbox.alt     && <span className="lb-alt">{lightbox.alt}</span>}
              {lightbox.caption && <span className="lb-caption">{lightbox.caption}</span>}
            </div>
          </div>

          <button className="lb-close" onClick={closeLightbox}>Close</button>

          {gallery.images.length > 1 && (
            <>
              <button className="lb-nav prev" onClick={(e) => { e.stopPropagation(); navigateLightbox(-1); }}>←</button>
              <button className="lb-nav next" onClick={(e) => { e.stopPropagation(); navigateLightbox(1);  }}>→</button>
              <div className="lb-counter">
                <strong>{lightboxIndex + 1}</strong> / {gallery.images.length}
              </div>
            </>
          )}
        </div>
      )}
    </section>
  );
}

// ─── GalleryCard ──────────────────────────────────────────────────────────────

function GalleryCard({
  img,
  index,
  size,
  onClick,
}: {
  img: GalleryImage;
  index: number;
  size: Size;
  onClick: () => void;
}) {
  const [loaded, setLoaded] = useState(false);
  const num = String(index + 1).padStart(2, "0");

  return (
    <div className={`g-item ${size}`} onClick={onClick}>
      <span className="g-num">{num}</span>

      {/* LQIP blur-up placeholder */}
      {img.metadata?.lqip && (
        <div
          className={`g-lqip${loaded ? " done" : ""}`}
          style={{ backgroundImage: `url(${img.metadata.lqip})` }}
        />
      )}

      <img
        className="g-img"
        src={img.url}
        alt={img.alt ?? ""}
        loading="lazy"
        onLoad={() => setLoaded(true)}
      />

      <div className="g-overlay">
        {img.caption && <span className="g-caption">{img.caption}</span>}
        {img.alt     && <span className="g-alt">{img.alt}</span>}
      </div>

      <div className="g-arrow">↗</div>
    </div>
  );
}