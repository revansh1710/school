'use client'
import { useState } from 'react';
export default function Header() {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <header className="fixed top-0 left-0 w-full z-50">
            <nav className="mx-auto max-w-7xl px-6 py-3 flex items-center justify-between 
        rounded-b-xl bg-white/10 backdrop-blur-md border-b border-white/20 shadow-md">

                {/* Logo */}
                <a href="/" className="text-lg sm:text-xl font-bold tracking-wide bg-linear-to-r from-sky-400 to-indigo-400 bg-clip-text text-transparent">
                    SCHOOL
                </a>

                {/* Desktop links */}
                <div className="hidden md:flex gap-6 text-sm font-medium text-gray-200">
                    <a href="#about" className="hover:text-sky-400 transition-colors">About</a>
                    <a href="#contact" className="hover:text-sky-400 transition-colors">Academics</a>
                    <a href="#contact" className="hover:text-sky-400 transition-colors">Faculty</a>
                    <a href="#contact" className="hover:text-sky-400 transition-colors">Admissions</a>
                    <a href="#contact" className="hover:text-sky-400 transition-colors">Notices</a>
                    <a href="#contact" className="hover:text-sky-400 transition-colors">Gallery</a>
                    <a href="#contact" className="hover:text-sky-400 transition-colors">Contact</a>
                </div>

                {/* Desktop auth buttons */}
                <div className="hidden md:flex gap-3">

                </div>

                {/* Mobile hamburger */}
                <button
                    className="md:hidden text-gray-200 focus:outline-none"
                    onClick={() => setIsOpen(!isOpen)}
                    aria-label="Toggle menu"
                >
                    {isOpen ? (
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    ) : (
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    )}
                </button>
            </nav>

            {/* Mobile menu */}
            {isOpen && (
                <div className="md:hidden bg-transparent backdrop-blur-md border-t border-white/10 px-6 py-4 space-y-4">
                    <div className="flex flex-col gap-4 text-gray-200">
                        <a href="#about" onClick={() => setIsOpen(false)} className="hover:text-sky-400">About</a>
                        <a href="#about" onClick={() => setIsOpen(false)} className="hover:text-sky-400">Academics</a>
                        <a href="#about" onClick={() => setIsOpen(false)} className="hover:text-sky-400">Faculty</a>
                        <a href="#contact" onClick={() => setIsOpen(false)} className="hover:text-sky-400">Admissions</a>
                        <a href="#about" onClick={() => setIsOpen(false)} className="hover:text-sky-400">Notices</a>
                        <a href="#about" onClick={() => setIsOpen(false)} className="hover:text-sky-400">Gallery</a>
                        <a href="#about" onClick={() => setIsOpen(false)} className="hover:text-sky-400">Contact</a>
                    </div>
                    <div className="flex flex-col gap-3 mt-4">
                        <a
                            href="/login"
                            onClick={() => setIsOpen(false)}
                            className="px-3 py-2 rounded-lg border border-white/30 text-gray-200 hover:bg-white/10 transition text-center"
                        >
                            Login
                        </a>
                        <a
                            href="/register"
                            onClick={() => setIsOpen(false)}
                            className="px-3 py-2 rounded-lg bg-sky-600 hover:bg-sky-700 text-white font-semibold transition text-center"
                        >
                            Register
                        </a>
                    </div>
                </div>
            )}
        </header>
    )
}