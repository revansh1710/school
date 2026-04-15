'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function AdmissonHeader() {
    const [isOpen, setIsOpen] = useState(false);
    const [doorsOpen, setDoorsOpen] = useState(false);
    const [contentVisible, setContentVisible] = useState(false);

    const navLinks = [
        { label: 'Gallery',      href: '/gallery',      icon: '🖼️' },
    ];

    const openMenu = () => {
        setIsOpen(true);
        // Slight delay so DOM is mounted before triggering door animation
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

    // Lock body scroll when menu is open
    useEffect(() => {
        document.body.style.overflow = isOpen ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [isOpen]);

    return (
        <>
            <header className="fixed top-0 left-0 w-full h-12 z-50">
                <nav className="relative mx-auto max-w-7xl px-6 h-full flex items-center">

                    {/* Logo */}
                    <div className="flex-1">
                        <Link
                            href="/"
                            className="text-lg sm:text-xl font-bold tracking-wide
                                bg-linear-to-r from-sky-400 to-indigo-400 bg-clip-text text-transparent"
                        >
                            Home
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

                    {/* Desktop login */}
                    <div className="hidden md:flex items-center gap-3 flex-1 justify-end">
                            <a
                            href="/auth/login"
                            className="px-4 py-2 rounded-lg bg-transparent sm:text-xl font-bold tracking-wide
                                bg-linear-to-r from-sky-400 to-indigo-400 bg-clip-text text-transparent
                                transition text-sm shadow-md">
                            Login
                        </a>
                    </div>

                    {/* Mobile hamburger — diya icon */}
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
                    <div
                        className="absolute inset-0"
                        style={{
                            transition: 'all 0.9s cubic-bezier(0.77, 0, 0.175, 1)',
                        }}
                    >
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
                            {/* Door pattern */}
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

                    {/* Menu content — revealed after doors open */}
                    <div
                        className="absolute inset-0 flex flex-col overflow-y-auto"
                        style={{
                            background: 'linear-gradient(180deg, #fdf0dc 0%, #fae8c8 40%, #f5d99a 70%, #f0cc7a 100%)',
                            opacity: contentVisible ? 1 : 0,
                            transform: contentVisible ? 'scale(1)' : 'scale(0.92)',
                            transition: 'opacity 0.5s ease, transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
                        }}
                    >

                        {/* Top band — saffron/red */}
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
                                <span>🪔</span>
                                <span>🌼</span>
                                <span>🪔</span>
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
                        >
                        </div>

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
                                        transition: `opacity 0.4s ease ${0.35 + i * 0.07}s,
                                                     transform 0.4s ease ${0.35 + i * 0.07}s`,
                                    }}
                                >
                                    <span className="text-base">{link.icon}</span>
                                    <span className="text-sm font-medium">{link.label}</span>
                                    <span
                                        className="ml-auto w-1.5 h-1.5 rounded-full"
                                        style={{ background: '#c8a44a' }}
                                    />
                                </Link>
                            ))}
                        </div>

                        {/* Login button */}
                        <div className="px-5 py-4">
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