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

    const navLinks = [
        { label: 'About', href: '#about', icon: '🏛️' },
        { label: 'Academics', href: '#academics', icon: '📚' },
        { label: 'Admissions', href: '/admissions', icon: '🎓' },
        { label: 'Gallery', href: '/gallery', icon: '🖼️' },
        { label: 'Contact', href: '#contact', icon: '📬' },
        { label: 'Studio', href: '/studio', icon: '🎨' },
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

    const initials = user?.parentName
        ? user.parentName.substring(0, 2).toUpperCase()
        : user?.email?.substring(0, 2).toUpperCase() || 'PR';

    return (
        <>
            <style>{`
                @keyframes rollIn {
                    0%   { transform: translateX(200px) rotate(0deg);   opacity: 0; }
                    60%  { transform: translateX(-10px) rotate(400deg); opacity: 1; }
                    75%  { transform: translateX(4px)   rotate(420deg); }
                    100% { transform: translateX(0)     rotate(420deg); }
                }
                @keyframes openTop {
                    0%, 60% { transform: translateY(0) rotate(0deg);       opacity: 1; }
                    80%     { transform: translateY(-22px) rotate(-20deg); opacity: 0.9; }
                    100%    { transform: translateY(-28px) rotate(-25deg); opacity: 0; }
                }
                @keyframes openBottom {
                    0%, 60% { transform: translateY(0); }
                    80%     { transform: translateY(10px); }
                    100%    { transform: translateY(14px); }
                }
                @keyframes revealInitials {
                    0%, 65% { opacity: 0; transform: scale(0.3); }
                    80%     { opacity: 1; transform: scale(1.15); }
                    100%    { opacity: 1; transform: scale(1); }
                }

                .pokeball-avatar {
                    position: relative;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 44px;
                    height: 44px;
                    border-radius: 50%;
                    overflow: hidden;
                    cursor: pointer;
                    text-decoration: none;
                    animation: rollIn 0.9s cubic-bezier(0.22, 1, 0.36, 1) forwards;
                    transition: transform 0.2s ease, box-shadow 0.2s ease;
                    flex-shrink: 0;
                }
                .pokeball-avatar:hover  { transform: scale(1.1) !important; }
                .pokeball-avatar:active { transform: scale(0.95) !important; }

                .pb-top {
                    position: absolute; top: 0; left: 0; right: 0; height: 50%;
                    background: #e63946;
                    animation: openTop 0.5s ease-out 0.85s forwards;
                }
                .pb-top::after {
                    content: ''; position: absolute; top: 6px; left: 8px;
                    width: 10px; height: 5px;
                    background: rgba(255,255,255,0.35);
                    border-radius: 50%; transform: rotate(-30deg);
                }
                .pb-bottom {
                    position: absolute; bottom: 0; left: 0; right: 0; height: 50%;
                    background: #f1f1f1;
                    animation: openBottom 0.5s ease-out 0.85s forwards;
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
                    border-radius: 50%; background: #f1f1f1;   /* ← was: red */
                }
                .pb-initials {
                    position: absolute; z-index: 10;
                    color: #fff; font-size: 13px; font-weight: 600;
                    letter-spacing: 0.5px;
                    text-shadow: 0 1px 3px rgba(0,0,0,0.5);
                    animation: revealInitials 0.4s ease-out 1.1s both;
                    opacity: 0;
                }
                .pb-base {
                    position: absolute;
                    inset: 0;
                    background: radial-gradient(circle at 35% 35%, #ffe066, #f5c400 50%, #c8960c 100%);
                    z-index: 0;
                }

                /* Mobile pokeball — slightly smaller */
                .pokeball-avatar-mobile {
                    width: 100%;
                    height: 56px;
                    border-radius: 12px;
                    overflow: hidden;
                    animation: none;
                }
                .pokeball-avatar-mobile .pb-top  { animation: none; background: #e63946; }
                .pokeball-avatar-mobile .pb-bottom { animation: none; }
                .pokeball-avatar-mobile .pb-initials {
                    animation: none; opacity: 1; font-size: 14px;
                    color: #ffd700; text-shadow: 0 1px 4px rgba(0,0,0,0.6);
                }
            `}</style>

            <header className="fixed top-0 left-0 w-full h-12 z-50 bg-amber-100" >
                <nav className="relative mx-auto max-w-7xl px-6 h-full flex items-center">

                    {/* Logo */}
                    <div className="flex-1">
                        <Link
                            href="/"
                            className="text-lg sm:text-xl font-bold tracking-wide
                                bg-linear-to-r from-sky-400 to-indigo-400 bg-clip-text text-transparent"
                        >
                            School
                        </Link>
                    </div>

                    {/* Desktop nav */}
                    <div className="hidden md:flex gap-8 absolute left-1/2 -translate-x-1/2">
                        {navLinks.map(link => (
                            <Link
                                key={link.label}
                                href={link.href}
                                className="text-sm font-medium text-black hover:text-sky-400 transition-colors"
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>

                    {/* Desktop login / avatar */}
                    <div className="hidden md:flex items-center gap-3 flex-1 justify-end">
                        {user ? (
                            <Link href="/dashboard" className="pokeball-avatar">
                                <span className="pb-top" />
                                <span className="pb-bottom" />
                                <span className="pb-band" />
                                <span className="pb-button" />
                                <span className="pb-initials">{initials}</span>
                            </Link>
                        ) : (
                            <Link
                                href="/auth/login"
                                className="px-4 py-2 rounded-lg bg-transparent sm:text-xl font-bold tracking-wide
                                    bg-linear-to-r from-sky-400 to-indigo-400 bg-clip-text text-transparent
                                    transition text-sm shadow-md"
                            >
                                Login
                            </Link>
                        )}
                    </div>

                    {/* Mobile hamburger */}
                    <button
                        className="md:hidden text-xl w-9 h-9 rounded-full border border-amber-400
                            bg-amber-50 flex items-center justify-center transition-transform
                            hover:scale-110 active:scale-95"
                        onClick={openMenu}
                        aria-label="Open Menu"
                    >
                        🪔
                    </button>
                </nav>

                {/* Glass blur backdrop */}
                <div className="absolute inset-0 -z-10 bg-white/10 backdrop-blur-md border-b border-white/20" />
            </header>

            {/* ── MOBILE MENU OVERLAY ─────────────────────────────── */}
            {isOpen && (
                <div className="md:hidden fixed inset-0 z-100 overflow-hidden">

                    {/* Temple doors */}
                    <div className="absolute inset-0" style={{ transition: 'all 0.9s cubic-bezier(0.77, 0, 0.175, 1)' }}>
                        {/* Left door */}
                        <div
                            className="absolute top-0 bottom-0 left-0 w-1/2"
                            style={{
                                background: 'linear-gradient(135deg, #922B21 0%, #c0392b 40%, #8B2500 100%)',
                                borderRight: '2px solid #c8a44a',
                                transformOrigin: 'left center',
                                transform: doorsOpen
                                    ? 'perspective(800px) rotateY(-85deg)'
                                    : 'perspective(800px) rotateY(0deg)',
                                transition: 'transform 0.9s cubic-bezier(0.77, 0, 0.175, 1)',
                            }}
                        >
                            <div className="absolute inset-4 border border-amber-400/30 rounded-sm" />
                            <div className="absolute inset-8 border border-amber-400/20 rounded-sm" />
                            <div className="absolute top-1/2 right-4 -translate-y-1/2 text-2xl opacity-60">🌸</div>
                            <div className="absolute top-8 right-6 text-sm opacity-40">✦</div>
                            <div className="absolute bottom-8 right-6 text-sm opacity-40">✦</div>
                        </div>

                        {/* Right door */}
                        <div
                            className="absolute top-0 bottom-0 right-0 w-1/2"
                            style={{
                                background: 'linear-gradient(225deg, #922B21 0%, #c0392b 40%, #8B2500 100%)',
                                borderLeft: '2px solid #c8a44a',
                                transformOrigin: 'right center',
                                transform: doorsOpen
                                    ? 'perspective(800px) rotateY(85deg)'
                                    : 'perspective(800px) rotateY(0deg)',
                                transition: 'transform 0.9s cubic-bezier(0.77, 0, 0.175, 1)',
                            }}
                        >
                            <div className="absolute inset-4 border border-amber-400/30 rounded-sm" />
                            <div className="absolute inset-8 border border-amber-400/20 rounded-sm" />
                            <div className="absolute top-1/2 left-4 -translate-y-1/2 text-2xl opacity-60">🌸</div>
                            <div className="absolute top-8 left-6 text-sm opacity-40">✦</div>
                            <div className="absolute bottom-8 left-6 text-sm opacity-40">✦</div>
                        </div>
                    </div>

                    {/* Menu content */}
                    <div
                        className="absolute inset-0 flex flex-col overflow-y-auto"
                        style={{
                            background: 'linear-gradient(180deg, #fdf0dc 0%, #fae8c8 40%, #f5d99a 70%, #f0cc7a 100%)',
                            opacity: contentVisible ? 1 : 0,
                            transform: contentVisible ? 'scale(1)' : 'scale(0.92)',
                            transition: 'opacity 0.5s ease, transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
                        }}
                    >
                        {/* Top band */}
                        <div
                            className="flex items-center justify-between px-5 py-3"
                            style={{ background: 'linear-gradient(90deg, #8B2500, #c0392b, #8B2500)' }}
                        >
                            <span
                                className="text-sm tracking-widest font-medium"
                                style={{
                                    color: '#ffd700',
                                    opacity: contentVisible ? 1 : 0,
                                    transform: contentVisible ? 'translateY(0)' : 'translateY(-8px)',
                                    transition: 'all 0.4s ease 0.2s',
                                }}
                            >
                                ✦ स्वागतम् ✦
                            </span>
                            <div className="flex gap-2 text-base">
                                <span>🪔</span><span>🌼</span><span>🪔</span>
                            </div>
                            <button
                                onClick={closeMenu}
                                className="w-7 h-7 rounded-full flex items-center justify-center text-xs"
                                style={{
                                    background: 'rgba(255,215,0,0.15)',
                                    border: '1px solid #ffd700',
                                    color: '#ffd700',
                                }}
                                aria-label="Close menu"
                            >
                                ✕
                            </button>
                        </div>

                        {/* Rangoli motif */}
                        <div
                            className="flex justify-center py-4"
                            style={{
                                opacity: contentVisible ? 1 : 0,
                                transform: contentVisible ? 'scale(1) rotate(0deg)' : 'scale(0.6) rotate(-20deg)',
                                transition: 'all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) 0.25s',
                            }}
                        />

                        {/* Nav links */}
                        <div className="flex flex-col gap-2 px-5 flex-1">
                            {navLinks.map((link, i) => (
                                <Link
                                    key={link.label}
                                    href={link.href}
                                    onClick={closeMenu}
                                    className="flex items-center gap-3 px-4 py-3 rounded-xl
                                        hover:bg-amber-200/50 active:scale-95 transition-all"
                                    style={{
                                        background: 'rgba(255,255,255,0.45)',
                                        border: '1px solid rgba(200,164,74,0.3)',
                                        color: '#6b2d00',
                                        opacity: contentVisible ? 1 : 0,
                                        transform: contentVisible ? 'translateX(0)' : 'translateX(-24px)',
                                        transition: `opacity 0.4s ease ${0.35 + i * 0.07}s, transform 0.4s ease ${0.35 + i * 0.07}s`,
                                    }}
                                >
                                    <span className="text-base">{link.icon}</span>
                                    <span className="text-sm font-medium">{link.label}</span>
                                    <span className="ml-auto w-1.5 h-1.5 rounded-full" style={{ background: '#c8a44a' }} />
                                </Link>
                            ))}
                        </div>

                        {/* Mobile login / pokeball avatar */}
                        <div className="px-5 py-4">
                            {user ? (
                                <div
                                    style={{
                                        opacity: contentVisible ? 1 : 0,
                                        transform: contentVisible ? 'translateY(0)' : 'translateY(16px)',
                                        transition: 'opacity 0.4s ease 0.85s, transform 0.4s ease 0.85s',
                                    }}
                                >
                                    {/* Label above */}
                                    <p className="text-xs text-center mb-2 tracking-widest" style={{ color: '#8B2500' }}>
                                        ✦ your dashboard ✦
                                    </p>
                                    {/* Pokéball — wider pill shape for mobile */}
                                    <Link
                                        href="/dashboard"
                                        onClick={closeMenu}
                                        className="pokeball-avatar pokeball-avatar-mobile"
                                        style={{ display: 'flex' }}
                                    >
                                        <span className="pb-top" />
                                        <span className="pb-bottom" />
                                        <span className="pb-band" />
                                        <span className="pb-button" />
                                        <span className="pb-initials">{initials}</span>
                                    </Link>
                                </div>
                            ) : (
                                <Link
                                    href="/auth/login"
                                    onClick={closeMenu}
                                    className="block w-full py-3 rounded-xl text-center text-sm font-medium
                                        tracking-widest active:scale-95 transition-all"
                                    style={{
                                        background: 'linear-gradient(135deg, #8B2500, #c0392b)',
                                        border: '1.5px solid #c8a44a',
                                        color: '#ffd700',
                                        opacity: contentVisible ? 1 : 0,
                                        transform: contentVisible ? 'translateY(0)' : 'translateY(16px)',
                                        transition: 'opacity 0.4s ease 0.85s, transform 0.4s ease 0.85s',
                                    }}
                                >
                                    Login
                                </Link>
                            )}
                        </div>

                        {/* Bottom motif */}
                        <div
                            className="text-center pb-6 text-lg tracking-[10px]"
                            style={{
                                opacity: contentVisible ? 0.45 : 0,
                                transition: 'opacity 0.5s ease 1s',
                            }}
                        >
                            🌸 ✦ 🌸
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}