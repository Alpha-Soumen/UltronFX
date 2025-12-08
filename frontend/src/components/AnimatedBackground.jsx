import React, { useEffect, useRef } from 'react';
import { useTheme } from '../context/ThemeContext';

const AnimatedBackground = ({ children }) => {
    const canvasRef = useRef(null);
    const { theme } = useTheme();

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let animationFrameId;
        let particles = [];

        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();

        // Particle Class
        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.vx = (Math.random() - 0.5) * 0.5;
                this.vy = (Math.random() - 0.5) * 0.5;
                this.size = Math.random() * 2 + 1;
                this.opacity = Math.random() * 0.5 + 0.2;
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;

                if (this.x < 0) this.x = canvas.width;
                if (this.x > canvas.width) this.x = 0;
                if (this.y < 0) this.y = canvas.height;
                if (this.y > canvas.height) this.y = 0;
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);

                if (theme === 'dark') {
                    ctx.fillStyle = `rgba(56, 189, 248, ${this.opacity})`; // Cyan
                    ctx.shadowBlur = 10;
                    ctx.shadowColor = "rgba(56, 189, 248, 0.8)";
                } else {
                    ctx.fillStyle = `rgba(99, 102, 241, ${this.opacity * 0.5})`; // Indigo (softer)
                    ctx.shadowBlur = 0;
                }

                ctx.fill();
            }
        }

        // Initialize Particles
        const initParticles = () => {
            particles = [];
            const particleCount = window.innerWidth < 768 ? 30 : 60; // Fewer on mobile
            for (let i = 0; i < particleCount; i++) {
                particles.push(new Particle());
            }
        };

        initParticles();

        // Animation Loop
        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Draw connections
            particles.forEach((p, index) => {
                p.update();
                p.draw();

                // Connect particles close to each other
                for (let j = index + 1; j < particles.length; j++) {
                    const p2 = particles[j];
                    const dx = p.x - p2.x;
                    const dy = p.y - p2.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < 150) {
                        ctx.beginPath();
                        if (theme === 'dark') {
                            ctx.strokeStyle = `rgba(56, 189, 248, ${0.15 * (1 - distance / 150)})`;
                        } else {
                            ctx.strokeStyle = `rgba(99, 102, 241, ${0.05 * (1 - distance / 150)})`;
                        }
                        ctx.lineWidth = 1;
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(p2.x, p2.y);
                        ctx.stroke();
                    }
                }
            });

            animationFrameId = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            window.removeEventListener('resize', resizeCanvas);
            cancelAnimationFrame(animationFrameId);
        };
    }, [theme]);

    return (
        <div className="relative w-full min-h-screen overflow-hidden transition-colors duration-700">
            {/* CSS Gradient Background */}
            <div className={`absolute inset-0 -z-20 transition-colors duration-700 ${theme === 'dark'
                    ? 'bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-[#0f172a] to-black'
                    : 'bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-50 via-white to-slate-100'
                }`}></div>

            {/* Animated Gradient Overlay (Subtle) */}
            <div className={`absolute inset-0 -z-10 opacity-30 blur-3xl animate-pulse-slow ${theme === 'dark'
                    ? 'bg-gradient-to-tr from-indigo-900/30 via-purple-900/30 to-cyan-900/30'
                    : 'bg-gradient-to-tr from-blue-100 via-purple-100 to-pink-100'
                }`}></div>

            {/* Canvas Layer */}
            <canvas
                ref={canvasRef}
                className="absolute inset-0 -z-10 block"
            />

            {/* Content */}
            <div className="relative z-10">
                {children}
            </div>
        </div>
    );
};

export default AnimatedBackground;
