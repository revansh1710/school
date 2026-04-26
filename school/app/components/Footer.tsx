export default function Footer() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;600&family=DM+Sans:wght@300;400;500&display=swap');

        .footer-root {
          font-family: 'DM Sans', sans-serif;
          background-color: #1A1410;
          position: relative;
          overflow: hidden;
        }

        .footer-root::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, #C4A484 30%, #8B6E52 60%, transparent);
        }

        .footer-root::after {
          content: '';
          position: absolute;
          inset: 0;
          background-image:
            radial-gradient(circle at 5% 50%, rgba(196, 164, 132, 0.06) 0%, transparent 45%),
            radial-gradient(circle at 95% 20%, rgba(139, 110, 82, 0.05) 0%, transparent 40%);
          pointer-events: none;
        }

        .footer-noise {
          position: absolute;
          inset: 0;
          opacity: 0.03;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
          pointer-events: none;
        }

        .footer-inner {
          position: relative;
          z-index: 1;
          max-width: 1100px;
          margin: 0 auto;
          padding: 5rem 1.5rem 3.5rem;
        }

        .footer-grid {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr;
          gap: 4rem;
          align-items: start;
        }

        @media (max-width: 768px) {
          .footer-grid {
            grid-template-columns: 1fr 1fr;
          }
          .footer-brand-col {
            grid-column: 1 / -1;
          }
        }

        @media (max-width: 480px) {
          .footer-grid {
            grid-template-columns: 1fr;
          }
          .footer-brand-col {
            grid-column: auto;
          }
        }

        .accent-dot {
          display: inline-block;
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: #C4A484;
          margin-bottom: 1.25rem;
        }

        .footer-brand {
          font-family: 'Cormorant Garamond', serif;
          font-size: 2rem;
          font-weight: 300;
          color: #FAF8F5;
          letter-spacing: 0.02em;
          line-height: 1;
          margin-bottom: 1rem;
        }

        .footer-brand span {
          color: #C4A484;
        }

        .footer-desc {
          font-size: 0.855rem;
          line-height: 1.85;
          color: #6B5E56;
          font-weight: 300;
          max-width: 300px;
          margin-bottom: 2rem;
        }

        .footer-socials {
          display: flex;
          gap: 1.25rem;
        }

        .footer-socials a {
          font-size: 0.65rem;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: #4A3E38;
          text-decoration: none;
          transition: color 0.25s ease;
          position: relative;
          padding-bottom: 2px;
        }

        .footer-socials a::after {
          content: '';
          position: absolute;
          bottom: 0; left: 0;
          width: 0;
          height: 1px;
          background: #C4A484;
          transition: width 0.25s ease;
        }

        .footer-socials a:hover {
          color: #C4A484;
        }

        .footer-socials a:hover::after {
          width: 100%;
        }

        .footer-col-title {
          font-size: 0.62rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #C4A484;
          font-weight: 500;
          margin-bottom: 1.5rem;
        }

        .footer-links {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .footer-links a {
          color: #6B5E56;
          text-decoration: none;
          font-size: 0.875rem;
          font-weight: 300;
          display: inline-flex;
          align-items: center;
          transition: color 0.25s ease, gap 0.25s ease;
          gap: 0;
        }

        .footer-links a::before {
          content: '—';
          font-size: 0.65rem;
          color: #C4A484;
          opacity: 0;
          max-width: 0;
          overflow: hidden;
          transition: opacity 0.25s ease, max-width 0.25s ease, margin-right 0.25s ease;
          margin-right: 0;
        }

        .footer-links a:hover {
          color: #FAF8F5;
          gap: 0.5rem;
        }

        .footer-links a:hover::before {
          opacity: 1;
          max-width: 20px;
          margin-right: 0.4rem;
        }

        .footer-contact-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 1.1rem;
        }

        .footer-contact-list li {
          font-size: 0.855rem;
          font-weight: 300;
          color: #6B5E56;
          line-height: 1.5;
        }

        .footer-contact-list li strong {
          display: block;
          font-size: 0.6rem;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: #4A3E38;
          font-weight: 500;
          margin-bottom: 0.2rem;
        }

        .footer-divider {
          position: relative;
          z-index: 1;
          height: 1px;
          background: rgba(196, 164, 132, 0.1);
          max-width: 1100px;
          margin: 0 auto;
        }

        .footer-bottom {
          position: relative;
          z-index: 1;
          max-width: 1100px;
          margin: 0 auto;
          padding: 1.5rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .footer-copy {
          font-size: 0.72rem;
          color: #3E3530;
          font-weight: 300;
          letter-spacing: 0.06em;
        }

        .footer-bottom-links {
          display: flex;
          gap: 1.5rem;
        }

        .footer-bottom-links a {
          font-size: 0.65rem;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #3E3530;
          text-decoration: none;
          transition: color 0.25s ease;
        }

        .footer-bottom-links a:hover {
          color: #C4A484;
        }
      `}</style>

      <footer className="footer-root">
        <div className="footer-noise" />

        <div className="footer-inner">
          <div className="footer-grid">

            {/* Brand Col */}
            <div className="footer-brand-col">
              <div className="accent-dot" />
              <div className="footer-brand">School<span>.</span></div>
              <p className="footer-desc">
                Providing quality education and nurturing future leaders through
                academic excellence and holistic development.
              </p>
              <div className="footer-socials">
                <a href="#">Facebook</a>
                <a href="#">Instagram</a>
                <a href="#">Twitter</a>
                
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <p className="footer-col-title">Quick Links</p>
              <ul className="footer-links">
                <li><a href="/#about">About</a></li>
                <li><a href="/#academics">Academics</a></li>
                <li><a href="/admissions">Admissions</a></li>
                <li><a href="/#contact">Contact</a></li>
                <li><a href="/gallery">Gallery</a></li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <p className="footer-col-title">Contact</p>
              <ul className="footer-contact-list">
                <li>
                  <strong>Address</strong>
                  123 Education Street, Hyderabad
                </li>
                <li>
                  <strong>Phone</strong>
                  +91 98765 43210
                </li>
                <li>
                  <strong>Email</strong>
                  info@school.edu
                </li>
              </ul>
            </div>

          </div>
        </div>

        <div className="footer-divider" />

        <div className="mt-8 pt-5 border-t border-neutral-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">

          <p className="text-[12px] text-neutral-500 tracking-wide">
            © {new Date().getFullYear()} School. All rights reserved.
          </p>

          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase tracking-[0.18em] font-semibold text-amber-600">
              Media Credits
            </span>

            <a
              href="/credits"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[12px] text-neutral-600 border-b border-amber-300/60 pb-px transition-colors duration-200 hover:text-red-950 hover:border-amber-500"
            >
              View sources & acknowledgements
            </a>
          </div>

        </div>
      </footer>
    </>
  );
}