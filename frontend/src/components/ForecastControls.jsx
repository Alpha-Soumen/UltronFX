import React, { useState } from 'react';
import { Calendar, Download, ArrowRight } from 'lucide-react';
import ExportModal from './ExportModal';

const ForecastControls = ({
    dateRange,
    setDateRange,
    horizon,
    setHorizon,
    onDownload,
    currentCoin // Need to pass this prop from Dashboard
}) => {
    const [isExportModalOpen, setIsExportModalOpen] = useState(false);

    return (
        <>
            <div className="w-full glass-card mt-6 animate-fadeIn p-6 relative z-50">
                <div className="flex flex-col md:flex-row gap-6 justify-between items-end">

                    {/* Date Range */}
                    <div className="flex flex-col gap-2 w-full md:w-auto">
                        <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-2">
                            <Calendar className="w-3 h-3" /> Analysis Period
                        </label>
                        <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-900/50 p-1 rounded-xl border border-slate-200 dark:border-slate-800">
                            <input
                                type="date"
                                value={dateRange.start}
                                onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                                className="bg-transparent border-none text-sm font-medium text-slate-700 dark:text-slate-300 focus:ring-0 px-3 py-1.5"
                            />
                            <ArrowRight className="w-4 h-4 text-slate-400" />
                            <input
                                type="date"
                                value={dateRange.end}
                                onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                                className="bg-transparent border-none text-sm font-medium text-slate-700 dark:text-slate-300 focus:ring-0 px-3 py-1.5"
                            />
                        </div>
                    </div>

                    {/* Forecast Horizon */}
                    <div className="flex flex-col gap-2 w-full md:w-auto">
                        <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                            Prediction Horizon
                        </label>
                        <div className="flex bg-slate-100 dark:bg-slate-900/50 p-1 rounded-xl border border-slate-200 dark:border-slate-800">
                            {[7, 14, 30].map((days) => (
                                <button
                                    key={days}
                                    onClick={() => setHorizon(days)}
                                    className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-all ${horizon === days
                                        ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm'
                                        : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                                        }`}
                                >
                                    {days}D
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Export Button */}
                    <div className="relative">
                        <button
                            onClick={() => setIsExportModalOpen(true)}
                            className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-lg shadow-blue-500/30 transition-all active:scale-95"
                        >
                            <Download className="w-4 h-4" />
                            Export Report
                        </button>
                    </div>
                </div>
            </div>

            <ExportModal
                isOpen={isExportModalOpen}
                onClose={() => setIsExportModalOpen(false)}
                coin={currentCoin}
                dateRange={dateRange}
                onDownload={onDownload}
            />
        </>
    );
};

export default ForecastControls;
