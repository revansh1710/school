
'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function Header() {
    const [isOpen, setIsOpen] = useState(false);

    const navLinks = [
        { label: 'About', href: '#about' },
        { label: 'Academics', href: '#academics' },
        { label: 'Admissions', href: '/admissions' },
        { label: 'Gallery', href: '#gallery' },
        { label: 'Contact', href: '#contact' },
    ];

    return (
        <header className="fixed top-0 left-0 w-full h-12 z-50">

            {/* NAVBAR */}
            <nav className="relative mx-auto max-w-7xl px-6 h-full flex items-center">


                {/* LEFT — LOGO */}
                <div className="flex-1">
                    <Link
                        href="/"
                        className="text-lg sm:text-xl font-bold tracking-wide 
            bg-linear-to-r from-sky-400 to-indigo-400 bg-clip-text text-transparent"
                    >
                        SCHOOL
                    </Link>
                </div>

                {/* CENTER — NAV LINKS */}
                <div className="hidden md:flex gap-8 absolute left-1/2 -translate-x-1/2">
                    {navLinks.map(link => (
                        <Link
                            key={link.label}
                            href={link.href}
                            className="text-sm font-medium text-gray-200 hover:text-sky-400 transition-colors"
                        >
                            {link.label}
                        </Link>
                    ))}
                </div>

                {/* RIGHT — ACTION BUTTONS */}
                <div className="hidden md:flex items-center gap-3 flex-1 justify-end">

                    <a
                        href="/auth/login"
                        className="px-4 py-2 rounded-lg bg-transparent border-b-emerald-700
            text-white font-semibold transition text-sm shadow-md"
                    >
                        Login
                    </a>
                </div>

                {/* MOBILE MENU BUTTON */}
                <button
                    className="md:hidden text-gray-200"
                    onClick={() => setIsOpen(!isOpen)}
                    aria-label="Toggle Menu"
                >
                    {isOpen ? (
                        <svg className="w-6 h-6 right-3" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    ) : (
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    )}
                </button>
            </nav>

            {/* GLASS BACKDROP */}
            <div className="absolute inset-0 -z-10 bg-white/10 backdrop-blur-md border-b border-white/20" />

            {/* MOBILE MENU */}
            {isOpen && (
                <div className="md:hidden backdrop-blur-xl bg-transparent border-white/10 px-6 py-5">
                    <div className="flex flex-col gap-4 text-gray-200">
                        {navLinks.map(link => (
                            <Link
                                key={link.label}
                                href={link.href}
                                onClick={() => setIsOpen(false)}
                                className="hover:text-sky-400 transition"
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>

                    {/* Mobile buttons */}
                    <div className='flex items-center justify-center'>
                        <Link
                            href="/auth/login"
                            onClick={() => setIsOpen(false)}
                            className=" bg-violet-400  text-white font-medium text-center"
                        >
                            login
                        </Link>
                    </div>
                </div>
            )}
        </header>
    );
}
