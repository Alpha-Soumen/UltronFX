import React, { useState, useEffect } from 'react';
import { Info, Sparkles, TrendingUp, TrendingDown, Activity } from 'lucide-react';

const AIMarketInsight = ({ coin, dataMode }) => {
    const [insight, setInsight] = useState(null);
    const [isUpdating, setIsUpdating] = useState(false);

    const fetchInsight = async () => {
        if (!coin) return;

        try {
            const response = await fetch(`http://127.0.0.1:8000/insights/${coin}`);
            const data = await response.json();

            if (data.text) {
                setInsight(data);
            }
        } catch (error) {
            console.error("Failed to fetch insight:", error);
        }
    };

    useEffect(() => {
        // Initial load
        fetchInsight();

        // Poll for updates every 8 seconds (simulating live analysis)
        const interval = setInterval(() => {
            setIsUpdating(true);
            setTimeout(() => {
                fetchInsight();
                setIsUpdating(false);
            }, 800);
        }, 8000);

        return () => clearInterval(interval);
    }, [coin, dataMode]);

    if (!insight) return (
        <div className="h-full flex items-center justify-center glass-card border border-white/20 dark:border-slate-700/50">
            <div className="animate-pulse flex flex-col items-center gap-2">
                <div className="w-8 h-8 rounded-full border-2 border-blue-500 border-t-transparent animate-spin"></div>
                <span className="text-xs font-medium text-slate-500">Analyzing Market Data...</span>
            </div>
        </div>
    );

    return (
        <div className="h-full flex flex-col glass-card p-6 relative overflow-hidden group hover:shadow-lg transition-all duration-300 border border-white/20 dark:border-slate-700/50">
            {/* Background Glow */}
            <div className={`absolute top-0 right-0 w-32 h-32 rounded-full blur-[60px] opacity-20 transition-colors duration-1000 ${insight.sentiment === 'positive' ? 'bg-green-500' :
                    insight.sentiment === 'negative' ? 'bg-red-500' : 'bg-blue-500'
                }`}></div>

            {/* Header */}
            <div className="flex justify-between items-start mb-4 relative z-10">
                <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-blue-500" />
                    <h3 className="font-bold text-slate-800 dark:text-white tracking-tight">
                        AI Market Insight
                        {dataMode === 'LIVE' && <span className="ml-2 text-[10px] font-black text-red-500 bg-red-500/10 px-1.5 py-0.5 rounded border border-red-500/20 animate-pulse">LIVE</span>}
                    </h3>
                </div>
                <div className="relative">
                    <div className={`w-2 h-2 rounded-full ${isUpdating ? 'bg-blue-400 animate-ping' : 'bg-green-500 animate-pulse'}`}></div>
                </div>
            </div>

            {/* Body */}
            <div className="flex-1 flex flex-col justify-center relative z-10">
                <p className={`text-lg font-medium leading-relaxed transition-opacity duration-500 ${isUpdating ? 'opacity-50 blur-[1px]' : 'opacity-100'} ${insight.sentiment === 'positive' ? 'text-slate-800 dark:text-slate-100' :
                        insight.sentiment === 'negative' ? 'text-slate-800 dark:text-slate-100' : 'text-slate-700 dark:text-slate-200'
                    }`}>
                    "{insight.text}"
                </p>
            </div>

            {/* Footer / Tags */}
            <div className="mt-6 flex flex-wrap gap-2 relative z-10">
                <Tag icon={Activity} label="Live data interpretation" color="blue" />
                <Tag icon={insight.sentiment === 'positive' ? TrendingUp : insight.sentiment === 'negative' ? TrendingDown : Info} label="News-driven sentiment" color={insight.sentiment === 'positive' ? 'green' : insight.sentiment === 'negative' ? 'red' : 'slate'} />
                <Tag icon={Sparkles} label="Auto-updating insight" color="purple" />
            </div>
        </div>
    );
};

const Tag = ({ icon: Icon, label, color }) => {
    const colorClasses = {
        blue: 'bg-blue-50 text-blue-600 border-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800',
        green: 'bg-green-50 text-green-600 border-green-100 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800',
        red: 'bg-red-50 text-red-600 border-red-100 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800',
        purple: 'bg-purple-50 text-purple-600 border-purple-100 dark:bg-purple-900/20 dark:text-purple-400 dark:border-purple-800',
        slate: 'bg-slate-50 text-slate-600 border-slate-100 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700',
    };

    return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] uppercase font-bold tracking-wide border ${colorClasses[color]}`}>
            <Icon className="w-3 h-3" />
            {label}
        </span>
    );
};

export default AIMarketInsight;
