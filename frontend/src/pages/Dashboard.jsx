import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CoinSelector from '../components/CoinSelector';
import HistoricalChart from '../components/HistoricalChart';
import ForecastControls from '../components/ForecastControls';
import ThemeToggle from '../components/ThemeToggle';
import { useAuth } from '../context/AuthContext';
import { LogOut, User, BookOpen } from 'lucide-react';
import AnimatedBackground from '../components/AnimatedBackground';
import AdminPanel from '../components/AdminPanel';
import Footer from '../components/Footer';
import MarketOverview from '../components/MarketOverview';
import AIMarketInsight from '../components/AIMarketInsight';

const Dashboard = () => {
    const navigate = useNavigate();
    const [currentCoin, setCurrentCoin] = useState(null);
    const [dateRange, setDateRange] = useState({ start: '2025-01-01', end: '2025-12-15' });
    const [horizon, setHorizon] = useState(7);
    const [isAdminPanelOpen, setIsAdminPanelOpen] = useState(false);
    const [dataMode, setDataMode] = useState('STATIC');
    const { user, logout } = useAuth();

    const isAdmin = user?.email === 'admin@ultronfx.com';

    useEffect(() => {
        // Fetch Data Mode
        const fetchMode = () => {
            fetch('http://127.0.0.1:8000/admin/mode')
                .then(res => res.json())
                .then(data => setDataMode(data.mode))
                .catch(err => console.error("Failed to fetch data mode", err));
        };

        fetchMode();

        // Poll for mode changes every 5 seconds
        const interval = setInterval(fetchMode, 5000);
        return () => clearInterval(interval);
    }, []);

    const handleDownload = async (type) => {
        if (!currentCoin) return;

        try {
            // 1. Always fetch history first (needed for all types)
            const historyRes = await fetch(`http://127.0.0.1:8000/history/${currentCoin}`);
            const historyData = await historyRes.json();

            if (historyData.error) {
                alert("Error fetching data for download");
                return;
            }

            let csvContent = "data:text/csv;charset=utf-8,";
            let filename = `${currentCoin}_${type}_data.csv`;
            let finalRows = [];

            // Helper to format row
            const formatRow = (date, open, high, low, close, volume, typeLabel) => {
                return `${date},${open},${high},${low},${close},${volume},${typeLabel}\n`;
            };

            // Process Historical Data
            const historicalRows = historyData.data.map(d => ({
                date: d.x,
                open: d.y[0],
                high: d.y[1],
                low: d.y[2],
                close: d.y[3],
                volume: d.volume,
                type: 'Historical'
            }));

            if (type === 'historical') {
                csvContent += "Date,Open,High,Low,Close,Volume,Type\n";
                historicalRows.forEach(row => {
                    if (dateRange.start && new Date(row.date) < new Date(dateRange.start)) return;
                    if (dateRange.end && new Date(row.date) > new Date(dateRange.end)) return;
                    csvContent += formatRow(row.date, row.open, row.high, row.low, row.close, row.volume, row.type);
                });
            }
            else if (type === 'prediction' || type === 'combined') {
                // 2. Prepare window for prediction (last 72 points)
                // We need to format it exactly as the model expects: 
                // [open, high, low, close, volume, ema_10, ema_21, ma_7, ma_30, rsi, adi, obv, cmf, ret1, pct, day, weekend]
                // Since the frontend doesn't compute indicators, we rely on the backend's LIVE mode or 
                // we send a simplified window if in STATIC mode (which might fail if backend expects 17 features).

                // However, app.py /predict endpoint expects the window.
                // If we are in LIVE mode, the backend ignores our window and fetches its own.
                // If we are in STATIC mode, we might have an issue.
                // For now, let's assume LIVE mode or that the backend handles it.
                // We'll send a dummy window to satisfy the schema.

                const dummyWindow = Array(72).fill(Array(17).fill(0));

                const predictRes = await fetch(`http://127.0.0.1:8000/predict`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        coin: currentCoin,
                        window: dummyWindow // Backend handles fetching in LIVE mode
                    })
                });

                const predictData = await predictRes.json();

                if (predictData.pred_7) {
                    // Generate future dates
                    const lastDate = new Date(historicalRows[historicalRows.length - 1].date);
                    const predictionRows = predictData.pred_7.map((price, index) => {
                        const nextDate = new Date(lastDate);
                        nextDate.setDate(lastDate.getDate() + index + 1);
                        return {
                            date: nextDate.toISOString().split('T')[0],
                            open: price, // Simplified: use predicted price for all OHLC
                            high: price,
                            low: price,
                            close: price,
                            volume: 0,
                            type: 'Prediction'
                        };
                    });

                    csvContent += "Date,Open,High,Low,Close,Volume,Type\n";

                    if (type === 'combined') {
                        // Add historical first
                        historicalRows.forEach(row => {
                            if (dateRange.start && new Date(row.date) < new Date(dateRange.start)) return;
                            // Don't filter end date for combined, or maybe we should?
                            // Let's respect the filter for history
                            if (dateRange.end && new Date(row.date) > new Date(dateRange.end)) return;
                            csvContent += formatRow(row.date, row.open, row.high, row.low, row.close, row.volume, row.type);
                        });
                        // Add predictions
                        predictionRows.forEach(row => {
                            csvContent += formatRow(row.date, row.open.toFixed(4), row.high.toFixed(4), row.low.toFixed(4), row.close.toFixed(4), row.volume, row.type);
                        });
                    } else {
                        // Prediction only
                        predictionRows.forEach(row => {
                            csvContent += formatRow(row.date, row.open.toFixed(4), row.high.toFixed(4), row.low.toFixed(4), row.close.toFixed(4), row.volume, row.type);
                        });
                    }
                }
            }

            // Trigger Download
            const encodedUri = encodeURI(csvContent);
            const link = document.createElement("a");
            link.setAttribute("href", encodedUri);
            link.setAttribute("download", filename);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

        } catch (err) {
            console.error("Download failed:", err);
            alert("Failed to download data");
        }
    };

    return (
        <AnimatedBackground>
            <div className="min-h-screen flex flex-col items-center pt-10 pb-0 px-0">
                <div className="w-full px-4 flex flex-col items-center">
                    <div className="absolute top-4 right-4 flex items-center gap-4 z-50">
                        {dataMode === 'LIVE' && (
                            <div className="flex items-center gap-2 px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-full animate-pulse">
                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                <span className="text-xs font-bold text-green-500">LIVE DATA</span>
                            </div>
                        )}
                        <button
                            onClick={() => isAdmin ? setIsAdminPanelOpen(true) : navigate('/settings')}
                            className={`text-sm font-medium hidden md:block glass-card px-4 py-2 transition-all ${isAdmin ? 'cursor-pointer hover:bg-blue-500/10 hover:border-blue-500/50 text-blue-600 dark:text-blue-400' : 'cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300'}`}
                        >
                            {user?.full_name || user?.email}
                            {isAdmin && <span className="ml-2 text-xs bg-blue-500 text-white px-1.5 py-0.5 rounded-full">ADMIN</span>}
                        </button>
                        <button
                            onClick={() => navigate('/learn/academy')}
                            className="p-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-slate-600 dark:text-slate-300 hover:bg-blue-500/20 hover:text-blue-500 transition-colors"
                            title="Learning Hub"
                        >
                            <BookOpen className="w-5 h-5" />
                        </button>
                        <button
                            onClick={() => navigate('/settings')}
                            className="p-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-slate-600 dark:text-slate-300 hover:bg-blue-500/20 hover:text-blue-500 transition-colors"
                            title="Settings"
                        >
                            <User className="w-5 h-5" />
                        </button>
                        <ThemeToggle />
                        <button
                            onClick={logout}
                            className="p-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-slate-600 dark:text-slate-300 hover:bg-red-500/20 hover:text-red-500 transition-colors"
                            title="Logout"
                        >
                            <LogOut className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="flex items-center gap-4 mb-12 animate-float">
                        <img src="/logo.png" alt="UltronFX Logo" className="w-16 h-16 rounded-xl shadow-lg shadow-blue-500/20" />
                        <h1 className="text-6xl font-black bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 bg-clip-text text-transparent tracking-tighter drop-shadow-lg">
                            UltronFX
                        </h1>
                    </div>

                    <div className="w-full max-w-[1600px] flex flex-col gap-8 items-center mb-8 z-10">
                        <div className="glass-card w-full flex flex-col gap-6 items-center p-8">
                            <label className="text-slate-500 dark:text-slate-400 text-xs uppercase tracking-[0.3em] font-bold">
                                Select Asset
                            </label>

                            <CoinSelector onSelect={(coin) => setCurrentCoin(coin)} />
                        </div>

                        {/* Market Overview Section */}
                        <MarketOverview dataMode={dataMode} />
                    </div>

                    {currentCoin && (
                        <div className="w-full max-w-[1600px] flex flex-col gap-8 animate-fadeIn z-10">
                            <ForecastControls
                                dateRange={dateRange}
                                setDateRange={setDateRange}
                                horizon={horizon}
                                setHorizon={setHorizon}
                                onDownload={handleDownload}
                                currentCoin={currentCoin}
                            />

                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                <div className="lg:col-span-2">
                                    <HistoricalChart
                                        coin={currentCoin}
                                        dateRange={dateRange}
                                        horizon={horizon}
                                        dataMode={dataMode}
                                    />
                                </div>
                                <div className="lg:col-span-1 h-full">
                                    <AIMarketInsight coin={currentCoin} dataMode={dataMode} />
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <Footer />
            </div>

            <AdminPanel isOpen={isAdminPanelOpen} onClose={() => setIsAdminPanelOpen(false)} />
        </AnimatedBackground>
    );
};

export default Dashboard;
