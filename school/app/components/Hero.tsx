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
                <source src="videos/Hero.mp4" type="video/mp4" />
                Your browser does not support the video tag.
            </video>

            {/* overlay */}
            <div className="absolute inset-0 bg-black/60" aria-hidden />

            <div className="relative z-10 px-6 translate-y-12 md:translate-y-20">
                <h1 className="text-4xl sm:text-6xl font-extrabold bg-linear-to-r from-sky-400 to-indigo-400 bg-clip-text text-transparent">
                    Welcome to School
                </h1>
                <p className="mt-6 max-w-2xl mx-auto text-lg text-gray-300 leading-relaxed">
                    LEARN GROW AND ACHIEVE YOUR DREAMS
                </p>
            </div>
        </section>
    )
}