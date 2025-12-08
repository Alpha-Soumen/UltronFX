import React, { useState, useEffect } from 'react';
import Chart from 'react-apexcharts';
import { useTheme } from '../context/ThemeContext';
import { ChevronDown } from 'lucide-react';

const EXCHANGE_RATES = {
    'USD': 1,
    'INR': 83.5,
    'EUR': 0.92,
    'GBP': 0.79,
    'JPY': 150.5,
    'AED': 3.67,
    'SGD': 1.34,
    'AUD': 1.52,
    'CAD': 1.35,
    'USDT': 1
};

const CURRENCY_SYMBOLS = {
    'USD': '$',
    'INR': '₹',
    'EUR': '€',
    'GBP': '£',
    'JPY': '¥',
    'AED': 'د.إ',
    'SGD': 'S$',
    'AUD': 'A$',
    'CAD': 'C$',
    'USDT': '₮'
};

const HistoricalChart = ({ coin, dateRange, dataMode }) => {
    const [series, setSeries] = useState([]);
    const [chartType, setChartType] = useState('candlestick'); // candlestick or line
    const [currency, setCurrency] = useState('INR');
    const [isCurrencyOpen, setIsCurrencyOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [fullData, setFullData] = useState([]); // Store full data to filter locally
    const { theme } = useTheme();

    const fetchData = () => {
        if (!coin) return;

        // Only show loading on initial fetch or coin change, not on background polling
        if (fullData.length === 0) setLoading(true);
        setError(null);

        fetch(`http://127.0.0.1:8000/history/${coin}`)
            .then(res => res.json())
            .then(data => {
                if (data.error) {
                    setError(data.error);
                    setSeries([]);
                    setFullData([]);
                } else {
                    // Format data for ApexCharts
                    const formattedData = data.data.map(d => ({
                        x: new Date(d.x).getTime(),
                        y: d.y // [O, H, L, C] (Always in USD from backend)
                    }));
                    setFullData(formattedData);
                }
                setLoading(false);
            })
            .catch(err => {
                console.error("Failed to fetch history:", err);
                setError("Failed to load data");
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchData();
    }, [coin]);

    // Polling for LIVE mode (every 60 seconds)
    useEffect(() => {
        let interval;
        if (dataMode === 'LIVE') {
            interval = setInterval(fetchData, 60000);
        }
        return () => clearInterval(interval);
    }, [dataMode, coin]);

    // Filter and Convert data when dateRange, fullData, or currency changes
    useEffect(() => {
        if (fullData.length === 0) return;

        let filtered = fullData;
        if (dateRange?.start) {
            const startTime = new Date(dateRange.start).getTime();
            filtered = filtered.filter(d => d.x >= startTime);
        }
        if (dateRange?.end) {
            const endTime = new Date(dateRange.end).getTime();
            filtered = filtered.filter(d => d.x <= endTime);
        }

        // Apply Currency Conversion
        const rate = EXCHANGE_RATES[currency];
        const converted = filtered.map(d => ({
            x: d.x,
            y: d.y.map(val => val * rate)
        }));

        setSeries([{
            name: 'Price',
            data: converted
        }]);
    }, [fullData, dateRange, currency]);

    const options = React.useMemo(() => ({
        chart: {
            type: chartType,
            height: 350,
            background: 'transparent',
            toolbar: {
                show: true,
                tools: {
                    download: true,
                    selection: true,
                    zoom: true,
                    zoomin: true,
                    zoomout: true,
                    pan: true,
                    reset: true
                }
            },
            animations: {
                enabled: true,
                easing: 'easeinout',
                speed: 800,
            }
        },
        title: {
            text: `${coin?.replace('coin_', '')} Price History`,
            align: 'left',
            style: {
                color: theme === 'dark' ? '#f8fafc' : '#0f172a'
            }
        },
        xaxis: {
            type: 'datetime',
            labels: {
                style: {
                    colors: theme === 'dark' ? '#94a3b8' : '#475569'
                }
            },
            axisBorder: {
                show: true,
                color: theme === 'dark' ? '#334155' : '#cbd5e1'
            },
            axisTicks: {
                color: theme === 'dark' ? '#334155' : '#cbd5e1'
            }
        },
        yaxis: {
            tooltip: {
                enabled: true
            },
            labels: {
                style: {
                    colors: theme === 'dark' ? '#94a3b8' : '#475569'
                },
                formatter: (value) => `${CURRENCY_SYMBOLS[currency]} ${value.toFixed(2)}`
            }
        },
        grid: {
            borderColor: theme === 'dark' ? '#334155' : '#e2e8f0',
            strokeDashArray: 4
        },
        theme: {
            mode: theme
        },
        plotOptions: {
            candlestick: {
                colors: {
                    upward: '#22c55e',
                    downward: '#ef4444'
                }
            }
        },
        stroke: {
            curve: 'smooth',
            width: chartType === 'line' ? 3 : 1
        },
        tooltip: {
            theme: theme,
            x: {
                format: 'dd MMM yyyy'
            },
            y: {
                formatter: (value) => `${CURRENCY_SYMBOLS[currency]} ${value.toFixed(2)}`
            }
        }
    }), [coin, theme, currency, chartType]);

    // For line chart, we just use the Close price (index 3 of OHLC)
    const chartSeries = React.useMemo(() => {
        if (chartType === 'line') {
            return [{
                name: 'Price',
                data: series.length > 0 ? series[0].data.map(d => ({
                    x: d.x,
                    y: d.y[3] // Close price
                })) : []
            }];
        }
        return series;
    }, [series, chartType]);

    if (!coin) return null;

    return (
        <div className="w-full max-w-4xl glass-card mt-8 animate-fadeIn p-8 relative z-20">
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                <h2 className="text-xl font-bold text-slate-800 dark:text-white drop-shadow-md">
                    Historical Price Action
                </h2>

                <div className="flex gap-4 items-center">
                    {/* Chart Type Toggle */}
                    <div className="flex bg-slate-200 dark:bg-slate-800 rounded-lg p-1 border border-slate-300 dark:border-slate-700">
                        <button
                            onClick={() => setChartType('candlestick')}
                            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${chartType === 'candlestick'
                                ? 'bg-blue-600 text-white shadow-lg'
                                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                                }`}
                        >
                            Candles
                        </button>
                        <button
                            onClick={() => setChartType('line')}
                            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${chartType === 'line'
                                ? 'bg-blue-600 text-white shadow-lg'
                                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                                }`}
                        >
                            Line
                        </button>
                    </div>

                    {/* Currency Selector */}
                    <div className="relative">
                        <button
                            onClick={() => setIsCurrencyOpen(!isCurrencyOpen)}
                            className="flex items-center gap-2 px-4 py-2 bg-slate-200 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-700 transition-all min-w-[100px] justify-between"
                        >
                            <span>{currency}</span>
                            <ChevronDown className={`w-4 h-4 transition-transform ${isCurrencyOpen ? 'rotate-180' : ''}`} />
                        </button>

                        {isCurrencyOpen && (
                            <div className="absolute right-0 top-full mt-2 w-32 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl overflow-hidden z-50 animate-fadeIn">
                                <div className="max-h-60 overflow-y-auto custom-scrollbar">
                                    {Object.keys(EXCHANGE_RATES).map((curr) => (
                                        <button
                                            key={curr}
                                            onClick={() => {
                                                setCurrency(curr);
                                                setIsCurrencyOpen(false);
                                            }}
                                            className={`w-full text-left px-4 py-2 text-sm hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors flex justify-between items-center ${currency === curr ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-bold' : 'text-slate-700 dark:text-slate-300'
                                                }`}
                                        >
                                            <span>{curr}</span>
                                            <span className="text-xs opacity-50">{CURRENCY_SYMBOLS[curr]}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="h-[400px] flex items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                </div>
            ) : error ? (
                <div className="h-[400px] flex items-center justify-center text-red-400">
                    {error}
                </div>
            ) : (
                <div className="h-[400px] w-full">
                    <Chart
                        options={options}
                        series={chartSeries}
                        type={chartType}
                        height="100%"
                        width="100%"
                    />
                </div>
            )}
        </div>
    );
};

export default HistoricalChart;
