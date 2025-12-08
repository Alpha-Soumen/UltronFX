import React, { useState, useEffect } from 'react';
import { ArrowUpRight, ArrowDownRight, Flame, Rocket, BarChart3, ChevronRight, ChevronDown } from 'lucide-react';

const MarketOverview = ({ dataMode }) => {
    const [currency, setCurrency] = useState('USD');
    const [isCurrencyDropdownOpen, setIsCurrencyDropdownOpen] = useState(false);
    const [globalStats, setGlobalStats] = useState({
        marketCap: 3.04,
        marketCapChange: 3.1,
        volume: 111.65,
        volumeChange: -5.2
    });
    const [trending, setTrending] = useState([]);
    const [topGainers, setTopGainers] = useState([]);

    const currencies = {
        USD: { symbol: '$', rate: 1, name: 'USD' },
        INR: { symbol: '₹', rate: 84.5, name: 'INR' },
        EUR: { symbol: '€', rate: 0.92, name: 'EUR' },
        GBP: { symbol: '£', rate: 0.79, name: 'GBP' }
    };

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await fetch('http://127.0.0.1:8000/market-overview');
                const data = await res.json();

                // Convert raw values to Trillion/Billion for display
                setGlobalStats({
                    marketCap: data.market_cap_usd / 1e12,
                    marketCapChange: data.market_cap_change_24h,
                    volume: data.volume_usd / 1e9,
                    volumeChange: data.volume_change_24h
                });

                if (data.trending) setTrending(data.trending);
                if (data.top_gainers) setTopGainers(data.top_gainers);

            } catch (error) {
                console.error("Failed to fetch market stats", error);
            }
        };

        fetchStats(); // Initial fetch

        let interval;
        if (dataMode === 'LIVE') {
            interval = setInterval(fetchStats, 10000); // Poll every 10s in LIVE mode
        }

        return () => clearInterval(interval);
    }, [dataMode]);

    const formatPrice = (price, isLarge = false) => {
        const converted = price * currencies[currency].rate;
        if (isLarge) {
            return `${currencies[currency].symbol}${converted.toFixed(2)}`;
        }
        // For small crypto prices, show more decimals
        return converted < 1
            ? `${currencies[currency].symbol}${converted.toFixed(4)}`
            : `${currencies[currency].symbol}${converted.toFixed(2)}`;
    };

    return (
        <div className="w-full flex flex-col gap-4 mb-8">
            {/* Currency Selector Row */}
            <div className="flex justify-end">
                <div className="relative">
                    <button
                        onClick={() => setIsCurrencyDropdownOpen(!isCurrencyDropdownOpen)}
                        className="flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-300 hover:border-blue-500 transition-colors"
                    >
                        <span>{currencies[currency].symbol} {currency}</span>
                        <ChevronDown className="w-4 h-4" />
                    </button>

                    {isCurrencyDropdownOpen && (
                        <div className="absolute right-0 mt-2 w-32 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl z-50 overflow-hidden animate-fadeIn">
                            {Object.keys(currencies).map((curr) => (
                                <button
                                    key={curr}
                                    onClick={() => {
                                        setCurrency(curr);
                                        setIsCurrencyDropdownOpen(false);
                                    }}
                                    className={`w-full text-left px-4 py-2 text-sm hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors flex items-center justify-between ${currency === curr ? 'text-blue-500 font-bold' : 'text-slate-700 dark:text-slate-300'}`}
                                >
                                    <span>{currencies[curr].name}</span>
                                    <span className="text-slate-400">{currencies[curr].symbol}</span>
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Market Overview Card */}
                <div className="glass-card p-6 flex flex-col justify-between">
                    <div className="flex justify-between items-start mb-4">
                        <h3 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
                            <BarChart3 className="w-5 h-5 text-blue-500" />
                            Market Overview
                        </h3>
                        <div className="flex items-center gap-1 text-xs font-medium text-green-500 bg-green-500/10 px-2 py-1 rounded-full">
                            Highlights <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse ml-1"></div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div>
                            <div className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                                {formatPrice(globalStats.marketCap, true)} Trillion
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                                <span className="text-sm text-slate-500 dark:text-slate-400 font-medium">Market Cap</span>
                                <span className={`text-xs font-bold flex items-center ${globalStats.marketCapChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                    {globalStats.marketCapChange >= 0 ? <ArrowUpRight className="w-3 h-3 mr-0.5" /> : <ArrowDownRight className="w-3 h-3 mr-0.5" />}
                                    {Math.abs(globalStats.marketCapChange).toFixed(1)}%
                                </span>
                            </div>
                            {/* Mini Sparkline Simulation */}
                            <div className="h-10 w-full mt-2 flex items-end gap-1 opacity-50">
                                {[40, 45, 42, 48, 55, 52, 58, 63, 60, 65].map((h, i) => (
                                    <div key={i} style={{ height: `${h}%` }} className={`flex-1 rounded-t-sm ${globalStats.marketCapChange >= 0 ? 'bg-green-500/20' : 'bg-red-500/20'}`}></div>
                                ))}
                            </div>
                        </div>

                        <div className="pt-4 border-t border-slate-200 dark:border-slate-700/50">
                            <div className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                                {formatPrice(globalStats.volume, true)} Billion
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                                <span className="text-sm text-slate-500 dark:text-slate-400 font-medium">24h Volume</span>
                                <span className={`text-xs font-bold flex items-center ${globalStats.volumeChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                    {globalStats.volumeChange >= 0 ? <ArrowUpRight className="w-3 h-3 mr-0.5" /> : <ArrowDownRight className="w-3 h-3 mr-0.5" />}
                                    {Math.abs(globalStats.volumeChange).toFixed(1)}%
                                </span>
                            </div>
                            {/* Mini Sparkline Simulation */}
                            <div className="h-10 w-full mt-2 flex items-end gap-1 opacity-50">
                                {[60, 55, 50, 45, 40, 35, 38, 32, 30, 28].map((h, i) => (
                                    <div key={i} style={{ height: `${h}%` }} className={`flex-1 rounded-t-sm ${globalStats.volumeChange >= 0 ? 'bg-green-500/20' : 'bg-red-500/20'}`}></div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Trending Card */}
                <div className="glass-card p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
                            <Flame className="w-5 h-5 text-orange-500" />
                            Trending
                        </h3>
                        <button className="text-xs font-medium text-slate-500 hover:text-blue-500 flex items-center transition-colors">
                            View more <ChevronRight className="w-3 h-3 ml-0.5" />
                        </button>
                    </div>
                    <div className="space-y-4">
                        {trending.map((coin, index) => (
                            <div key={index} className="flex items-center justify-between group cursor-pointer hover:bg-slate-100/50 dark:hover:bg-slate-800/50 p-2 -mx-2 rounded-lg transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-xs font-bold text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                                        {coin.symbol[0]}
                                    </div>
                                    <div>
                                        <div className="font-bold text-slate-800 dark:text-white text-sm">{coin.name}</div>
                                        <div className="text-xs text-slate-500">{coin.symbol}</div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="font-bold text-slate-800 dark:text-white text-sm">{formatPrice(coin.price)}</div>
                                    <div className={`text-xs font-bold flex items-center justify-end ${coin.isUp ? 'text-green-500' : 'text-red-500'}`}>
                                        {coin.isUp ? <ArrowUpRight className="w-3 h-3 mr-0.5" /> : <ArrowDownRight className="w-3 h-3 mr-0.5" />}
                                        {coin.change}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Top Gainers Card */}
                <div className="glass-card p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
                            <Rocket className="w-5 h-5 text-purple-500" />
                            Top Gainers
                        </h3>
                        <button className="text-xs font-medium text-slate-500 hover:text-blue-500 flex items-center transition-colors">
                            View more <ChevronRight className="w-3 h-3 ml-0.5" />
                        </button>
                    </div>
                    <div className="space-y-4">
                        {topGainers.map((coin, index) => (
                            <div key={index} className="flex items-center justify-between group cursor-pointer hover:bg-slate-100/50 dark:hover:bg-slate-800/50 p-2 -mx-2 rounded-lg transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-xs font-bold text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                                        {coin.symbol[0]}
                                    </div>
                                    <div>
                                        <div className="font-bold text-slate-800 dark:text-white text-sm">{coin.name}</div>
                                        <div className="text-xs text-slate-500">{coin.symbol}</div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="font-bold text-slate-800 dark:text-white text-sm">{formatPrice(coin.price)}</div>
                                    <div className={`text-xs font-bold flex items-center justify-end ${coin.isUp ? 'text-green-500' : 'text-red-500'}`}>
                                        {coin.isUp ? <ArrowUpRight className="w-3 h-3 mr-0.5" /> : <ArrowDownRight className="w-3 h-3 mr-0.5" />}
                                        {coin.change}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MarketOverview;
