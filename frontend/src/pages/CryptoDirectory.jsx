import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, Database, Globe, Cpu, Layers, Zap, Shield, Server, Activity, X, Info, Check } from 'lucide-react';
import ThemeToggle from '../components/ThemeToggle';

const coinsData = [
    {
        id: 'btc',
        name: 'Bitcoin',
        symbol: 'BTC',
        rank: 1,
        overview: "The first decentralized cryptocurrency, often referred to as 'digital gold'. It solves the problem of trusting centralized banks.",
        facts: {
            launch: "2009",
            founder: "Satoshi Nakamoto",
            type: "Blockchain (Layer 1)",
            useCase: "Store of Value, Payments",
            maxSupply: "21 Million",
            currentSupply: "~19.5 Million"
        },
        tech: {
            consensus: "Proof of Work (PoW)",
            language: "C++",
            tps: "7",
            blockTime: "10 Minutes"
        }
    },
    {
        id: 'eth',
        name: 'Ethereum',
        symbol: 'ETH',
        rank: 2,
        overview: "A global supercomputer for building decentralized applications (DApps) and smart contracts.",
        facts: {
            launch: "2015",
            founder: "Vitalik Buterin",
            type: "Blockchain (Layer 1)",
            useCase: "Smart Contracts, DeFi, NFTs",
            maxSupply: "Unlimited",
            currentSupply: "~120 Million"
        },
        tech: {
            consensus: "Proof of Stake (PoS)",
            language: "Solidity, Vyper",
            tps: "~15-30",
            blockTime: "12 Seconds"
        }
    },
    {
        id: 'sol',
        name: 'Solana',
        symbol: 'SOL',
        rank: 5,
        overview: "A high-performance blockchain designed for mass adoption, known for its incredible speed and low fees.",
        facts: {
            launch: "2020",
            founder: "Anatoly Yakovenko",
            type: "Blockchain (Layer 1)",
            useCase: "DeFi, NFTs, Web3 Games",
            maxSupply: "Unlimited",
            currentSupply: "~400 Million"
        },
        tech: {
            consensus: "Proof of History (PoH) + PoS",
            language: "Rust, C, C++",
            tps: "65,000+",
            blockTime: "400 Milliseconds"
        }
    },
    {
        id: 'ada',
        name: 'Cardano',
        symbol: 'ADA',
        rank: 8,
        overview: "A research-driven blockchain built with a scientific philosophy and peer-reviewed academic research.",
        facts: {
            launch: "2017",
            founder: "Charles Hoskinson",
            type: "Blockchain (Layer 1)",
            useCase: "Smart Contracts, Identity",
            maxSupply: "45 Billion",
            currentSupply: "~35 Billion"
        },
        tech: {
            consensus: "Ouroboros (PoS)",
            language: "Haskell, Plutus",
            tps: "250+",
            blockTime: "20 Seconds"
        }
    },
    {
        id: 'dot',
        name: 'Polkadot',
        symbol: 'DOT',
        rank: 13,
        overview: "A 'Layer 0' protocol that connects different blockchains, allowing them to transfer data and assets trustlessly.",
        facts: {
            launch: "2020",
            founder: "Gavin Wood",
            type: "Layer 0 Protocol",
            useCase: "Interoperability, Parachains",
            maxSupply: "Unlimited",
            currentSupply: "~1.3 Billion"
        },
        tech: {
            consensus: "NPoS (Nominated Proof of Stake)",
            language: "Rust, Substrate",
            tps: "1,000+ (per parachain)",
            blockTime: "6 Seconds"
        }
    },
    {
        id: 'matic',
        name: 'Polygon',
        symbol: 'MATIC',
        rank: 14,
        overview: "A scaling solution for Ethereum that provides faster and cheaper transactions while maintaining security.",
        facts: {
            launch: "2017",
            founder: "Jaynti Kanani, Sandeep Nailwal",
            type: "Layer 2 / Sidechain",
            useCase: "Scaling Ethereum, Gaming",
            maxSupply: "10 Billion",
            currentSupply: "~9.3 Billion"
        },
        tech: {
            consensus: "Proof of Stake",
            language: "Solidity",
            tps: "65,000",
            blockTime: "2 Seconds"
        }
    }
];

