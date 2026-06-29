'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

type HeaderProps = {
    user?: { id: string; email: string; parentName?: string | null; role?: string } | null;
};

export default function Header({ user }: HeaderProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [doorsOpen, setDoorsOpen] = useState(false);
    const [contentVisible, setContentVisible] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    const navLinks = [
        { label: 'About',      href: '/#about',     icon: '🏛️' },
        { label: 'Academics',  href: '/#academics',  icon: '📚' },
        { label: 'Admissions', href: '/admissions',  icon: '🎓' },
        { label: 'Contact',    href: '/#contact',    icon: '📬' },
        { label: 'Gallery',    href: '/gallery',     icon: '🖼️' },
        { label: 'Careers',    href: '/careers',     icon: '💼' },
    ];

    const openMenu = () => {
        setIsOpen(true);
        requestAnimationFrame(() => {
            requestAnimationFrame(() => setDoorsOpen(true));
        });
        setTimeout(() => setContentVisible(true), 700);
    };

    const closeMenu = () => {
        setContentVisible(false);
        setDoorsOpen(false);
        setTimeout(() => setIsOpen(false), 900);
    };

    useEffect(() => {
        document.body.style.overflow = isOpen ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [isOpen]);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 10);
        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    const initials = user?.parentName
        ? user.parentName.substring(0, 2).toUpperCase()
        : user?.email?.substring(0, 2).toUpperCase() || 'PR';

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700&family=Outfit:wght@400;500;600&display=swap');

                /* ── Design Tokens ── */
                :root {
                    --h-green:      #1C3A2F;
                    --h-green-mid:  #2A5240;
                    --h-green-lite: #3D7A5E;
                    --h-sage:       #7AAF94;
                    --h-sage-dim:   rgba(122,175,148,0.18);
                    --h-ivory:      #F5F0E8;
                    --h-ivory-dim:  #EDE7D9;
                    --h-ink:        #111C17;
                    --h-serif:      'Cormorant Garamond', Georgia, serif;
                    --h-sans:       'Outfit', sans-serif;
                    --h-nav-h:      68px;
                }

                /* ════════════════════════
                   NAVBAR BASE
                ════════════════════════ */
                .hdr-root {
                    position: fixed;
                    top: 0; left: 0; right: 0;
                    height: var(--h-nav-h);
                    z-index: 50;
                    font-family: var(--h-sans);
                }

                /* Glass layer */
                .hdr-glass {
                    position: absolute; inset: 0;
                    background: var(--h-ivory);
                    border-bottom: 1px solid transparent;
                    transition: border-color 0.35s ease, box-shadow 0.35s ease, background 0.35s ease;
                }
                .hdr-root.scrolled .hdr-glass {
                    background: rgba(245,240,232,0.94);
                    border-color: rgba(28,58,47,0.10);
                    box-shadow: 0 1px 0 rgba(28,58,47,0.06), 0 8px 32px rgba(28,58,47,0.07);
                    backdrop-filter: blur(14px);
                }

                /* Inner layout */
                .hdr-inner {
                    position: relative; z-index: 1;
                    max-width: 1280px;
                    margin: 0 auto;
                    height: 100%;
                    padding: 0 2rem;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: 1.5rem;
                }

                /* ── Logo ── */
                .hdr-logo {
                    display: flex; align-items: center; gap: 10px;
                    text-decoration: none; flex-shrink: 0;
                }
                .hdr-logo-crest {
                    width: 40px; height: 40px;
                    background: var(--h-green);
                    border-radius: 7px;
                    display: flex; align-items: center; justify-content: center;
                    transition: background 0.2s;
                }
                .hdr-logo:hover .hdr-logo-crest { background: var(--h-green-lite); }
                .hdr-logo-crest svg { width: 20px; height: 20px; fill: var(--h-sage); }
                .hdr-logo-text { line-height: 1.1; }
                .hdr-logo-text strong {
                    display: block;
                    font-family: var(--h-serif);
                    font-size: 1.1rem; font-weight: 700;
                    color: var(--h-green);
                    letter-spacing: 0.015em;
                }
                .hdr-logo-text span {
                    font-size: 0.57rem;
                    letter-spacing: 0.2em;
                    text-transform: uppercase;
                    color: var(--h-sage);
                    font-weight: 500;
                }

                /* ── Desktop nav links ── */
                .hdr-nav {
                    display: flex; align-items: center;
                    gap: 0.2rem;
                    list-style: none;
                    position: absolute; left: 50%; transform: translateX(-50%);
                }
                .hdr-nav-link {
                    font-size: 0.8rem; font-weight: 500;
                    color: var(--h-ink);
                    text-decoration: none;
                    letter-spacing: 0.025em;
                    padding: 0.38rem 0.75rem;
                    border-radius: 5px;
                    opacity: 0.72;
                    transition: opacity 0.2s, background 0.2s, color 0.2s;
                    position: relative;
                }
                .hdr-nav-link::after {
                    content: '';
                    position: absolute; bottom: 4px; left: 50%; right: 50%;
                    height: 1.5px; background: var(--h-sage);
                    border-radius: 2px;
                    transition: left 0.25s ease, right 0.25s ease;
                }
                .hdr-nav-link:hover { opacity: 1; color: var(--h-green); }
                .hdr-nav-link:hover::after { left: 0.75rem; right: 0.75rem; }

                /* ── Enquire button (desktop) ── */
                .hdr-cta {
                    display: flex; align-items: center; gap: 6px;
                    background: var(--h-green);
                    color: #fff;
                    padding: 0.48rem 1.05rem;
                    border-radius: 6px;
                    font-size: 0.74rem; font-weight: 600;
                    letter-spacing: 0.07em; text-transform: uppercase;
                    text-decoration: none; white-space: nowrap;
                    transition: background 0.2s, transform 0.15s;
                    flex-shrink: 0;
                }
                .hdr-cta:hover { background: var(--h-green-lite); transform: translateY(-1px); }
                .hdr-cta svg { width: 12px; height: 12px; }

                /* ── Desktop right slot ── */
                .hdr-right {
                    display: flex; align-items: center; gap: 10px;
                    flex-shrink: 0;
                }

                /* ── Hamburger (mobile) ── */
                .hdr-burger {
                    display: none;
                    background: none; border: none; cursor: pointer;
                    padding: 6px;
                    color: var(--h-green);
                    border-radius: 6px;
                    transition: background 0.2s;
                }
                .hdr-burger:hover { background: var(--h-sage-dim); }
                .hdr-burger svg { display: block; width: 22px; height: 22px; }

                /* ════════════════════════
                   POKÉBALL AVATAR
                ════════════════════════ */
                @keyframes hdr-rollIn {
                    0%   { transform: translateX(200px) rotate(0deg);   opacity: 0; }
                    60%  { transform: translateX(-10px) rotate(400deg); opacity: 1; }
                    75%  { transform: translateX(4px)   rotate(420deg); }
                    100% { transform: translateX(0)     rotate(420deg); }
                }
                @keyframes hdr-openTop {
                    0%,60% { transform: translateY(0) rotate(0deg);   opacity: 1; }
                    80%    { transform: translateY(-22px) rotate(-20deg); opacity: .9; }
                    100%   { transform: translateY(-28px) rotate(-25deg); opacity: 0; }
                }
                @keyframes hdr-openBottom {
                    0%,60% { transform: translateY(0); }
                    80%    { transform: translateY(10px); }
                    100%   { transform: translateY(14px); }
                }
                @keyframes hdr-revealInitials {
                    0%,65% { opacity: 0; transform: scale(0.3); }
                    80%    { opacity: 1; transform: scale(1.15); }
                    100%   { opacity: 1; transform: scale(1); }
                }

                .pokeball-avatar {
                    position: relative;
                    display: flex; align-items: center; justify-content: center;
                    width: 40px; height: 40px;
                    border-radius: 50%;
                    overflow: hidden;
                    cursor: pointer; text-decoration: none;
                    animation: hdr-rollIn 0.9s cubic-bezier(0.22,1,0.36,1) forwards;
                    transition: transform 0.2s ease, box-shadow 0.2s;
                    flex-shrink: 0;
                    background: #e63946;
                    box-shadow: 0 2px 12px rgba(230,57,70,0.35);
                }
                .pokeball-avatar:hover  { transform: scale(1.1) !important; box-shadow: 0 4px 18px rgba(230,57,70,0.45); }
                .pokeball-avatar:active { transform: scale(0.95) !important; }

                .pb-top {
                    position: absolute; top: 0; left: 0; right: 0; height: 50%;
                    background: #e63946;
                    animation: hdr-openTop 0.5s ease-out 0.85s forwards;
                }
                .pb-top::after {
                    content: ''; position: absolute; top: 6px; left: 8px;
                    width: 10px; height: 5px;
                    background: rgba(255,255,255,0.35); border-radius: 50%;
                    transform: rotate(-30deg);
                }
                .pb-bottom {
                    position: absolute; bottom: 0; left: 0; right: 0; height: 50%;
                    background: #f1f1f1;
                    animation: hdr-openBottom 0.5s ease-out 0.85s forwards;
                }
                .pb-band {
                    position: absolute; top: 50%; left: 0; right: 0;
                    transform: translateY(-50%); height: 5px;
                    background: #1a1a1a; z-index: 3;
                }
                .pb-button {
                    position: absolute; top: 50%; left: 50%;
                    transform: translate(-50%, -50%);
                    width: 11px; height: 11px; border-radius: 50%;
                    background: #fff; border: 2.5px solid #1a1a1a; z-index: 4;
                }
                .pb-button::after {
                    content: ''; position: absolute; inset: 2px;
                    border-radius: 50%; background: #f1f1f1;
                }
                .pb-initials {
                    position: absolute; z-index: 10;
                    color: #fff; font-size: 11px; font-weight: 700;
                    letter-spacing: 0.5px;
                    text-shadow: 0 1px 4px rgba(0,0,0,0.8);
                    animation: hdr-revealInitials 0.4s ease-out 1.1s both;
                    opacity: 0;
                }

                /* Mobile pokéball pill */
                .pokeball-avatar-mobile {
                    width: 100%; height: 52px;
                    border-radius: 10px;
                    overflow: hidden;
                    animation: none;
                    box-shadow: 0 2px 12px rgba(230,57,70,0.3);
                }
                .pokeball-avatar-mobile .pb-top  { animation: none; background: #e63946; }
                .pokeball-avatar-mobile .pb-bottom { animation: none; }
                .pokeball-avatar-mobile .pb-initials {
                    animation: none; opacity: 1; font-size: 14px;
                    color: #ffd700; text-shadow: 0 1px 4px rgba(0,0,0,0.6);
                }

                /* ════════════════════════
                   HELICOPTER LOGIN
                ════════════════════════ */
                @keyframes hdr-heliIn {
                    0%   { right: -220px; }
                    60%  { right: 12px; }
                    75%  { right: 6px; }
                    100% { right: 8px; }
                }
                @keyframes hdr-rotorSpin {
                    from { transform: translateX(-50%) rotate(0deg); }
                    to   { transform: translateX(-50%) rotate(360deg); }
                }
                @keyframes hdr-tailSpin {
                    from { transform: translateY(calc(-50% - 1px)) rotate(0deg); }
                    to   { transform: translateY(calc(-50% - 1px)) rotate(360deg); }
                }
                @keyframes hdr-bannerSway {
                    from { transform: rotate(-2deg); }
                    to   { transform: rotate(2deg); }
                }
                @keyframes hdr-ribbonWave {
                    from { transform: rotate(-4deg) scaleX(0.95); }
                    to   { transform: rotate(4deg) scaleX(1.05); }
                }
                @keyframes hdr-bowBob {
                    from { transform: translateY(-1px); }
                    to   { transform: translateY(1px); }
                }

                .heli-scene {
                    position: relative; width: 190px; height: 40px;
                    overflow: hidden; cursor: pointer; text-decoration: none;
                }
                .heli-wrapper {
                    position: absolute; right: -220px; top: 50%;
                    transform: translateY(-50%);
                    display: flex; align-items: center;
                    animation: hdr-heliIn 1.4s cubic-bezier(0.22,1,0.36,1) 0.2s forwards;
                }
                .heli-body { position: relative; width: 60px; height: 34px; flex-shrink: 0; }
                .heli-rotor-mast {
                    position: absolute; top: -6px; left: 50%;
                    transform: translateX(-50%);
                    width: 3px; height: 7px; background: #374151; border-radius: 1px;
                }
                .heli-rotor-top {
                    position: absolute; top: -10px; left: 50%;
                    width: 52px; height: 4px; border-radius: 2px;
                    background: var(--h-green);
                    transform-origin: center center;
                    animation: hdr-rotorSpin 0.3s linear infinite;
                }
                .heli-cabin {
                    position: absolute; bottom: 4px; left: 0; right: 0; top: 6px;
                    background: var(--h-green-mid);
                    border-radius: 14px 6px 6px 14px;
                }
                .heli-window {
                    position: absolute; top: 5px; left: 8px;
                    width: 13px; height: 9px;
                    background: rgba(122,175,148,0.55);
                    border-radius: 4px 4px 3px 3px;
                    border: 1px solid var(--h-sage);
                }
                .heli-tail {
                    position: absolute; right: -19px; top: 50%;
                    transform: translateY(-50%) translateY(-1px);
                    width: 21px; height: 5px;
                    background: var(--h-green); border-radius: 0 3px 3px 0;
                }
                .heli-tail-rotor {
                    position: absolute; right: -25px; top: 50%;
                    width: 3px; height: 17px; background: #1a1a2e; border-radius: 2px;
                    animation: hdr-tailSpin 0.25s linear infinite;
                }
                .heli-skid-l { position: absolute; bottom: 0; left: 6px; width: 36px; height: 3px; background: #374151; border-radius: 2px; }
                .heli-skid-r { position: absolute; bottom: 0; right: 9px; width: 20px; height: 3px; background: #374151; border-radius: 2px; }
                .heli-strut-l { position: absolute; bottom: 3px; left: 17px; width: 2px; height: 6px; background: #374151; }
                .heli-strut-r { position: absolute; bottom: 3px; right: 18px; width: 2px; height: 6px; background: #374151; }

                .heli-ribbon { display: flex; align-items: center; margin-left: 4px; }
                .heli-string { width: 20px; height: 2px; background: var(--h-sage); border-radius: 1px; flex-shrink: 0; }
                .heli-bow {
                    width: 9px; height: 9px; background: var(--h-sage);
                    border-radius: 50%; border: 2px solid var(--h-green-lite); flex-shrink: 0;
                    animation: hdr-bowBob 0.6s ease-in-out infinite alternate;
                }
                .heli-string-tail {
                    width: 16px; height: 2px; background: var(--h-sage); border-radius: 1px;
                    animation: hdr-ribbonWave 0.5s ease-in-out infinite alternate;
                    transform-origin: left center;
                }
                .heli-banner {
                    background: rgba(122,175,148,0.12);
                    border: 1.5px solid var(--h-sage);
                    border-radius: 5px; padding: 4px 9px;
                    font-size: 11px; font-weight: 600;
                    color: var(--h-green); white-space: nowrap; margin-left: 2px;
                    animation: hdr-bannerSway 0.7s ease-in-out infinite alternate;
                    transform-origin: left center; letter-spacing: 0.4px;
                    font-family: var(--h-sans);
                }

                /* ════════════════════════
                   MOBILE MENU OVERLAY
                ════════════════════════ */

                /* Door panels — now forest green / ivory palette */
                .mob-door-left {
                    position: absolute; top: 0; bottom: 0; left: 0; width: 50%;
                    background: linear-gradient(150deg, #1C3A2F 0%, #2A5240 50%, #152D24 100%);
                    border-right: 2px solid rgba(122,175,148,0.5);
                    transform-origin: left center;
                    transition: transform 0.9s cubic-bezier(0.77,0,0.175,1);
                }
                .mob-door-right {
                    position: absolute; top: 0; bottom: 0; right: 0; width: 50%;
                    background: linear-gradient(210deg, #1C3A2F 0%, #2A5240 50%, #152D24 100%);
                    border-left: 2px solid rgba(122,175,148,0.5);
                    transform-origin: right center;
                    transition: transform 0.9s cubic-bezier(0.77,0,0.175,1);
                }
                .mob-door-inner-ring {
                    position: absolute; inset: 16px;
                    border: 1px solid rgba(122,175,148,0.25); border-radius: 3px;
                }
                .mob-door-inner-ring2 {
                    position: absolute; inset: 28px;
                    border: 1px solid rgba(122,175,148,0.12); border-radius: 2px;
                }
                .mob-door-ornament {
                    position: absolute; top: 50%;
                    font-size: 1.4rem; opacity: 0.5;
                    transform: translateY(-50%);
                }

                /* Content pane */
                .mob-content {
                    position: absolute; inset: 0;
                    display: flex; flex-direction: column;
                    overflow-y: auto;
                    background: linear-gradient(170deg, var(--h-ivory) 0%, var(--h-ivory-dim) 100%);
                    transition: opacity 0.45s ease, transform 0.45s cubic-bezier(0.34,1.56,0.64,1);
                }

                /* Top accent band */
                .mob-topband {
                    display: flex; align-items: center; justify-content: space-between;
                    padding: 0.9rem 1.4rem;
                    background: var(--h-green);
                    border-bottom: 1px solid rgba(122,175,148,0.25);
                    flex-shrink: 0;
                }
                .mob-topband-label {
                    font-family: var(--h-serif); font-size: 1rem;
                    font-weight: 600; letter-spacing: 0.06em;
                    color: var(--h-sage);
                    transition: opacity 0.4s ease 0.2s, transform 0.4s ease 0.2s;
                }
                .mob-topband-ornaments {
                    display: flex; gap: 8px; align-items: center;
                }
                .mob-topband-dot {
                    width: 6px; height: 6px; border-radius: 50%;
                    background: var(--h-sage); opacity: 0.5;
                }
                .mob-close-btn {
                    width: 30px; height: 30px; border-radius: 50%;
                    display: flex; align-items: center; justify-content: center;
                    background: rgba(122,175,148,0.12);
                    border: 1px solid rgba(122,175,148,0.35);
                    color: var(--h-sage); font-size: 0.75rem;
                    cursor: pointer; transition: background 0.2s;
                }
                .mob-close-btn:hover { background: rgba(122,175,148,0.22); }

                /* Divider rule */
                .mob-rule {
                    display: flex; align-items: center; gap: 8px;
                    padding: 1rem 1.4rem 0.6rem;
                    flex-shrink: 0;
                }
                .mob-rule-line { flex: 1; height: 1px; background: rgba(28,58,47,0.1); }
                .mob-rule-diamond {
                    width: 5px; height: 5px; background: var(--h-sage);
                    transform: rotate(45deg); opacity: 0.55; flex-shrink: 0;
                }

                /* Nav items */
                .mob-nav-list { list-style: none; padding: 0 1.2rem; flex: 1; }
                .mob-nav-item {
                    border-bottom: 1px solid rgba(28,58,47,0.07);
                }
                .mob-nav-link {
                    display: flex; align-items: center; gap: 12px;
                    padding: 0.9rem 0.5rem;
                    text-decoration: none;
                    border-radius: 7px;
                    transition: background 0.2s, padding-left 0.2s;
                }
                .mob-nav-link:hover {
                    background: rgba(122,175,148,0.1);
                    padding-left: 0.9rem;
                }
                .mob-nav-icon {
                    width: 34px; height: 34px; border-radius: 8px;
                    display: flex; align-items: center; justify-content: center;
                    background: rgba(28,58,47,0.06);
                    font-size: 1rem; flex-shrink: 0;
                }
                .mob-nav-label {
                    font-family: var(--h-sans);
                    font-size: 0.92rem; font-weight: 500;
                    color: var(--h-ink); letter-spacing: 0.02em;
                    flex: 1;
                }
                .mob-nav-arrow {
                    width: 5px; height: 5px;
                    border-top: 1.5px solid var(--h-sage);
                    border-right: 1.5px solid var(--h-sage);
                    transform: rotate(45deg); opacity: 0.45; flex-shrink: 0;
                }

                /* Mobile auth area */
                .mob-auth { padding: 1rem 1.2rem 0.5rem; flex-shrink: 0; }
                .mob-auth-label {
                    font-size: 0.6rem; text-align: center;
                    letter-spacing: 0.22em; text-transform: uppercase;
                    color: var(--h-green-lite); margin-bottom: 8px;
                }
                .mob-login-btn {
                    display: block; width: 100%;
                    padding: 0.85rem;
                    border-radius: 8px; text-align: center;
                    font-size: 0.8rem; font-weight: 600;
                    letter-spacing: 0.1em; text-transform: uppercase;
                    text-decoration: none;
                    background: var(--h-green);
                    color: var(--h-sage);
                    border: 1.5px solid rgba(122,175,148,0.3);
                    transition: background 0.2s, transform 0.15s;
                }
                .mob-login-btn:hover { background: var(--h-green-lite); transform: translateY(-1px); }
                .mob-login-btn:active { transform: scale(0.98); }

                /* Bottom flourish */
                .mob-footer {
                    text-align: center; padding: 1.2rem;
                    display: flex; align-items: center; justify-content: center; gap: 10px;
                    flex-shrink: 0;
                }
                .mob-footer-line { flex: 1; height: 1px; background: rgba(28,58,47,0.08); max-width: 60px; }
                .mob-footer-crest svg { width: 16px; height: 16px; fill: var(--h-sage); opacity: 0.35; }

                /* ── Responsive ── */
                @media (max-width: 768px) {
                    .hdr-nav, .hdr-right { display: none !important; }
                    .hdr-burger { display: flex !important; }
                    .hdr-inner { padding: 0 1.2rem; }
                }
            `}</style>

            {/* ════════════ HEADER ════════════ */}
            <header className={`hdr-root${scrolled ? ' scrolled' : ''}`}>
                <div className="hdr-glass" />

                <div className="hdr-inner">

                    {/* Logo */}
                    <Link href="/" className="hdr-logo">
                        <div className="hdr-logo-crest">
                            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 2L3 6v6c0 5.25 3.75 10.15 9 11.35C17.25 22.15 21 17.25 21 12V6l-9-4z"/>
                            </svg>
                        </div>
                        <div className="hdr-logo-text">
                            <strong>School</strong>
                            <span>Nurturing Excellence</span>
                        </div>
                    </Link>

                    {/* Desktop nav — centered absolute */}
                    <ul className="hdr-nav" style={{display:'flex'}}>
                        {navLinks.map(link => (
                            <li key={link.label}>
                                <Link href={link.href} className="hdr-nav-link">
                                    {link.label}
                                </Link>
                            </li>
                        ))}
                    </ul>

                    {/* Desktop right slot */}
                    <div className="hdr-right" style={{display:'flex'}}>
                        {user ? (
                            <Link href="/dashboard" className="pokeball-avatar">
                                <span className="pb-top" />
                                <span className="pb-bottom" />
                                <span className="pb-band" />
                                <span className="pb-button" />
                                <span className="pb-initials">{initials}</span>
                            </Link>
                        ) : (
                            <>
                                <Link href="/auth/login" className="heli-scene" aria-label="Login">
                                    <div className="heli-wrapper">
                                        <div className="heli-ribbon">
                                            <div className="heli-banner">✦ Login</div>
                                        </div>
                                    </div>
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile hamburger */}
                    <button className="hdr-burger" onClick={openMenu} aria-label="Open menu" style={{display:'none'}}>
                        <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <line x1="3" y1="6"  x2="21" y2="6"/>
                            <line x1="3" y1="12" x2="21" y2="12"/>
                            <line x1="3" y1="18" x2="21" y2="18"/>
                        </svg>
                    </button>
                </div>
            </header>

            {/* ════════════ MOBILE OVERLAY ════════════ */}
            {isOpen && (
                <div className="md:hidden" style={{position:'fixed',inset:0,zIndex:200,overflow:'hidden'}}>

                    {/* Temple doors */}
                    <div style={{position:'absolute',inset:0}}>
                        <div
                            className="mob-door-left"
                            style={{
                                transform: doorsOpen
                                    ? 'perspective(900px) rotateY(-88deg)'
                                    : 'perspective(900px) rotateY(0deg)',
                            }}
                        >
                            <div className="mob-door-inner-ring"/>
                            <div className="mob-door-inner-ring2"/>
                            <div className="mob-door-ornament" style={{right:'1rem'}}>✦</div>
                            <div style={{position:'absolute',top:'1.5rem',right:'1.2rem',color:'rgba(122,175,148,0.3)',fontSize:'0.7rem'}}>◆</div>
                            <div style={{position:'absolute',bottom:'1.5rem',right:'1.2rem',color:'rgba(122,175,148,0.3)',fontSize:'0.7rem'}}>◆</div>
                        </div>
                        <div
                            className="mob-door-right"
                            style={{
                                transform: doorsOpen
                                    ? 'perspective(900px) rotateY(88deg)'
                                    : 'perspective(900px) rotateY(0deg)',
                            }}
                        >
                            <div className="mob-door-inner-ring"/>
                            <div className="mob-door-inner-ring2"/>
                            <div className="mob-door-ornament" style={{left:'1rem'}}>✦</div>
                            <div style={{position:'absolute',top:'1.5rem',left:'1.2rem',color:'rgba(122,175,148,0.3)',fontSize:'0.7rem'}}>◆</div>
                            <div style={{position:'absolute',bottom:'1.5rem',left:'1.2rem',color:'rgba(122,175,148,0.3)',fontSize:'0.7rem'}}>◆</div>
                        </div>
                    </div>

                    {/* Content pane */}
                    <div
                        className="mob-content"
                        style={{
                            opacity: contentVisible ? 1 : 0,
                            transform: contentVisible ? 'scale(1)' : 'scale(0.93)',
                        }}
                    >
                        {/* Top band */}
                        <div className="mob-topband">
                            <span
                                className="mob-topband-label"
                                style={{
                                    opacity: contentVisible ? 1 : 0,
                                    transform: contentVisible ? 'translateY(0)' : 'translateY(-6px)',
                                }}
                            >
                                Navigation
                            </span>
                            <div className="mob-topband-ornaments">
                                <div className="mob-topband-dot"/>
                                <div className="mob-topband-dot" style={{opacity:0.3}}/>
                                <div className="mob-topband-dot" style={{opacity:0.15}}/>
                            </div>
                            <button className="mob-close-btn" onClick={closeMenu} aria-label="Close menu">✕</button>
                        </div>

                        {/* Divider */}
                        <div className="mob-rule" style={{opacity: contentVisible ? 1 : 0, transition:'opacity 0.4s ease 0.3s'}}>
                            <div className="mob-rule-line"/>
                            <div className="mob-rule-diamond"/>
                            <div className="mob-rule-line"/>
                        </div>

                        {/* Nav links */}
                        <ul className="mob-nav-list">
                            {navLinks.map((link, i) => (
                                <li className="mob-nav-item" key={link.label}>
                                    <Link
                                        href={link.href}
                                        className="mob-nav-link"
                                        onClick={closeMenu}
                                        style={{
                                            opacity: contentVisible ? 1 : 0,
                                            transform: contentVisible ? 'translateX(0)' : 'translateX(-20px)',
                                            transition: `opacity 0.4s ease ${0.32 + i * 0.06}s, transform 0.4s ease ${0.32 + i * 0.06}s, background 0.2s`,
                                        }}
                                    >
                                        <span className="mob-nav-icon">{link.icon}</span>
                                        <span className="mob-nav-label">{link.label}</span>
                                        <span className="mob-nav-arrow"/>
                                    </Link>
                                </li>
                            ))}
                        </ul>

                        {/* Auth area */}
                        <div
                            className="mob-auth"
                            style={{
                                opacity: contentVisible ? 1 : 0,
                                transform: contentVisible ? 'translateY(0)' : 'translateY(14px)',
                                transition: 'opacity 0.4s ease 0.78s, transform 0.4s ease 0.78s',
                            }}
                        >
                            {user ? (
                                <>
                                    <p className="mob-auth-label">Your Dashboard</p>
                                    <Link
                                        href="/dashboard"
                                        onClick={closeMenu}
                                        className="pokeball-avatar pokeball-avatar-mobile"
                                        style={{display:'flex'}}
                                    >
                                        <span className="pb-top"/>
                                        <span className="pb-bottom"/>
                                        <span className="pb-band"/>
                                        <span className="pb-button"/>
                                        <span className="pb-initials">{initials}</span>
                                    </Link>
                                </>
                            ) : (
                                <Link href="/auth/login" onClick={closeMenu} className="mob-login-btn">
                                    Login →
                                </Link>
                            )}
                        </div>

                        {/* Footer flourish */}
                        <div
                            className="mob-footer"
                            style={{
                                opacity: contentVisible ? 0.6 : 0,
                                transition: 'opacity 0.5s ease 0.95s',
                            }}
                        >
                            <div className="mob-footer-line"/>
                            <div className="mob-footer-crest">
                                <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M12 2L3 6v6c0 5.25 3.75 10.15 9 11.35C17.25 22.15 21 17.25 21 12V6l-9-4z"/>
                                </svg>
                            </div>
                            <div className="mob-footer-line"/>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}