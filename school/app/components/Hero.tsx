'use client';

import React, { useEffect, useRef } from 'react';
import styles from '../styles/hero.module.css';

type MouseState = {
    x: number | null;
    y: number | null;
    radius: number;
};

type DoodleType = {
    icon: string;
    name: string;
    color: string;
};

const HeroCanvas: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId: number;
        let particles: Particle[] = [];
        let width: number;
        let height: number;

        const mouse: MouseState = { x: null, y: null, radius: 150 };

        const MAX_DIST = 150;
        const PARTICLE_COUNT = 60;

        const DOODLE_TYPES: DoodleType[] = [
            { icon: '📚', name: 'Book', color: '#FFB703' },
            { icon: '🏏', name: 'Sports', color: '#219EBC' },
            { icon: '🎨', name: 'Art', color: '#E94F37' },
            { icon: '🧪', name: 'Science', color: '#8AC926' },
            { icon: '📐', name: 'Math', color: '#6A4C93' },
             { icon: '📷', name: 'Phtography', color: '#6A4C93' }
        ];

        const resize = () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
            init();
        };

        const handleMouseMove = (e: MouseEvent) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        };

        const handleTouchStart = (e: TouchEvent) => {
            if (e.touches.length > 0) {
                mouse.x = e.touches[0].clientX;
                mouse.y = e.touches[0].clientY;
            }
        };

        const handleTouchMove = (e: TouchEvent) => {
            if (e.touches.length > 0) {
                mouse.x = e.touches[0].clientX;
                mouse.y = e.touches[0].clientY;
            }
        };

        const handleTouchEnd = () => {
            mouse.x = null;
            mouse.y = null;
        };

        window.addEventListener('resize', resize);
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('touchstart', handleTouchStart, { passive: true });
        window.addEventListener('touchmove', handleTouchMove, { passive: true });
        window.addEventListener('touchend', handleTouchEnd);

        class Particle {
            x!: number;
            y!: number;
            vx!: number;
            vy!: number;
            size!: number;
            baseX!: number;
            baseY!: number;
            density!: number;
            angle!: number;
            doodle: DoodleType;

            constructor() {
                this.reset();
                const index = Math.floor(Math.random() * DOODLE_TYPES.length);
                this.doodle = DOODLE_TYPES[index];
            }

            reset() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.vx = (Math.random() - 0.5) * 1.5;
                this.vy = (Math.random() - 0.5) * 1.5;
                this.size = Math.random() * 20 + 20;
                this.baseX = this.x;
                this.baseY = this.y;
                this.density = Math.random() * 30 + 1;
                this.angle = Math.random() * 360;
            }

            draw() {
                ctx!.fillStyle = this.doodle.color;
                ctx!.globalAlpha = 0.5;

                ctx!.beginPath();
                ctx!.arc(this.x, this.y, 4, 0, Math.PI * 2);
                ctx!.fill();

                ctx!.font = `${this.size}px Arial`;
                ctx!.fillStyle = this.doodle.color;
                ctx!.globalAlpha = 0.8;
                ctx!.textAlign = 'center';
                ctx!.textBaseline = 'middle';
                ctx!.fillText(this.doodle.icon, this.x, this.y);

                ctx!.globalAlpha = 1;
            }

            update() {
                this.angle += 0.02;
                const floatY = Math.sin(this.angle) * 0.5;

                if (mouse.x !== null && mouse.y !== null) {
                    const dx = mouse.x - this.x;
                    const dy = mouse.y - this.y;
                    const distance = Math.sqrt(dx * dx + dy * dy) || 1;

                    const forceDirectionX = dx / distance;
                    const forceDirectionY = dy / distance;
                    const force = (mouse.radius - distance) / mouse.radius;

                    const directionX = forceDirectionX * force * this.density;
                    const directionY = forceDirectionY * force * this.density;

                    if (distance < mouse.radius) {
                        this.x -= directionX;
                        this.y -= directionY;
                    } else {
                        this.x -= (this.x - this.baseX) / 30;
                        this.y -= (this.y - this.baseY) / 30;
                    }
                }

                this.x += this.vx;
                this.y += this.vy + floatY;

                this.baseX += this.vx;
                this.baseY += this.vy + floatY;

                if (this.x < 0 || this.x > width) this.vx *= -1;
                if (this.y < 0 || this.y > height) this.vy *= -1;

                if (this.baseX < 0 || this.baseX > width) this.baseX = Math.random() * width;
                if (this.baseY < 0 || this.baseY > height) this.baseY = Math.random() * height;

                this.draw();
            }
        }

        const init = () => {
            particles = [];
            for (let i = 0; i < PARTICLE_COUNT; i++) {
                particles.push(new Particle());
            }
        };

        const animate = () => {
            ctx.clearRect(0, 0, width, height);

            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < MAX_DIST) {
                        const opacity = ((MAX_DIST - dist) / MAX_DIST) * 0.3;

                        ctx.strokeStyle = '#219EBC';
                        ctx.globalAlpha = opacity;
                        ctx.lineWidth = 1;

                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();

                        ctx.globalAlpha = 1;
                    }
                }
                particles[i].update();
            }

            if (mouse.x !== null && mouse.y !== null) {
                const gradient = ctx.createRadialGradient(
                    mouse.x,
                    mouse.y,
                    0,
                    mouse.x,
                    mouse.y,
                    mouse.radius
                );

                gradient.addColorStop(0, 'rgba(255, 183, 3, 0.3)');
                gradient.addColorStop(0.5, 'rgba(33, 158, 188, 0.1)');
                gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

                ctx.fillStyle = gradient;
                ctx.beginPath();
                ctx.arc(mouse.x, mouse.y, mouse.radius, 0, Math.PI * 2);
                ctx.fill();
            }

            animationFrameId = requestAnimationFrame(animate);
        };

        resize();
        animate();

        return () => {
            window.removeEventListener('resize', resize);
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('touchstart', handleTouchStart);
            window.removeEventListener('touchmove', handleTouchMove);
            window.removeEventListener('touchend', handleTouchEnd);

            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <section className={styles.hero}>
            <canvas ref={canvasRef} className={styles.heroCanvas}></canvas>
        </section>
    );
};

export default HeroCanvas;