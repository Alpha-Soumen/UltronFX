import React, { useState, useEffect, useRef } from 'react';
import {
    X, Activity, Server, Database, Terminal, CheckCircle, AlertCircle,
    Cpu, HardDrive, Zap, Bell, Shield, RefreshCw, Trash2, FileText,
    Layers, Clock, BarChart2, Lock, MessageSquare
} from 'lucide-react';

const AdminPanel = ({ isOpen, onClose }) => {
    const [health, setHealth] = useState(null);
    const [version, setVersion] = useState(null);
    const [stats, setStats] = useState(null);
    const [logs, setLogs] = useState([]);
    const [feedback, setFeedback] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('overview');

    // Simulated Real-time Metrics
    const [metrics, setMetrics] = useState({
        cpu: 0,
        memory: 0,
        rps: 0,
        latency: 0,
        gpu: 0
    });

    const [dataMode, setDataMode] = useState('STATIC');

    const [users, setUsers] = useState([]);

    useEffect(() => {
        if (isOpen) {
            fetchData();
            const interval = setInterval(updateMetrics, 1000);
            return () => clearInterval(interval);
        }
    }, [isOpen]);

    useEffect(() => {
        if (isOpen && activeTab === 'users') {
            fetchUsers();
        }
    }, [isOpen, activeTab]);

    const updateMetrics = () => {
        setMetrics(prev => ({
            cpu: Math.floor(Math.random() * 30) + 10, // 10-40%
            memory: Math.floor(Math.random() * 20) + 40, // 40-60%
            rps: Math.floor(Math.random() * 50) + 10, // 10-60 req/s
            latency: Math.floor(Math.random() * 20) + 30, // 30-50ms
            gpu: Math.floor(Math.random() * 15) + 5 // 5-20%
        }));
    };

    const fetchData = async () => {
        setLoading(true);
        try {
            const [healthRes, versionRes, statsRes, logsRes, feedbackRes, modeRes] = await Promise.all([
                fetch('http://127.0.0.1:8000/health'),
                fetch('http://127.0.0.1:8000/version'),
                fetch('http://127.0.0.1:8000/stats'),
                fetch('http://127.0.0.1:8000/logs'),
                fetch('http://127.0.0.1:8000/feedback'),
                fetch('http://127.0.0.1:8000/admin/mode')
            ]);

            setHealth(await healthRes.json());
            setVersion(await versionRes.json());
            setStats(await statsRes.json());
            const logsData = await logsRes.json();
            setLogs(logsData.logs || []);
            setFeedback(await feedbackRes.json());
            const modeData = await modeRes.json();
            setDataMode(modeData.mode);
        } catch (error) {
            console.error("Failed to fetch admin data", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchUsers = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('http://127.0.0.1:8000/users', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (res.ok) {
                const data = await res.json();
                setUsers(data);
            } else {
                console.error("Failed to fetch users");
            }
        } catch (error) {
            console.error("Error fetching users", error);
        }
    };

    const toggleDataMode = async () => {
        const newMode = dataMode === 'STATIC' ? 'LIVE' : 'STATIC';
        try {
            const res = await fetch('http://127.0.0.1:8000/admin/mode', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ mode: newMode })
            });
            const data = await res.json();
            if (data.status === 'success') {
                setDataMode(data.mode);
                // Add log entry
                setLogs(prev => [`Switched to ${data.mode} MODE`, ...prev]);
            }
        } catch (error) {
            console.error("Failed to toggle mode", error);
        }
    };

    const formatUptime = (seconds) => {
        if (!seconds) return "00:00:00";
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = Math.floor(seconds % 60);
        return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex justify-end">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* Panel */}
            <div className={`relative w-full max-w-2xl h-full shadow-2xl border-l flex flex-col animate-slideInRight ${dataMode === 'LIVE' ? 'bg-slate-950 border-blue-900/50' : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800'}`}>

                {/* Top Bar */}
                <div className={`p-4 border-b flex justify-between items-center z-10 ${dataMode === 'LIVE' ? 'bg-slate-900 border-blue-900/30' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'}`}>
                    <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg relative ${dataMode === 'LIVE' ? 'bg-blue-500/20' : 'bg-blue-500/10'}`}>
                            <Shield className={`w-5 h-5 ${dataMode === 'LIVE' ? 'text-blue-400' : 'text-blue-600 dark:text-blue-400'}`} />
                            <span className={`absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full border-2 ${dataMode === 'LIVE' ? 'bg-green-400 border-slate-900 animate-ping' : 'bg-green-500 border-white dark:border-slate-900 animate-pulse'}`}></span>
                        </div>
                        <div>
                            <h2 className={`text-lg font-bold tracking-tight flex items-center gap-2 ${dataMode === 'LIVE' ? 'text-white' : 'text-slate-800 dark:text-white'}`}>
                                System Status
                                {dataMode === 'LIVE' && (
                                    <span className="px-2 py-0.5 rounded-full bg-red-500/20 text-red-500 text-xs font-black border border-red-500/30 animate-pulse">
                                        LIVE
                                    </span>
                                )}
                            </h2>
                            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                                <span className={`px-1.5 py-0.5 rounded font-mono ${dataMode === 'LIVE' ? 'bg-blue-900/50 text-blue-400' : 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'}`}>ADMIN</span>
                                <span>•</span>
                                <span>v{version?.api_version || '2.0'}</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <button className={`p-2 rounded-full transition-colors relative ${dataMode === 'LIVE' ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500'}`}>
                            <Bell className="w-5 h-5" />
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
                        </button>
                        <button
                            onClick={onClose}
                            className={`p-2 rounded-full transition-colors ${dataMode === 'LIVE' ? 'hover:bg-red-900/30 text-slate-400 hover:text-red-400' : 'hover:bg-red-50 dark:hover:bg-red-900/20 text-slate-500 hover:text-red-500'}`}
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Tabs */}
                <div className={`flex border-b ${dataMode === 'LIVE' ? 'bg-slate-900 border-blue-900/30' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'}`}>
                    <button
                        onClick={() => setActiveTab('overview')}
                        className={`flex-1 py-3 text-sm font-medium transition-colors border-b-2 ${activeTab === 'overview'
                            ? (dataMode === 'LIVE' ? 'border-blue-500 text-blue-400' : 'border-blue-500 text-blue-600 dark:text-blue-400')
                            : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                    >
                        System Overview
                    </button>
                    <button
                        onClick={() => setActiveTab('users')}
                        className={`flex-1 py-3 text-sm font-medium transition-colors border-b-2 ${activeTab === 'users'
                            ? (dataMode === 'LIVE' ? 'border-blue-500 text-blue-400' : 'border-blue-500 text-blue-600 dark:text-blue-400')
                            : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                    >
                        User Management
                    </button>
                    <button
                        onClick={() => setActiveTab('feedback')}
                        className={`flex-1 py-3 text-sm font-medium transition-colors border-b-2 ${activeTab === 'feedback'
                            ? (dataMode === 'LIVE' ? 'border-blue-500 text-blue-400' : 'border-blue-500 text-blue-600 dark:text-blue-400')
                            : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                    >
                        User Feedback
                        {feedback.length > 0 && <span className={`ml-2 px-1.5 py-0.5 rounded-full text-xs ${dataMode === 'LIVE' ? 'bg-blue-900/50 text-blue-400' : 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'}`}>{feedback.length}</span>}
                    </button>
                </div>

                {/* Content */}
                <div className={`flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar ${dataMode === 'LIVE' ? 'bg-slate-950' : 'bg-slate-50 dark:bg-slate-950/50'}`}>

                    {activeTab === 'overview' ? (
                        dataMode === 'LIVE' ? (
                            <LiveOverview
                                metrics={metrics}
                                health={health}
                                stats={stats}
                                version={version}
                                logs={logs}
                                dataMode={dataMode}
                                toggleDataMode={toggleDataMode}
                            />
                        ) : (
                            <StaticOverview
                                metrics={metrics}
                                health={health}
                                stats={stats}
                                version={version}
                                logs={logs}
                                dataMode={dataMode}
                                toggleDataMode={toggleDataMode}
                            />
                        )
                    ) : activeTab === 'users' ? (
                        <UserManagementTab users={users} dataMode={dataMode} />
                    ) : (
                        <FeedbackTab feedback={feedback} />
                    )}

                </div>
            </div>
        </div>
    );
};

// --- SUB-COMPONENTS ---

const StaticOverview = ({ metrics, health, stats, version, logs, dataMode, toggleDataMode }) => (
    <>
        {/* Data Mode Toggle Card */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm flex items-center justify-between">
            <div>
                <h3 className="text-sm font-bold text-slate-800 dark:text-white flex items-center gap-2">
                    <Database className="w-4 h-4 text-blue-500" />
                    Data Source Configuration
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                    Using offline training dataset (Read-only)
                </p>
            </div>
            <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-lg p-1">
                <button
                    disabled
                    className="px-3 py-1.5 text-xs font-bold rounded-md bg-white dark:bg-slate-700 shadow text-blue-600 dark:text-blue-400 transition-all"
                >
                    STATIC
                </button>
                <button
                    onClick={toggleDataMode}
                    className="px-3 py-1.5 text-xs font-bold rounded-md text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-all"
                >
                    LIVE
                </button>
            </div>
        </div>

        {/* Smart Mode Suggestion */}
        {health?.recommendation && (
            <div className={`rounded-xl border p-4 flex items-start gap-4 ${health.recommendation === 'LIVE' ? 'bg-green-50 border-green-200 dark:bg-green-900/10 dark:border-green-900/30' : 'bg-yellow-50 border-yellow-200 dark:bg-yellow-900/10 dark:border-yellow-900/30'}`}>
                <div className={`p-2 rounded-lg ${health.recommendation === 'LIVE' ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' : 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400'}`}>
                    <Zap className="w-5 h-5" />
                </div>
                <div className="flex-1">
                    <h4 className={`text-sm font-bold ${health.recommendation === 'LIVE' ? 'text-green-800 dark:text-green-300' : 'text-yellow-800 dark:text-yellow-300'}`}>
                        Smart Suggestion: Switch to {health.recommendation} Mode
                    </h4>
                    <p className={`text-xs mt-1 ${health.recommendation === 'LIVE' ? 'text-green-700 dark:text-green-400' : 'text-yellow-700 dark:text-yellow-400'}`}>
                        {health.reason}
                    </p>
                    <div className="flex gap-4 mt-3">
                        <div className="flex items-center gap-2 text-xs">
                            <span className={`w-2 h-2 rounded-full ${health.binance?.status === 'online' ? 'bg-green-500' : 'bg-red-500'}`}></span>
                            <span className="text-slate-600 dark:text-slate-400">Binance: {health.binance?.latency}ms</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs">
                            <span className={`w-2 h-2 rounded-full ${health.coingecko?.status === 'online' ? 'bg-green-500' : 'bg-red-500'}`}></span>
                            <span className="text-slate-600 dark:text-slate-400">CoinGecko: {health.coingecko?.latency}ms</span>
                        </div>
                    </div>
                </div>
                {health.recommendation !== dataMode && (
                    <button
                        onClick={toggleDataMode}
                        className="px-3 py-1.5 text-xs font-bold bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                    >
                        Apply
                    </button>
                )}
            </div>
        )}

        {/* Section 1: Health & Uptime */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">System Uptime</p>
                        <h3 className="text-2xl font-mono font-bold text-slate-800 dark:text-white mt-1">
                            {formatUptime(health?.uptime_sec)}
                        </h3>
                    </div>
                    <div className={`p-2 rounded-lg ${health?.status === 'OK' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                        <Activity className="w-5 h-5" />
                    </div>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div className="h-full bg-green-500 animate-pulse w-full"></div>
                </div>
                <p className="text-xs text-green-600 dark:text-green-400 mt-2 flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" /> All systems operational
                </p>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Server Load</p>
                        <div className="flex items-baseline gap-2 mt-1">
                            <h3 className="text-2xl font-bold text-slate-800 dark:text-white">{metrics.cpu}%</h3>
                            <span className="text-xs text-slate-400">CPU</span>
                        </div>
                    </div>
                    <div className="p-2 bg-blue-500/10 text-blue-500 rounded-lg">
                        <Cpu className="w-5 h-5" />
                    </div>
                </div>
                <div className="flex gap-1 h-8 items-end">
                    {[...Array(10)].map((_, i) => (
                        <div
                            key={i}
                            className={`flex-1 rounded-sm transition-all duration-500 ${i < metrics.cpu / 10 ? 'bg-blue-500' : 'bg-slate-100 dark:bg-slate-800'}`}
                            style={{ height: `${Math.random() * 100}%` }}
                        ></div>
                    ))}
                </div>
            </div>
        </div>

        {/* Section 2: Performance Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <MetricCard icon={Zap} label="Latency" value={`${metrics.latency}ms`} color="text-yellow-500" bg="bg-yellow-500/10" />
            <MetricCard icon={Server} label="Requests" value={`${metrics.rps}/s`} color="text-purple-500" bg="bg-purple-500/10" />
            <MetricCard icon={HardDrive} label="Memory" value={`${metrics.memory}%`} color="text-cyan-500" bg="bg-cyan-500/10" />
            <MetricCard icon={Layers} label="GPU Load" value={`${metrics.gpu}%`} color="text-pink-500" bg="bg-pink-500/10" />
        </div>

        {/* Section 3: Model Stats */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
            <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                <Database className="w-4 h-4 text-blue-500" />
                Model Intelligence
            </h3>
            <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                    <StatRow label="Model Architecture" value={version?.model_version || 'TransformerV3'} />
                    <StatRow label="Parameters" value={stats?.model_parameters?.toLocaleString() || 'N/A'} />
                    <StatRow label="Sequence Length" value={`${stats?.seq_len || 72} Days`} />
                </div>
                <div className="space-y-4">
                    <StatRow label="Input Features" value={stats?.num_features || 17} />
                    <StatRow label="Prediction Horizon" value={`${stats?.prediction_len || 7} Days`} />
                    <StatRow label="Supported Assets" value={stats?.num_coins || 0} />
                </div>
            </div>
        </div>

        {/* Section 4: Endpoint Heatmap */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
            <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                <BarChart2 className="w-4 h-4 text-orange-500" />
                API Activity Heatmap
            </h3>
            <div className="space-y-3">
                <HeatmapRow endpoint="/predict" hits={85} />
                <HeatmapRow endpoint="/history" hits={92} />
                <HeatmapRow endpoint="/coins" hits={45} />
                <HeatmapRow endpoint="/stats" hits={12} />
            </div>
        </div>

        {/* Section 5: Logs Console */}
        <div className="bg-slate-950 rounded-xl border border-slate-800 p-4 shadow-sm flex flex-col h-64 font-mono text-xs">
            <div className="flex justify-between items-center mb-2 pb-2 border-b border-slate-800">
                <span className="text-slate-400 flex items-center gap-2">
                    <Terminal className="w-3 h-3" /> System Logs
                </span>
                <span className="text-green-500 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span> Live
                </span>
            </div>
            <div className="flex-1 overflow-y-auto space-y-1 custom-scrollbar">
                {logs.length > 0 ? logs.map((log, i) => (
                    <div key={i} className="text-slate-300">
                        <span className="text-slate-600">[{new Date().toLocaleTimeString()}]</span> {log}
                    </div>
                )) : (
                    <div className="text-slate-600 italic">Initializing system logger...</div>
                )}
                <div className="text-blue-400">
                    <span className="text-slate-600">[{new Date().toLocaleTimeString()}]</span> Monitoring active...
                </div>
            </div>
        </div>

        {/* Section 6: Quick Actions */}
        <div className="grid grid-cols-2 gap-3">
            <ActionButton icon={RefreshCw} label="Reload Model" />
            <ActionButton icon={Database} label="Refresh Dataset" />
            <ActionButton icon={Trash2} label="Clear Cache" />
            <ActionButton icon={FileText} label="Export Report" />
        </div>
    </>
);

const LiveOverview = ({ metrics, health, stats, version, logs, dataMode, toggleDataMode }) => (
    <>
        {/* Live Data Source Card */}
        <div className="bg-slate-900/50 rounded-xl border border-blue-500/30 p-5 shadow-[0_0_15px_rgba(59,130,246,0.1)] flex items-center justify-between relative overflow-hidden">
            <div className="absolute inset-0 bg-blue-500/5 animate-pulse"></div>
            <div className="relative z-10">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Activity className="w-4 h-4 text-green-400 animate-bounce" />
                    Real-Time Data Feed
                </h3>
                <p className="text-xs text-blue-200/70 mt-1 flex items-center gap-2">
                    Streaming from Binance / CoinGecko
                    <span className="w-1 h-1 bg-blue-400 rounded-full"></span>
                    Latency: <span className="text-green-400 font-mono">{metrics.latency}ms</span>
                </p>
            </div>
            <div className="flex items-center bg-slate-950 rounded-lg p-1 border border-slate-800 relative z-10">
                <button
                    onClick={toggleDataMode}
                    className="px-3 py-1.5 text-xs font-bold rounded-md text-slate-500 hover:text-slate-300 transition-all"
                >
                    STATIC
                </button>
                <button
                    disabled
                    className="px-3 py-1.5 text-xs font-bold rounded-md bg-gradient-to-r from-blue-600 to-cyan-600 shadow-lg shadow-blue-500/20 text-white transition-all flex items-center gap-1"
                >
                    <span className="w-1.5 h-1.5 bg-white rounded-full animate-ping"></span>
                    LIVE
                </button>
            </div>
        </div>

        {/* Section 1: Health & Uptime (Live) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-900/50 rounded-xl border border-slate-800 p-5 relative overflow-hidden group hover:border-blue-500/30 transition-colors">
                <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Activity className="w-16 h-16 text-blue-500" />
                </div>
                <div className="flex justify-between items-start mb-4 relative z-10">
                    <div>
                        <p className="text-xs font-medium text-blue-400 uppercase tracking-wider">System Uptime</p>
                        <h3 className="text-2xl font-mono font-bold text-white mt-1 tabular-nums">
                            {formatUptime(health?.uptime_sec)}
                        </h3>
                    </div>
                    <div className="p-2 rounded-lg bg-green-500/20 text-green-400 border border-green-500/30 animate-pulse">
                        <Activity className="w-5 h-5" />
                    </div>
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-green-500 to-emerald-400 w-full animate-pulse"></div>
                </div>
                <p className="text-xs text-green-400 mt-2 flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" /> Live Operations Normal
                </p>
            </div>

            <div className="bg-slate-900/50 rounded-xl border border-slate-800 p-5 relative overflow-hidden group hover:border-purple-500/30 transition-colors">
                <div className="flex justify-between items-start mb-4 relative z-10">
                    <div>
                        <p className="text-xs font-medium text-purple-400 uppercase tracking-wider">Server Load</p>
                        <div className="flex items-baseline gap-2 mt-1">
                            <h3 className="text-2xl font-bold text-white tabular-nums">{metrics.cpu}%</h3>
                            <span className="text-xs text-slate-400">CPU</span>
                        </div>
                    </div>
                    <div className="p-2 bg-purple-500/20 text-purple-400 rounded-lg border border-purple-500/30">
                        <Cpu className="w-5 h-5" />
                    </div>
                </div>
                <div className="flex gap-1 h-8 items-end">
                    {[...Array(15)].map((_, i) => (
                        <div
                            key={i}
                            className={`flex-1 rounded-sm transition-all duration-300 ${i < metrics.cpu / 6.6 ? 'bg-purple-500 shadow-[0_0_5px_rgba(168,85,247,0.5)]' : 'bg-slate-800/50'}`}
                            style={{ height: `${Math.random() * 60 + 20}%` }}
                        ></div>
                    ))}
                </div>
            </div>
        </div>

        {/* Section 2: Performance Metrics (Live) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <MetricCard icon={Zap} label="Latency" value={`${metrics.latency}ms`} color="text-yellow-400" bg="bg-yellow-400/10 border border-yellow-400/20" />
            <MetricCard icon={Server} label="Requests" value={`${metrics.rps}/s`} color="text-cyan-400" bg="bg-cyan-400/10 border border-cyan-400/20" />
            <MetricCard icon={HardDrive} label="Memory" value={`${metrics.memory}%`} color="text-emerald-400" bg="bg-emerald-400/10 border border-emerald-400/20" />
            <MetricCard icon={Layers} label="GPU Load" value={`${metrics.gpu}%`} color="text-pink-400" bg="bg-pink-400/10 border border-pink-400/20" />
        </div>

        {/* Section 3: Model Intelligence (Live) */}
        <div className="bg-slate-900/50 rounded-xl border border-slate-800 p-5 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl"></div>
            <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2 relative z-10">
                <Database className="w-4 h-4 text-blue-400" />
                Model Intelligence
                <span className="px-1.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-[10px] border border-blue-500/30">
                    ACTIVE
                </span>
            </h3>
            <div className="grid grid-cols-2 gap-6 relative z-10">
                <div className="space-y-4">
                    <StatRow label="Input Queue" value={`${Math.floor(Math.random() * 5)} Pending`} />
                    <StatRow label="Active Predictions" value={`${Math.floor(Math.random() * 3) + 1} Processing`} />
                    <StatRow label="Current TPS" value={`${(metrics.rps / 2).toFixed(1)}`} />
                </div>
                <div className="space-y-4">
                    <StatRow label="Model State" value={<span className="text-green-400 flex items-center gap-1"><span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span> Warm</span>} />
                    <StatRow label="Inference Time" value={`${metrics.latency - 10}ms`} />
                    <StatRow label="Confidence" value="98.2%" />
                </div>
            </div>
        </div>

        {/* Section 4: Endpoint Heatmap (Live) */}
        <div className="bg-slate-900/50 rounded-xl border border-slate-800 p-5 shadow-sm">
            <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                <BarChart2 className="w-4 h-4 text-orange-400" />
                Live API Throughput
            </h3>
            <div className="space-y-3">
                <HeatmapRow endpoint="/predict" hits={Math.floor(Math.random() * 20) + 70} animated />
                <HeatmapRow endpoint="/history" hits={Math.floor(Math.random() * 10) + 85} animated />
                <HeatmapRow endpoint="/coins" hits={Math.floor(Math.random() * 15) + 30} animated />
                <HeatmapRow endpoint="/stats" hits={Math.floor(Math.random() * 5) + 10} animated />
            </div>
        </div>

        {/* Section 5: Logs Console (Live) */}
        <div className="bg-black rounded-xl border border-slate-800 p-4 shadow-inner flex flex-col h-64 font-mono text-xs relative overflow-hidden">
            <div className="absolute inset-0 bg-green-500/5 pointer-events-none"></div>
            <div className="flex justify-between items-center mb-2 pb-2 border-b border-slate-800 relative z-10">
                <span className="text-slate-400 flex items-center gap-2">
                    <Terminal className="w-3 h-3" /> Live Stream
                </span>
                <span className="text-green-400 flex items-center gap-1 bg-green-900/30 px-2 py-0.5 rounded border border-green-500/30">
                    <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-ping"></span> CONNECTED
                </span>
            </div>
            <div className="flex-1 overflow-y-auto space-y-1 custom-scrollbar relative z-10">
                {logs.length > 0 ? logs.map((log, i) => (
                    <div key={i} className="text-slate-300 border-l-2 border-slate-800 pl-2 hover:bg-slate-900/50 transition-colors">
                        <span className="text-blue-500">[{new Date().toLocaleTimeString()}]</span> <span className={log.includes('ERROR') ? 'text-red-400' : 'text-slate-300'}>{log}</span>
                    </div>
                )) : (
                    <div className="text-slate-600 italic">Waiting for stream...</div>
                )}
                <div className="text-green-500/70 animate-pulse">_</div>
            </div>
        </div>
    </>
);

const UserManagementTab = ({ users, dataMode }) => (
    <div className="space-y-4">
        <div className={`p-4 rounded-xl border ${dataMode === 'LIVE' ? 'bg-slate-900/50 border-slate-800' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'}`}>
            <h3 className={`text-lg font-bold mb-4 ${dataMode === 'LIVE' ? 'text-white' : 'text-slate-800 dark:text-white'}`}>
                Registered Users ({users.length})
            </h3>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className={`text-xs uppercase ${dataMode === 'LIVE' ? 'text-slate-400 bg-slate-800/50' : 'text-slate-500 bg-slate-50 dark:bg-slate-800'}`}>
                        <tr>
                            <th className="px-4 py-3 rounded-l-lg">User</th>
                            <th className="px-4 py-3">Email</th>
                            <th className="px-4 py-3">Status</th>
                            <th className="px-4 py-3 rounded-r-lg">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {users.length > 0 ? users.map((user, index) => (
                            <tr key={index} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                <td className="px-4 py-3 font-medium text-slate-800 dark:text-white flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-full bg-blue-500/10 text-blue-500 flex items-center justify-center font-bold">
                                        {user.full_name ? user.full_name.charAt(0).toUpperCase() : 'U'}
                                    </div>
                                    {user.full_name || 'Unknown'}
                                </td>
                                <td className="px-4 py-3 text-slate-500 dark:text-slate-400">
                                    {user.email}
                                </td>
                                <td className="px-4 py-3">
                                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${user.disabled ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                                        {user.disabled ? 'Disabled' : 'Active'}
                                    </span>
                                </td>
                                <td className="px-4 py-3">
                                    <button className="text-blue-600 hover:underline text-xs">Edit</button>
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan="4" className="px-4 py-8 text-center text-slate-500">
                                    No users found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    </div>
);

const FeedbackTab = ({ feedback }) => (
    <div className="space-y-4">
        {feedback.length === 0 ? (
            <div className="text-center py-10 text-slate-500">
                <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-20" />
                <p>No feedback received yet.</p>
            </div>
        ) : (
            feedback.slice().reverse().map((item) => (
                <div key={item.id} className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
                    <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-2">
                            <span className={`px-2 py-1 rounded text-xs font-bold ${item.topic === 'Bug Report' ? 'bg-red-100 text-red-600' :
                                item.topic === 'Feature Request' ? 'bg-purple-100 text-purple-600' :
                                    'bg-blue-100 text-blue-600'
                                }`}>
                                {item.topic}
                            </span>
                            <span className="text-xs text-slate-400">
                                {new Date(item.timestamp).toLocaleString()}
                            </span>
                        </div>
                        <span className={`text-xs font-medium ${item.status === 'Resolved' ? 'text-green-500' : 'text-yellow-500'}`}>
                            {item.status}
                        </span>
                    </div>
                    <h4 className="font-bold text-slate-800 dark:text-white mb-1">{item.name}</h4>
                    <p className="text-xs text-slate-500 mb-3">{item.email}</p>
                    <p className="text-sm text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-950 p-3 rounded-lg border border-slate-100 dark:border-slate-800">
                        {item.message}
                    </p>
                </div>
            ))
        )}
    </div>
);

const MetricCard = ({ icon: Icon, label, value, color, bg }) => (
    <div className={`rounded-xl border p-4 flex flex-col items-center justify-center text-center shadow-sm hover:scale-105 transition-transform ${bg ? bg.includes('bg-white') ? bg : 'bg-slate-900/50 ' + bg : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'}`}>
        <div className={`p-2 rounded-lg mb-2 ${bg && !bg.includes('bg-white') ? '' : 'bg-slate-100 dark:bg-slate-800'} ${color}`}>
            <Icon className="w-5 h-5" />
        </div>
        <span className={`text-lg font-bold ${color ? 'text-white' : 'text-slate-800 dark:text-white'}`}>{value}</span>
        <span className="text-xs text-slate-500">{label}</span>
    </div>
);

const StatRow = ({ label, value }) => (
    <div className="flex justify-between items-center text-sm">
        <span className="text-slate-500 dark:text-slate-400">{label}</span>
        <span className="font-medium text-slate-800 dark:text-white">{value}</span>
    </div>
);

const HeatmapRow = ({ endpoint, hits, animated }) => (
    <div className="flex items-center gap-3 text-sm">
        <span className="w-20 font-mono text-slate-500 text-xs">{endpoint}</span>
        <div className="flex-1 h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div
                className={`h-full rounded-full ${animated ? 'bg-gradient-to-r from-orange-500 to-red-500 animate-pulse' : 'bg-gradient-to-r from-blue-500 to-purple-500'}`}
                style={{ width: `${hits}%` }}
            ></div>
        </div>
        <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{hits}%</span>
    </div>
);

const ActionButton = ({ icon: Icon, label }) => (
    <button className="flex items-center justify-center gap-2 p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-sm font-medium text-slate-700 dark:text-slate-300 shadow-sm">
        <Icon className="w-4 h-4" />
        {label}
    </button>
);

const formatUptime = (seconds) => {
    if (!seconds) return "00:00:00";
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
};

export default AdminPanel;
