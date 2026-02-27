'use client'
import { useNavigate } from "react-router-dom";
export default function Hero() {
    return (
        <section className="relative h-screen flex items-center justify-center text-center overflow-hidden">
            <video
                autoPlay
                muted
                loop
                playsInline
                className="absolute inset-0 w-full h-full object-cover"
            >
                <source src="videos/HERO.mp4" type="video/mp4" />
                Your browser does not support the video tag.
            </video>

            {/* overlay */}
            <div className="absolute inset-0 bg-black/60" aria-hidden />

            <div className="relative z-10 px-6">
                <h1 className="text-4xl sm:text-6xl font-extrabold bg-linear-to-r from-sky-400 to-indigo-400 bg-clip-text text-transparent">
                    Welcome to School
                </h1>
                <p className="mt-6 max-w-2xl mx-auto text-lg text-gray-300 leading-relaxed">
                    LEARN GROW AND ACHIEVE YOUR DREAMS
                </p>
                <div className="mt-10 flex justify-center">
                    <a href='/dashboard'
                        className="px-2 py-1 rounded-4xl border border-b-emerald-800 bg-transparent 
               text-white  shadow-md 
               hover:bg-white hover:text-black font-medium
               focus:outline-none focus:ring-2 
               transition duration-300 ease-in-out"
                    >
                        Enter Dashboard
                    </a>
                </div>

            </div>
        </section>
    )
}