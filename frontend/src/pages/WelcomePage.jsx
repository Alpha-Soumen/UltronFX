import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Globe, Brain, ShieldCheck, Zap, Activity, Building } from 'lucide-react';
import ThemeToggle from '../components/ThemeToggle';

const WelcomePage = () => {
    const navigate = useNavigate();
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let animationFrameId;

        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();

        const particles = [];
        const particleCount = 100;

        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.vx = (Math.random() - 0.5) * 0.5;
                this.vy = (Math.random() - 0.5) * 0.5;
                this.size = Math.random() * 2;
                // Dynamic color based on theme would require observing class changes, 
                // keeping it neutral/blue for now which works on both.
                this.color = `rgba(${Math.random() * 100 + 100}, ${Math.random() * 100 + 150}, 255, ${Math.random() * 0.5})`;
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;

                if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
                if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
            }

            draw() {
                ctx.fillStyle = this.color;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Draw connecting lines
            ctx.strokeStyle = 'rgba(100, 150, 255, 0.05)';
            ctx.lineWidth = 0.5;
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < 150) {
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                    }
                }
            }

            particles.forEach(particle => {
                particle.update();
                particle.draw();
            });

            animationFrameId = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            window.removeEventListener('resize', resizeCanvas);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <div className="relative min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white overflow-hidden flex flex-col transition-colors duration-300">
            <canvas ref={canvasRef} className="absolute inset-0 z-0 opacity-50 dark:opacity-100" />

            {/* Background Gradients */}
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-100/50 via-white to-purple-100/50 dark:from-blue-900/20 dark:via-slate-950 dark:to-purple-900/20 z-0 pointer-events-none transition-colors duration-300"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[100px] animate-pulse z-0 pointer-events-none"></div>

            {/* Header */}
            <header className="relative z-10 w-full max-w-7xl mx-auto px-6 py-6 flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <img src="/logo.png" alt="UltronFX Logo" className="w-10 h-10 rounded-xl shadow-lg shadow-blue-500/20" />
                    <span className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">UltronFX</span>
                </div>
                <div className="flex items-center gap-4">
                    <ThemeToggle />
                    <button
                        onClick={() => navigate('/login')}
                        className="text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white transition-colors"
                    >
                        Log In
                    </button>
                    <button
                        onClick={() => navigate('/signup')}
                        className="px-5 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-950 rounded-full text-sm font-bold hover:bg-slate-800 dark:hover:bg-blue-50 transition-colors shadow-lg shadow-slate-900/10 dark:shadow-white/10 flex items-center gap-2"
                    >
                        Sign Up <ArrowRight className="w-4 h-4" />
                    </button>
                </div>
            </header>

            {/* Hero Section */}
            <main className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-4 py-20">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 text-xs font-medium mb-8 animate-fadeIn">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                    </span>
                    Powered by UltronFX Intelligence
                </div>

                <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-6 bg-gradient-to-r from-slate-900 via-blue-800 to-slate-600 dark:from-white dark:via-blue-100 dark:to-slate-400 bg-clip-text text-transparent drop-shadow-2xl animate-slideUp">
                    UltronFX
                </h1>

                <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mb-12 leading-relaxed animate-slideUp delay-100">
                    The next generation of AI-driven financial forecasting.
                    Experience institutional-grade analytics with real-time predictive modeling.
                </p>

                <div className="flex flex-col md:flex-row gap-4 animate-slideUp delay-200 mb-20">
                    <button
                        onClick={() => navigate('/signup')}
                        className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full font-bold text-lg hover:shadow-lg hover:shadow-blue-500/25 transition-all hover:scale-105 active:scale-95"
                    >
                        Get Started Now
                    </button>
                    <button
                        onClick={() => navigate('/login')}
                        className="px-8 py-4 bg-white/50 dark:bg-slate-800/50 backdrop-blur-md border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-full font-bold text-lg hover:bg-white dark:hover:bg-slate-800 transition-all hover:scale-105 active:scale-95"
                    >
                        View Demo
                    </button>
                </div>

                {/* Feature Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl w-full animate-fadeIn delay-300 px-4">
                    <FeatureCard
                        icon={Globe}
                        title="Institutional Market Intelligence"
                        desc="Synthesizes global liquidity flows, volatility patterns, and market micro-structure into a unified intelligence layer built for professional-grade decision making."
                    />
                    <FeatureCard
                        icon={Brain}
                        title="AI-Driven Forecasting Engine"
                        desc="A continuously adapting forecasting core that refines its predictions using live market inputs, historical patterns, and model-level feedback loops."
                    />
                    <FeatureCard
                        icon={ShieldCheck}
                        title="Advanced Risk Scoring"
                        desc="Identifies early indicators of instability, trend reversals, and abnormal trading behavior through multi-factor risk models and sequence-based anomaly detection."
                    />
                    <FeatureCard
                        icon={Zap}
                        title="High-Performance Analytics"
                        desc="Optimized for low-latency computation, scalable workloads, and rapid data ingestion — ensuring forecasts and metrics remain accurate under heavy market activity."
                    />
                    <FeatureCard
                        icon={Activity}
                        title="Real-Time Operational Monitoring"
                        desc="Live visibility into system health, API load, latency behavior, and model activity, enabling immediate detection of performance shifts."
                    />
                    <FeatureCard
                        icon={Building}
                        title="Enterprise-Grade Reliability"
                        desc="Built with fault tolerance, controlled access, and continuous system validation to maintain stability across production environments."
                    />
                </div>

                {/* Learning Hub Section */}
                <div className="w-full max-w-6xl mt-32 animate-fadeIn delay-500 px-4">
                    <div className="bg-gradient-to-br from-blue-900 to-slate-900 rounded-3xl p-8 md:p-12 relative overflow-hidden shadow-2xl">
                        {/* Background Decor */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

                        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                            <div className="text-left max-w-xl">
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold mb-4 border border-blue-500/30">
                                    <Brain className="w-3 h-3" />
                                    FREE EDUCATION
                                </div>
                                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                                    New to Crypto? Start Here.
                                </h2>
                                <p className="text-blue-100/80 text-lg leading-relaxed mb-6">
                                    Explore our comprehensive Learning Hub. Master the basics, understand market cycles, and learn professional trading strategies—completely free.
                                </p>
                                <div className="flex flex-wrap gap-3">
                                    {['Blockchain Basics', 'Technical Analysis', 'Risk Management'].map((tag, i) => (
                                        <span key={i} className="px-3 py-1 rounded-lg bg-white/10 text-white/90 text-xs font-medium border border-white/10">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                            <button
                                onClick={() => navigate('/learn/academy')}
                                className="px-8 py-4 bg-white text-blue-900 rounded-full font-bold text-lg hover:bg-blue-50 transition-all hover:scale-105 shadow-xl flex items-center gap-2 whitespace-nowrap"
                            >
                                Enter Learning Hub <ArrowRight className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <div className="relative z-10 border-t border-slate-200 dark:border-slate-800/50 bg-white/50 dark:bg-slate-950/50 backdrop-blur-xl mt-20">
                <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="text-center md:text-left">
                        <p className="text-sm font-bold text-slate-700 dark:text-slate-300">Developed & Designed by UltronFX</p>
                        <p className="text-xs text-slate-500 mt-1">© 2025 UltronFX. All Rights Reserved.</p>
                    </div>
                    <div className="flex gap-6 text-sm text-slate-500">
                        <a href="#" className="hover:text-slate-900 dark:hover:text-white transition-colors">Privacy Policy</a>
                        <a href="#" className="hover:text-slate-900 dark:hover:text-white transition-colors">Terms of Service</a>
                        <a href="mailto:sounakrider885@gmail.com" className="hover:text-slate-900 dark:hover:text-white transition-colors">Contact</a>
                    </div>
                </div>
            </div>
        </div>
    );
};

const FeatureCard = ({ icon: Icon, title, desc }) => (
    <div className="p-6 rounded-2xl bg-white/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 hover:border-blue-500/30 transition-colors text-left group shadow-sm dark:shadow-none h-full flex flex-col">
        <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-500/10 transition-colors shrink-0">
            <Icon className="w-6 h-6 text-blue-500 dark:text-blue-400" />
        </div>
        <h3 className="text-lg font-bold mb-2 text-slate-800 dark:text-slate-200">{title}</h3>
        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed flex-1">{desc}</p>
    </div>
);

export default WelcomePage;
