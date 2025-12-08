import React, { useState } from 'react';
import { X, FileText, TrendingUp, Activity, PieChart, BarChart2, Image, List, Smile, Play, Database, Download, FileSpreadsheet, File } from 'lucide-react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import html2canvas from 'html2canvas';

const ExportModal = ({ isOpen, onClose, coin, dateRange }) => {
    const [activeOption, setActiveOption] = useState('historical');
    const [format, setFormat] = useState('csv');
    const [isExporting, setIsExporting] = useState(false);

    if (!isOpen) return null;

    const exportOptions = [
        { id: 'historical', label: 'Historical Price Data', icon: FileText, desc: 'Open, High, Low, Close price history for any crypto asset.', formats: ['csv', 'xlsx', 'pdf'] },
        { id: 'prediction', label: 'AI Prediction Report', icon: TrendingUp, desc: 'Future predicted price ranges, trend direction, and probability scores.', formats: ['pdf', 'csv', 'xlsx'] },
        { id: 'signals', label: 'Trading Signals History', icon: Activity, desc: 'Buy/Sell signals with entry price, exit price, and confidence level.', formats: ['csv', 'xlsx', 'pdf'] },
        { id: 'portfolio', label: 'Portfolio PnL Report', icon: PieChart, desc: 'Profit-loss summary including realized/unrealized gains.', formats: ['pdf', 'csv', 'xlsx'] },
        { id: 'indicators', label: 'Technical Indicators', icon: BarChart2, desc: 'RSI, MACD, EMA, SMA values for strategy building.', formats: ['csv', 'xlsx', 'pdf'] },
        { id: 'chart', label: 'Candlestick Chart Export', icon: Image, desc: 'High-quality chart image of candlestick movements.', formats: ['png', 'pdf'] },
        { id: 'transactions', label: 'Transaction History', icon: List, desc: 'Deposit, withdrawal, transfer, and trade logs.', formats: ['csv', 'xlsx', 'pdf'] },
        { id: 'sentiment', label: 'Market Sentiment Report', icon: Smile, desc: 'Fear & Greed Index, AI sentiment score, and social mood.', formats: ['csv', 'xlsx', 'pdf'] },
        { id: 'backtest', label: 'Backtesting Report', icon: Play, desc: 'Strategy accuracy results including win rate and max drawdown.', formats: ['pdf', 'csv', 'xlsx'] },
        { id: 'orderbook', label: 'Order Book Snapshot', icon: Database, desc: 'Snapshot of market depth (bids, asks) and recent trades.', formats: ['csv', 'json', 'pdf'] }
    ];

    const handleExport = async () => {
        setIsExporting(true);
        try {
            let data = [];
            let filename = `${coin}_${activeOption}_${new Date().toISOString().split('T')[0]}`;

            // 1. Fetch Data based on Option
            if (activeOption === 'historical') {
                const res = await fetch(`http://127.0.0.1:8000/history/${coin}`);
                const json = await res.json();
                data = json.data.map(d => ({
                    Date: d.x, Open: d.y[0], High: d.y[1], Low: d.y[2], Close: d.y[3], Volume: d.volume
                }));
            }
            else if (activeOption === 'indicators') {
                const res = await fetch(`http://127.0.0.1:8000/export/indicators/${coin}`);
                data = await res.json();
            }
            else if (activeOption === 'sentiment') {
                const res = await fetch(`http://127.0.0.1:8000/export/sentiment`);
                data = await res.json();
            }
            else if (activeOption === 'orderbook') {
                const res = await fetch(`http://127.0.0.1:8000/export/orderbook/${coin}`);
                const json = await res.json();
                // Flatten for CSV/XLSX
                const bids = json.bids.map(b => ({ Type: 'Bid', Price: b.price, Qty: b.qty }));
                const asks = json.asks.map(a => ({ Type: 'Ask', Price: a.price, Qty: a.qty }));
                data = [...bids, ...asks];
            }
            else if (activeOption === 'prediction') {
                const dummyWindow = Array(72).fill(Array(17).fill(0));
                const res = await fetch(`http://127.0.0.1:8000/predict`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ coin, window: dummyWindow })
                });
                const json = await res.json();
                data = json.pred_7.map((p, i) => ({ Day: i + 1, PredictedPrice: p }));
            }
            // Mock Data for others
            else if (['signals', 'portfolio', 'transactions', 'backtest'].includes(activeOption)) {
                data = Array(10).fill(0).map((_, i) => ({
                    ID: i + 1,
                    Date: new Date().toISOString().split('T')[0],
                    Type: 'Mock Data',
                    Value: Math.random() * 1000
                }));
            }

            // 2. Generate File
            if (format === 'csv') {
                const headers = Object.keys(data[0]).join(',');
                const rows = data.map(row => Object.values(row).join(',')).join('\n');
                const csvContent = `data:text/csv;charset=utf-8,${headers}\n${rows}`;
                const encodedUri = encodeURI(csvContent);
                const link = document.createElement("a");
                link.setAttribute("href", encodedUri);
                link.setAttribute("download", `${filename}.csv`);
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }
            else if (format === 'xlsx') {
                const ws = XLSX.utils.json_to_sheet(data);
                const wb = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(wb, ws, "Report");
                XLSX.writeFile(wb, `${filename}.xlsx`);
            }
            else if (format === 'pdf') {
                const doc = new jsPDF();
                doc.text(`${activeItem.label} - ${coin}`, 14, 15);
                doc.setFontSize(10);
                doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 22);

                const headers = [Object.keys(data[0])];
                const rows = data.map(row => Object.values(row));

                doc.autoTable({
                    head: headers,
                    body: rows,
                    startY: 30,
                });
                doc.save(`${filename}.pdf`);
            }
            else if (format === 'json') {
                const jsonString = `data:text/json;chatset=utf-8,${encodeURIComponent(JSON.stringify(data, null, 2))}`;
                const link = document.createElement("a");
                link.href = jsonString;
                link.download = `${filename}.json`;
                link.click();
            }

            onClose();
        } catch (error) {
            console.error("Export failed:", error);
            alert(`Export failed: ${error.message}`);
        } finally {
            setIsExporting(false);
        }
    };

    const activeItem = exportOptions.find(opt => opt.id === activeOption);

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

            <div className="relative w-full max-w-4xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl flex overflow-hidden border border-slate-200 dark:border-slate-800 animate-in zoom-in-95 duration-200">

                {/* Sidebar */}
                <div className="w-1/3 bg-slate-50 dark:bg-slate-950 border-r border-slate-200 dark:border-slate-800 flex flex-col">
                    <div className="p-6 border-b border-slate-200 dark:border-slate-800">
                        <h2 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
                            <Download className="w-5 h-5 text-blue-500" />
                            Export Center
                        </h2>
                        <p className="text-xs text-slate-500 mt-1">Select a report type to download</p>
                    </div>
                    <div className="flex-1 overflow-y-auto p-2 space-y-1 custom-scrollbar">
                        {exportOptions.map((option) => (
                            <button
                                key={option.id}
                                onClick={() => { setActiveOption(option.id); setFormat(option.formats[0]); }}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeOption === option.id
                                        ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30'
                                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                                    }`}
                            >
                                <option.icon className="w-4 h-4" />
                                {option.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Main Content */}
                <div className="w-2/3 p-8 flex flex-col bg-white dark:bg-slate-900">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <h3 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-3">
                                <activeItem.icon className="w-8 h-8 text-blue-500" />
                                {activeItem.label}
                            </h3>
                            <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm leading-relaxed max-w-md">
                                {activeItem.desc}
                            </p>
                        </div>
                        <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-400 hover:text-red-500">
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    <div className="flex-1 flex flex-col justify-center items-center gap-8">
                        <div className="w-full max-w-md">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 block">Select Format</label>
                            <div className="grid grid-cols-3 gap-4">
                                {activeItem.formats.map((fmt) => (
                                    <button
                                        key={fmt}
                                        onClick={() => setFormat(fmt)}
                                        className={`flex flex-col items-center justify-center gap-2 p-4 rounded-xl border-2 transition-all ${format === fmt
                                                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                                                : 'border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-700 text-slate-500'
                                            }`}
                                    >
                                        {fmt === 'pdf' && <FileText className="w-6 h-6" />}
                                        {fmt === 'csv' && <FileSpreadsheet className="w-6 h-6" />}
                                        {fmt === 'xlsx' && <FileSpreadsheet className="w-6 h-6" />}
                                        {fmt === 'png' && <Image className="w-6 h-6" />}
                                        {fmt === 'json' && <Database className="w-6 h-6" />}
                                        <span className="uppercase font-bold text-sm">{fmt}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="w-full max-w-md bg-slate-50 dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
                            <div className="flex justify-between text-sm mb-2">
                                <span className="text-slate-500">Asset</span>
                                <span className="font-mono font-bold text-slate-800 dark:text-white">{coin}</span>
                            </div>
                            <div className="flex justify-between text-sm mb-2">
                                <span className="text-slate-500">Date Range</span>
                                <span className="font-mono font-bold text-slate-800 dark:text-white">
                                    {dateRange?.start || 'All'} - {dateRange?.end || 'Present'}
                                </span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-500">Estimated Size</span>
                                <span className="font-mono font-bold text-slate-800 dark:text-white">~250 KB</span>
                            </div>
                        </div>
                    </div>

                    <div className="mt-auto pt-6 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-3">
                        <button onClick={onClose} className="px-6 py-2.5 rounded-xl text-slate-500 font-medium hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                            Cancel
                        </button>
                        <button
                            onClick={handleExport}
                            disabled={isExporting}
                            className="px-8 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-lg shadow-blue-500/30 transition-all flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {isExporting ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Generating...
                                </>
                            ) : (
                                <>
                                    <Download className="w-4 h-4" />
                                    Download Report
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ExportModal;