const CryptoDirectory = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCoin, setSelectedCoin] = useState(null);

    const filteredCoins = coinsData.filter(coin =>
        coin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        coin.symbol.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white transition-colors duration-300">
            {/* Header */}
            <header className="sticky top-0 z-50 w-full bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
                <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="flex items-center gap-4 w-full md:w-auto">
                        <button
                            onClick={() => navigate('/learn/academy')}
                            className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors group"
                            title="Back to Learning Hub"
                        >
                            <ArrowLeft className="w-6 h-6 text-slate-600 dark:text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400" />
                        </button>
                        <h1 className="text-xl font-bold tracking-tight">Crypto Directory</h1>
                    </div>

                    <div className="flex items-center gap-4 w-full md:w-auto">
                        <div className="relative flex-1 md:w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search coins..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <ThemeToggle />
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-6 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredCoins.map((coin) => (
                        <div
                            key={coin.id}
                            onClick={() => setSelectedCoin(coin)}
                            className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 hover:shadow-lg hover:border-blue-500/30 transition-all cursor-pointer group"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold">
                                        {coin.symbol[0]}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg">{coin.name}</h3>
                                        <span className="text-xs font-medium text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                                            {coin.symbol}
                                        </span>
                                    </div>
                                </div>
                                <span className="text-xs font-bold text-slate-400">#{coin.rank}</span>
                            </div>
                            <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 mb-4">
                                {coin.overview}
                            </p>
                            <div className="flex items-center text-blue-600 dark:text-blue-400 text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                                View Details <ArrowLeft className="w-4 h-4 ml-1 rotate-180" />
                            </div>
                        </div>
                    ))}
                </div>

                {filteredCoins.length === 0 && (
                    <div className="text-center py-20 text-slate-500">
                        <p>No coins found matching "{searchTerm}"</p>
                    </div>
                )}
            </main>

            {/* Detail Modal */}
            {selectedCoin && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
                        onClick={() => setSelectedCoin(null)}
                    />
                    <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl overflow-hidden animate-fadeIn max-h-[90vh] overflow-y-auto">
                        <div className="p-6 md:p-8">
                            <button
                                onClick={() => setSelectedCoin(null)}
                                className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                            >
                                <X className="w-6 h-6 text-slate-500" />
                            </button>

                            {/* Header */}
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-16 h-16 rounded-2xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold text-2xl">
                                    {selectedCoin.symbol[0]}
                                </div>
                                <div>
                                    <h2 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                        {selectedCoin.name} <span className="text-lg font-normal text-slate-500">({selectedCoin.symbol})</span>
                                    </h2>
                                    <span className="inline-block mt-1 px-2 py-0.5 rounded text-xs font-bold bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                                        Rank #{selectedCoin.rank}
                                    </span>
                                </div>
                            </div>

                            {/* 1. Overview */}
                            <section className="mb-8">
                                <h3 className="flex items-center gap-2 text-lg font-bold text-slate-900 dark:text-white mb-3">
                                    <Info className="w-5 h-5 text-blue-500" /> Overview
                                </h3>
                                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                                    {selectedCoin.overview}
                                </p>
                            </section>

                            {/* 2. Key Facts */}
                            <section className="mb-8">
                                <h3 className="flex items-center gap-2 text-lg font-bold text-slate-900 dark:text-white mb-3">
                                    <Database className="w-5 h-5 text-purple-500" /> Key Facts
                                </h3>
                                <div className="grid grid-cols-2 gap-3">
                                    <FactCard label="Launch Year" value={selectedCoin.facts.launch} />
                                    <FactCard label="Founder" value={selectedCoin.facts.founder} />
                                    <FactCard label="Network Type" value={selectedCoin.facts.type} />
                                    <FactCard label="Use Case" value={selectedCoin.facts.useCase} />
                                    <FactCard label="Max Supply" value={selectedCoin.facts.maxSupply} />
                                    <FactCard label="Current Supply" value={selectedCoin.facts.currentSupply} />
                                </div>
                            </section>

                            {/* 3. Tech Stack */}
                            <section>
                                <h3 className="flex items-center gap-2 text-lg font-bold text-slate-900 dark:text-white mb-3">
                                    <Cpu className="w-5 h-5 text-indigo-500" /> Technology Stack
                                </h3>
                                <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-xs text-slate-500 uppercase font-bold mb-1">Consensus Mechanism</p>
                                        <p className="font-medium text-slate-900 dark:text-white">{selectedCoin.tech.consensus}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-500 uppercase font-bold mb-1">Programming Language</p>
                                        <p className="font-medium text-slate-900 dark:text-white">{selectedCoin.tech.language}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-500 uppercase font-bold mb-1">Transactions Per Sec (TPS)</p>
                                        <p className="font-medium text-slate-900 dark:text-white">{selectedCoin.tech.tps}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-500 uppercase font-bold mb-1">Block Time</p>
                                        <p className="font-medium text-slate-900 dark:text-white">{selectedCoin.tech.blockTime}</p>
                                    </div>
                                </div>
                            </section>

                            <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                                <button
                                    onClick={() => setSelectedCoin(null)}
                                    className="px-6 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg font-medium hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const FactCard = ({ label, value }) => (
    <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg">
        <p className="text-xs text-slate-500 uppercase font-bold mb-1">{label}</p>
        <p className="text-sm font-medium text-slate-900 dark:text-white">{value}</p>
    </div>
);

export default CryptoDirectory;
