import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, BookOpen, GraduationCap, Award, CheckCircle, Lock, PlayCircle, FileText, ChevronRight, Star, Globe, Database, Coins, Cpu, TrendingUp, Wallet, Zap, Image, Server, Activity, Shield, AlertTriangle, Search, Info, ThumbsUp, ThumbsDown, HelpCircle, X, Layers } from 'lucide-react';
import ThemeToggle from '../components/ThemeToggle';

// --- 1. Structured Course Data ---
const courseData = {
    beginner: {
        title: "Crypto Beginner",
        desc: "Start your journey here. No prior knowledge required.",
        color: "blue",
        modules: [
            {
                id: "b1",
                title: "Module 1: Introduction to Money",
                lessons: [
                    { title: "History of Money", type: "text", content: "From barter to gold to fiat currency..." },
                    { title: "Problems with Fiat", type: "text", content: "Inflation, centralization, and control..." },
                    { title: "What is Digital Currency?", type: "text", content: "Introduction to digital assets..." }
                ]
            },
            {
                id: "b2",
                title: "Module 2: Blockchain Basics",
                lessons: [
                    { title: "What is a Blockchain?", type: "video", content: "Visual explanation of blocks and chains..." },
                    { title: "Decentralization Explained", type: "text", content: "Why no single owner matters..." },
                    { title: "Nodes and Miners", type: "text", content: "Who runs the network?" }
                ]
            },
            {
                id: "b3",
                title: "Module 3: Bitcoin & Ethereum",
                lessons: [
                    { title: "Bitcoin: Digital Gold", type: "text", content: "Satoshi Nakamoto and the 21 million cap..." },
                    { title: "Ethereum: World Computer", type: "text", content: "Smart contracts and dApps..." }
                ]
            }
        ]
    },
    intermediate: {
        title: "Crypto Intermediate",
        desc: "Deep dive into DeFi, NFTs, and Trading.",
        color: "purple",
        modules: [
            {
                id: "i1",
                title: "Module 1: DeFi (Decentralized Finance)",
                lessons: [
                    { title: "What is DeFi?", type: "text", content: "Banking without banks..." },
                    { title: "DEX vs CEX", type: "text", content: "Uniswap vs Binance..." },
                    { title: "Yield Farming & Staking", type: "text", content: "Earning passive income..." }
                ]
            },
            {
                id: "i2",
                title: "Module 2: NFTs & Metaverse",
                lessons: [
                    { title: "Understanding NFTs", type: "text", content: "More than just JPEGs..." },
                    { title: "Use Cases for NFTs", type: "text", content: "Gaming, Identity, Real Estate..." }
                ]
            },
            {
                id: "i3",
                title: "Module 3: Wallet Security",
                lessons: [
                    { title: "Hot vs Cold Wallets", type: "text", content: "Metamask vs Ledger..." },
                    { title: "Seed Phrase Safety", type: "text", content: "How to store your keys..." }
                ]
            }
        ]
    },
    advanced: {
        title: "Crypto Advanced",
        desc: "Master Technical Analysis and Consensus Mechanisms.",
        color: "orange",
        modules: [
            {
                id: "a1",
                title: "Module 1: Technical Analysis",
                lessons: [
                    { title: "Candlestick Patterns", type: "text", content: "Doji, Hammer, Engulfing..." },
                    { title: "Support & Resistance", type: "text", content: "Drawing key levels..." },
                    { title: "Indicators (RSI, MACD)", type: "text", content: "Using tools to predict price..." }
                ]
            },
            {
                id: "a2",
                title: "Module 2: Consensus Mechanisms",
                lessons: [
                    { title: "Proof of Work (PoW)", type: "text", content: "Deep dive into mining math..." },
                    { title: "Proof of Stake (PoS)", type: "text", content: "Validators and slashing..." },
                    { title: "Delegated PoS & PoH", type: "text", content: "Alternative mechanisms..." }
                ]
            }
        ]
    }
};

// --- 2. Library Content (From LearningHub) ---

const BtcEthContent = () => {
    const [activeTab, setActiveTab] = useState('BTC');
    const data = {
        BTC: {
            name: "Bitcoin",
            symbol: "BTC",
            overview: { what: "Bitcoin is the first decentralized cryptocurrency, often referred to as 'digital gold'.", problem: "It solves the problem of trusting centralized banks and governments with your money.", importance: "It introduced blockchain technology and proved that digital money can exist without a central authority.", creator: "Satoshi Nakamoto (Pseudonym)" },
            facts: { launch: "2009", founder: "Satoshi Nakamoto", type: "Blockchain (Layer 1)", useCase: "Store of Value, Peer-to-Peer Payments", maxSupply: "21 Million", currentSupply: "~19.5 Million" },
            howItWorks: { desc: "Bitcoin uses a 'Proof of Work' system where miners use powerful computers to secure the network and validate transactions.", different: "It is the most secure and decentralized network in the world.", used: "Used for international money transfers, savings, and as a hedge against inflation." },
            pros: ["Most secure network", "Limited supply (Deflationary)", "Global adoption", "No central authority"],
            cons: ["Slow transaction speed", "High energy consumption", "Price volatility"],
            risk: { level: "Medium", reason: "While it's the safest crypto, the price can still swing 50%+ in a year.", avoid: "Panic selling during dips." },
            security: ["Use a hardware wallet (Ledger/Trezor) for large amounts.", "Never share your seed phrase.", "Double-check addresses before sending."],
            faqs: [{ q: "Can I mine Bitcoin?", a: "Yes, but you need expensive specialized hardware (ASICs). It's not profitable on a laptop." }, { q: "Is Bitcoin safe?", a: "The network has never been hacked. However, your personal wallet can be hacked if you are not careful." }, { q: "Is it legal?", a: "Yes, in most countries (USA, UK, EU, etc.). Some countries restrict it." }]
        },
        ETH: {
            name: "Ethereum",
            symbol: "ETH",
            overview: { what: "Ethereum is a decentralized global software platform powered by the Ether token.", problem: "It allows developers to build unstoppable applications (DApps) without censorship.", importance: "It introduced 'Smart Contracts', enabling DeFi, NFTs, and DAOs.", creator: "Vitalik Buterin" },
            facts: { launch: "2015", founder: "Vitalik Buterin", type: "Blockchain (Layer 1)", useCase: "Smart Contracts, DeFi, NFTs", maxSupply: "Unlimited (but burns fees)", currentSupply: "~120 Million" },
            howItWorks: { desc: "Ethereum uses 'Proof of Stake' where validators lock up ETH to secure the network. It acts like a global supercomputer.", different: "It is programmable money. You can write code that runs on the blockchain.", used: "Used for lending (Aave), trading (Uniswap), and digital art (OpenSea)." },
            pros: ["Huge ecosystem (DeFi/NFTs)", "Programmable smart contracts", "Deflationary mechanism (EIP-1559)", "Energy efficient (PoS)"],
            cons: ["High gas fees during congestion", "Complex for beginners", "Unlimited total supply"],
            risk: { level: "Medium-High", reason: "More complex than Bitcoin, meaning more potential for bugs in smart contracts.", avoid: "Interacting with unknown smart contracts." },
            security: ["Use a hardware wallet.", "Revoke token approvals regularly.", "Be careful of phishing sites pretending to be DApps."],
            faqs: [{ q: "Can I mine Ethereum?", a: "No, Ethereum switched to Proof of Stake. You can 'stake' your ETH to earn rewards." }, { q: "What is Gas?", a: "Gas is the fee you pay to run a transaction or smart contract on Ethereum." }, { q: "Is ETH better than BTC?", a: "They are different. BTC is digital gold; ETH is digital oil for the internet." }]
        }
    };
    const coin = data[activeTab];
    return (
        <div className="space-y-8">
            <div className="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
                {['BTC', 'ETH'].map((tab) => (
                    <button key={tab} onClick={() => setActiveTab(tab)} className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${activeTab === tab ? 'bg-white dark:bg-slate-700 shadow-sm text-blue-600 dark:text-blue-400' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}>{tab === 'BTC' ? 'Bitcoin (BTC)' : 'Ethereum (ETH)'}</button>
                ))}
            </div>
            <section><h3 className="flex items-center gap-2 text-lg font-bold text-slate-900 dark:text-white mb-3"><Info className="w-5 h-5 text-blue-500" /> Overview</h3><div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl space-y-3 text-sm"><p><strong className="text-slate-700 dark:text-slate-300">What is it?</strong> {coin.overview.what}</p><p><strong className="text-slate-700 dark:text-slate-300">Problem Solved:</strong> {coin.overview.problem}</p><p><strong className="text-slate-700 dark:text-slate-300">Why Important:</strong> {coin.overview.importance}</p><p><strong className="text-slate-700 dark:text-slate-300">Creator:</strong> {coin.overview.creator}</p></div></section>
            <section><h3 className="flex items-center gap-2 text-lg font-bold text-slate-900 dark:text-white mb-3"><Database className="w-5 h-5 text-purple-500" /> Key Facts</h3><div className="grid grid-cols-2 gap-3 text-sm"><FactCard label="Launch Year" value={coin.facts.launch} /><FactCard label="Founder" value={coin.facts.founder} /><FactCard label="Type" value={coin.facts.type} /><FactCard label="Use Case" value={coin.facts.useCase} /><FactCard label="Max Supply" value={coin.facts.maxSupply} /><FactCard label="Current Supply" value={coin.facts.currentSupply} /></div></section>
            <section><h3 className="flex items-center gap-2 text-lg font-bold text-slate-900 dark:text-white mb-3"><Cpu className="w-5 h-5 text-indigo-500" /> How It Works</h3><div className="space-y-2 text-sm text-slate-600 dark:text-slate-400"><p>{coin.howItWorks.desc}</p><p><strong>Different:</strong> {coin.howItWorks.different}</p><p><strong>Usage:</strong> {coin.howItWorks.used}</p></div></section>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4"><section><h3 className="flex items-center gap-2 text-lg font-bold text-green-600 dark:text-green-400 mb-3"><ThumbsUp className="w-5 h-5" /> Advantages</h3><ul className="space-y-2">{coin.pros.map((pro, i) => (<li key={i} className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-400"><CheckCircle className="w-4 h-4 text-green-500 mt-0.5 shrink-0" /> {pro}</li>))}</ul></section><section><h3 className="flex items-center gap-2 text-lg font-bold text-red-600 dark:text-red-400 mb-3"><ThumbsDown className="w-5 h-5" /> Disadvantages</h3><ul className="space-y-2">{coin.cons.map((con, i) => (<li key={i} className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-400"><X className="w-4 h-4 text-red-500 mt-0.5 shrink-0" /> {con}</li>))}</ul></section></div>
            <section><h3 className="flex items-center gap-2 text-lg font-bold text-slate-900 dark:text-white mb-3"><AlertTriangle className="w-5 h-5 text-orange-500" /> Risk Level</h3><div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-100 dark:border-orange-800/30 p-4 rounded-xl"><div className="flex items-center gap-2 mb-2"><span className="px-3 py-1 bg-orange-100 dark:bg-orange-800 text-orange-700 dark:text-orange-200 rounded-full text-xs font-bold uppercase">{coin.risk.level}</span></div><p className="text-sm text-slate-700 dark:text-slate-300 mb-2">{coin.risk.reason}</p><p className="text-xs font-bold text-orange-600 dark:text-orange-400">Avoid: {coin.risk.avoid}</p></div></section>
            <section><h3 className="flex items-center gap-2 text-lg font-bold text-slate-900 dark:text-white mb-3"><Shield className="w-5 h-5 text-blue-500" /> Security Tips</h3><ul className="space-y-2">{coin.security.map((tip, i) => (<li key={i} className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-400"><Lock className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" /> {tip}</li>))}</ul></section>
            <section><h3 className="flex items-center gap-2 text-lg font-bold text-slate-900 dark:text-white mb-3"><HelpCircle className="w-5 h-5 text-purple-500" /> Beginner FAQs</h3><div className="space-y-3">{coin.faqs.map((faq, i) => (<div key={i} className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg"><p className="font-bold text-sm text-slate-800 dark:text-slate-200 mb-1">{faq.q}</p><p className="text-sm text-slate-600 dark:text-slate-400">{faq.a}</p></div>))}</div></section>
        </div>
    );
};

const FactCard = ({ label, value }) => (<div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg"><p className="text-xs text-slate-500 uppercase font-bold mb-1">{label}</p><p className="text-sm font-medium text-slate-900 dark:text-white">{value}</p></div>);

const topicDetails = {
    'blockchain': { title: "What is Blockchain?", icon: Database, content: (<div className="space-y-4"><p>A <strong>blockchain</strong> is a shared, immutable ledger that facilitates the process of recording transactions and tracking assets in a business network.</p><h4 className="font-bold text-lg mt-4">Key Concepts:</h4><ul className="list-disc pl-5 space-y-2"><li><strong>Distributed Ledger:</strong> No single person controls the data. It's shared across thousands of computers (nodes).</li><li><strong>Immutable:</strong> Once a record is added, it cannot be changed or deleted. This builds trust.</li><li><strong>Blocks & Chains:</strong> Data is stored in "blocks" that are linked together in a chronological "chain".</li></ul><p>Think of it as a Google Doc that everyone can read, but no one can delete or edit past entries—only add new ones.</p></div>) },
    'btc_eth': { title: "Bitcoin & Ethereum Guide", icon: Coins, content: <BtcEthContent /> },
    'mechanics': { title: "How Crypto Works?", icon: Cpu, content: (<div className="space-y-4"><p>Cryptocurrencies work using a technology called <strong>cryptography</strong> to secure transactions and control the creation of new units.</p><h4 className="font-bold text-lg mt-4">How transactions are verified:</h4><ul className="list-disc pl-5 space-y-2"><li><strong>Mining (Proof of Work):</strong> Computers solve complex math puzzles to secure the network (e.g., Bitcoin).</li><li><strong>Staking (Proof of Stake):</strong> Validators lock up funds to show they are honest and secure the network (e.g., Ethereum).</li></ul><p>When you send crypto, you are broadcasting a message to the network signed with your <strong>Private Key</strong>. The network checks your <strong>Public Key</strong> to verify it's really you.</p></div>) },
    'trading': { title: "What is Trading?", icon: TrendingUp, content: (<div className="space-y-4"><p><strong>Trading</strong> involves buying and selling assets to make a profit. Unlike investing (holding for years), trading often involves shorter timeframes.</p><h4 className="font-bold text-lg mt-4">Common Terms:</h4><ul className="list-disc pl-5 space-y-2"><li><strong>Long:</strong> Buying with the expectation that the price will go up.</li><li><strong>Short:</strong> Selling with the expectation that the price will go down.</li><li><strong>Market Order:</strong> Buying immediately at the current price.</li><li><strong>Limit Order:</strong> Setting a specific price you want to buy/sell at.</li></ul><p>Successful traders use <strong>Technical Analysis (Charts)</strong> and <strong>Fundamental Analysis (News/Data)</strong> to make decisions.</p></div>) },
    'wallet': { title: "What is Wallet?", icon: Wallet, content: (<div className="space-y-4"><p>A <strong>Crypto Wallet</strong> doesn't actually store your coins. Your coins live on the blockchain. The wallet stores the <strong>Keys</strong> that prove you own them.</p><h4 className="font-bold text-lg mt-4">Types of Wallets:</h4><ul className="list-disc pl-5 space-y-2"><li><strong>Hot Wallet:</strong> Connected to the internet (e.g., MetaMask, Exchange Apps). Convenient but less secure.</li><li><strong>Cold Wallet:</strong> Offline hardware device (e.g., Ledger, Trezor). Extremely secure, best for large amounts.</li></ul><div className="p-3 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 rounded-lg text-sm"><strong>Warning:</strong> Never share your "Seed Phrase" (12-24 words). Anyone with this phrase can steal all your funds.</div></div>) },
    'gas': { title: "What is Gas Fee?", icon: Zap, content: (<div className="space-y-4"><p><strong>Gas Fees</strong> are transaction fees paid to network validators for processing your transfers and smart contracts.</p><p>Think of it like a toll fee for using the blockchain highway. If the highway is busy (network congestion), the toll price goes up.</p><h4 className="font-bold text-lg mt-4">Why do we pay it?</h4><ul className="list-disc pl-5 space-y-2"><li>To compensate the computers (miners/validators) that process transactions.</li><li>To prevent spam attacks on the network.</li></ul><p>On Ethereum, gas is measured in <strong>Gwei</strong>.</p></div>) },
    'nft': { title: "What is NFT?", icon: Image, content: (<div className="space-y-4"><p><strong>NFT (Non-Fungible Token)</strong> represents ownership of a unique digital item. "Non-fungible" means it's unique and can't be replaced with something else.</p><h4 className="font-bold text-lg mt-4">Comparison:</h4><ul className="list-disc pl-5 space-y-2"><li><strong>Fungible:</strong> A $10 bill. If you swap it for another $10 bill, it's the same value.</li><li><strong>Non-Fungible:</strong> The Mona Lisa. You can't just swap it for a poster; it's unique.</li></ul><p>NFTs are used for Digital Art, Music, In-Game Items, and even Real Estate ownership.</p></div>) },
    'mining': { title: "How Mining Works", icon: Server, content: (<div className="space-y-4"><p><strong>Mining</strong> is the process of validating transactions on a Proof of Work blockchain (like Bitcoin) and creating new coins.</p><h4 className="font-bold text-lg mt-4">The Process:</h4><ul className="list-disc pl-5 space-y-2"><li>Miners use powerful computers to solve complex mathematical puzzles.</li><li>The first miner to solve the puzzle gets to add the next "block" of transactions to the blockchain.</li><li>As a reward, they receive newly minted cryptocurrency (Block Reward) and transaction fees.</li></ul><p>This process secures the network because rewriting the blockchain would require an impossible amount of computing power.</p></div>) },
    'strategies': { title: "Best Crypto Strategies", icon: Activity, content: (<div className="space-y-4"><p>Successful investing requires a plan. Here are some common strategies:</p><ul className="list-disc pl-5 space-y-2"><li><strong>DCA (Dollar Cost Averaging):</strong> Investing a fixed amount regularly (e.g., $50 every week) regardless of price. This smooths out volatility.</li><li><strong>HODL:</strong> Buying and holding for the long term, ignoring short-term price swings.</li><li><strong>Value Investing:</strong> Buying undervalued projects with strong fundamentals (team, tech, adoption).</li><li><strong>Swing Trading:</strong> Capturing gains from price swings over days or weeks.</li></ul><p><strong>Rule #1:</strong> Never invest more than you can afford to lose.</p></div>) },
    'tax': { title: "Crypto Tax Rules", icon: FileText, content: (<div className="space-y-4"><p>In most countries, cryptocurrency is treated as <strong>property</strong> for tax purposes.</p><h4 className="font-bold text-lg mt-4">Taxable Events:</h4><ul className="list-disc pl-5 space-y-2"><li>Selling crypto for fiat currency (USD, EUR, etc.).</li><li>Trading one crypto for another (e.g., BTC for ETH).</li><li>Using crypto to buy goods or services.</li><li>Earning crypto (mining, staking rewards, airdrops) - taxed as income.</li></ul><p><strong>Not Taxable:</strong> Buying crypto with fiat and holding it (until you sell).</p><div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 rounded-lg text-sm"><strong>Note:</strong> Tax laws vary by country. Always consult a tax professional.</div></div>) },
    'scam_protection': { title: "Scam Protection", icon: Shield, content: (<div className="space-y-4"><p>The crypto world is full of opportunities, but also scammers. Stay safe by recognizing common threats.</p><h4 className="font-bold text-lg mt-4">Common Scams:</h4><ul className="list-disc pl-5 space-y-2"><li><strong>Giveaway Scams:</strong> "Send 1 ETH, get 2 ETH back." This is ALWAYS a scam.</li><li><strong>Impersonators:</strong> Scammers pretending to be support staff or famous people.</li><li><strong>Rug Pulls:</strong> Developers abandoning a project and running away with investors' money.</li></ul><p><strong>Golden Rule:</strong> If it sounds too good to be true, it is.</p></div>) },
    'fraud_avoidance': { title: "How to Avoid Fraud", icon: Lock, content: (<div className="space-y-4"><p>Protecting your assets starts with vigilance.</p><ul className="list-disc pl-5 space-y-2"><li><strong>Verify URLs:</strong> Always check the website address. Scammers create fake sites that look identical to real ones (e.g., binance-secure.com instead of binance.com).</li><li><strong>Use 2FA:</strong> Enable Two-Factor Authentication (Authenticator App, not SMS) on all accounts.</li><li><strong>Ignore DMs:</strong> Support staff will NEVER DM you first asking for keys or funds.</li></ul></div>) },
    'phishing': { title: "Phishing Warnings", icon: AlertTriangle, content: (<div className="space-y-4"><p><strong>Phishing</strong> is an attempt to trick you into revealing sensitive information like passwords or seed phrases.</p><h4 className="font-bold text-lg mt-4">How to spot it:</h4><ul className="list-disc pl-5 space-y-2"><li><strong>Urgency:</strong> "Your account will be banned in 24 hours if you don't verify now!"</li><li><strong>Suspicious Links:</strong> Links in emails or messages that lead to unknown sites.</li><li><strong>Fake Airdrops:</strong> Tokens appearing in your wallet that ask you to visit a website to claim value.</li></ul><p><strong>Never</strong> enter your seed phrase on a website unless you are 100% sure it is a legitimate wallet recovery.</p></div>) }
};

const glossaryTerms = [
    { term: "Blockchain", def: "A decentralized public ledger that records transactions across many computers." },
    { term: "Altcoin", def: "Any cryptocurrency other than Bitcoin (Alternative Coin)." },
    { term: "Hashrate", def: "The total computational power used to mine and process transactions on a blockchain." },
    { term: "Stablecoin", def: "A cryptocurrency pegged to a stable asset like the US Dollar to minimize volatility (e.g., USDT, USDC)." },
    { term: "DEX", def: "Decentralized Exchange. A peer-to-peer marketplace where users trade directly without an intermediary." },
    { term: "Smart Contract", def: "Self-executing contracts with the terms of the agreement directly written into code." },
    { term: "DeFi", def: "Decentralized Finance. Financial services (lending, borrowing, trading) built on blockchain without banks." },
    { term: "Layer 2", def: "A secondary framework built on top of a blockchain (Layer 1) to improve scalability and speed (e.g., Polygon, Arbitrum)." },
];

const Academy = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('course'); // 'course', 'library', 'glossary', 'security'
    const [activeLevel, setActiveLevel] = useState(null);
    const [activeModule, setActiveModule] = useState(null);
    const [activeLesson, setActiveLesson] = useState(null);
    const [selectedTopic, setSelectedTopic] = useState(null);

    const handleBack = () => {
        if (selectedTopic) setSelectedTopic(null);
        else if (activeLesson) setActiveLesson(null);
        else if (activeModule) setActiveModule(null);
        else if (activeLevel) setActiveLevel(null);
        else navigate('/');
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white transition-colors duration-300">
            {/* Header */}
            <header className="sticky top-0 z-50 w-full bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
                <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <button onClick={handleBack} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors group" title="Back">
                            <ArrowLeft className="w-6 h-6 text-slate-600 dark:text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400" />
                        </button>
                        <div className="flex items-center gap-2">
                            <GraduationCap className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                            <span className="text-xl font-bold tracking-tight">Crypto Academy</span>
                        </div>
                    </div>
                    <ThemeToggle />
                </div>
                {/* Navigation Tabs */}
                <div className="max-w-7xl mx-auto px-6 flex gap-6 overflow-x-auto">
                    {['course', 'library', 'glossary', 'security'].map(tab => (
                        <button
                            key={tab}
                            onClick={() => { setActiveTab(tab); setActiveLevel(null); setActiveModule(null); setActiveLesson(null); setSelectedTopic(null); }}
                            className={`py-3 text-sm font-bold border-b-2 transition-colors whitespace-nowrap ${activeTab === tab ? 'border-blue-600 text-blue-600 dark:text-blue-400' : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                        >
                            {tab.charAt(0).toUpperCase() + tab.slice(1)}
                        </button>
                    ))}
                    <button onClick={() => navigate('/directory')} className="py-3 text-sm font-bold border-b-2 border-transparent text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-1">
                        Directory <ArrowLeft className="w-3 h-3 rotate-180" />
                    </button>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-6 py-12">
                {/* 1. COURSE TAB */}
                {activeTab === 'course' && (
                    <>
                        {!activeLevel ? (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                <LevelCard level="beginner" data={courseData.beginner} onClick={() => setActiveLevel('beginner')} />
                                <LevelCard level="intermediate" data={courseData.intermediate} onClick={() => setActiveLevel('intermediate')} />
                                <LevelCard level="advanced" data={courseData.advanced} onClick={() => setActiveLevel('advanced')} />
                            </div>
                        ) : !activeModule ? (
                            <div className="max-w-4xl mx-auto">
                                <button onClick={() => setActiveLevel(null)} className="mb-6 flex items-center gap-2 text-sm text-slate-500 hover:text-blue-600"><ArrowLeft className="w-4 h-4" /> Back to Levels</button>
                                <h2 className="text-3xl font-bold mb-2">{courseData[activeLevel].title}</h2>
                                <p className="text-slate-600 dark:text-slate-400 mb-8">{courseData[activeLevel].desc}</p>
                                <div className="space-y-4">
                                    {courseData[activeLevel].modules.map(module => (
                                        <div key={module.id} onClick={() => setActiveModule(module)} className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-blue-500/30 cursor-pointer flex justify-between items-center group">
                                            <div><h3 className="text-xl font-bold group-hover:text-blue-600 dark:group-hover:text-blue-400">{module.title}</h3><p className="text-sm text-slate-500">{module.lessons.length} Lessons</p></div>
                                            <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-blue-600" />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col lg:flex-row gap-8">
                                <div className="w-full lg:w-1/3">
                                    <button onClick={() => setActiveModule(null)} className="mb-4 flex items-center gap-2 text-sm text-slate-500 hover:text-blue-600"><ArrowLeft className="w-4 h-4" /> Back to Modules</button>
                                    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4">
                                        <h3 className="font-bold mb-4">{activeModule.title}</h3>
                                        <div className="space-y-2">
                                            {activeModule.lessons.map((lesson, i) => (
                                                <button key={i} onClick={() => setActiveLesson(lesson)} className={`w-full text-left p-3 rounded-lg text-sm font-medium flex items-center gap-3 ${activeLesson === lesson ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600' : 'hover:bg-slate-50 dark:hover:bg-slate-800'}`}>
                                                    {lesson.type === 'video' ? <PlayCircle className="w-4 h-4" /> : <FileText className="w-4 h-4" />} {lesson.title}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <div className="w-full lg:w-2/3">
                                    {activeLesson ? (
                                        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-8">
                                            <h2 className="text-2xl font-bold mb-6">{activeLesson.title}</h2>
                                            <div className="prose dark:prose-invert max-w-none"><p className="text-lg text-slate-600 dark:text-slate-300">{activeLesson.content}</p></div>
                                            <div className="mt-8 p-6 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800"><h4 className="font-bold mb-2">Study Note:</h4><p className="text-sm text-slate-500">Placeholder for your PDF content.</p></div>
                                        </div>
                                    ) : (
                                        <div className="h-full flex items-center justify-center text-slate-500">Select a lesson to start.</div>
                                    )}
                                </div>
                            </div>
                        )}
                    </>
                )}

                {/* 2. LIBRARY TAB */}
                {activeTab === 'library' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <LearningCard icon={Database} title="What is Blockchain?" level="Beginner" desc="A shared, immutable ledger." topics={['Distributed Ledger', 'Decentralization']} onClick={() => setSelectedTopic('blockchain')} />
                        <LearningCard icon={Coins} title="Bitcoin & Ethereum" level="Beginner" desc="The two giants of crypto." topics={['Digital Gold', 'Smart Contracts']} onClick={() => setSelectedTopic('btc_eth')} />
                        <LearningCard icon={Cpu} title="How Crypto Works?" level="Beginner" desc="Cryptography and consensus." topics={['Mining', 'Staking']} onClick={() => setSelectedTopic('mechanics')} />
                        <LearningCard icon={TrendingUp} title="What is Trading?" level="Intermediate" desc="Buying and selling assets." topics={['Orders', 'Analysis']} onClick={() => setSelectedTopic('trading')} />
                        <LearningCard icon={Wallet} title="What is Wallet?" level="Essential" desc="Storing your keys securely." topics={['Hot vs Cold', 'Seed Phrases']} onClick={() => setSelectedTopic('wallet')} />
                        <LearningCard icon={Zap} title="What is Gas Fee?" level="Intermediate" desc="Transaction fees explained." topics={['Gwei', 'Congestion']} onClick={() => setSelectedTopic('gas')} />
                        <LearningCard icon={Image} title="What is NFT?" level="Beginner" desc="Non-Fungible Tokens." topics={['Ownership', 'Collectibles']} onClick={() => setSelectedTopic('nft')} />
                        <LearningCard icon={Server} title="How Mining Works" level="Advanced" desc="Securing the network." topics={['PoW', 'Hashrate']} onClick={() => setSelectedTopic('mining')} />
                        <LearningCard icon={Activity} title="Best Strategies" level="Advanced" desc="Investment plans." topics={['DCA', 'HODL']} onClick={() => setSelectedTopic('strategies')} />
                        <LearningCard icon={FileText} title="Tax Rules" level="Essential" desc="Understanding obligations." topics={['Capital Gains', 'Income']} onClick={() => setSelectedTopic('tax')} />
                    </div>
                )}

                {/* 3. GLOSSARY TAB */}
                {activeTab === 'glossary' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {glossaryTerms.map((item, index) => (
                            <div key={index} className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800">
                                <h3 className="text-lg font-bold text-blue-600 dark:text-blue-400 mb-2">{item.term}</h3>
                                <p className="text-sm text-slate-600 dark:text-slate-400">{item.def}</p>
                            </div>
                        ))}
                    </div>
                )}

                {/* 4. SECURITY TAB */}
                {activeTab === 'security' && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <LearningCard icon={AlertTriangle} title="Scam Protection" level="Critical" desc="Identify common scams." topics={['Red Flags', 'Reporting']} onClick={() => setSelectedTopic('scam_protection')} />
                        <LearningCard icon={Lock} title="Avoid Fraud" level="Critical" desc="Keep funds safe." topics={['2FA', 'Verification']} onClick={() => setSelectedTopic('fraud_avoidance')} />
                        <LearningCard icon={Search} title="Phishing Warnings" level="Critical" desc="Spotting fake sites." topics={['Links', 'Email Safety']} onClick={() => setSelectedTopic('phishing')} />
                    </div>
                )}

                {/* Topic Modal */}
                {selectedTopic && topicDetails[selectedTopic] && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedTopic(null)} />
                        <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl overflow-hidden animate-fadeIn max-h-[90vh] overflow-y-auto">
                            <div className="p-8">
                                <button onClick={() => setSelectedTopic(null)} className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"><X className="w-6 h-6 text-slate-500" /></button>
                                <div className="flex items-center gap-4 mb-6"><div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl text-blue-600 dark:text-blue-400">{React.createElement(topicDetails[selectedTopic].icon, { className: "w-8 h-8" })}</div><h2 className="text-2xl font-bold">{topicDetails[selectedTopic].title}</h2></div>
                                <div className="prose dark:prose-invert max-w-none text-slate-600 dark:text-slate-300">{topicDetails[selectedTopic].content}</div>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

const LevelCard = ({ level, data, onClick }) => (
    <div onClick={onClick} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 hover:shadow-xl hover:border-blue-500/30 transition-all cursor-pointer group relative overflow-hidden">
        <div className={`absolute top-0 right-0 w-32 h-32 bg-${data.color}-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2`}></div>
        <div className="relative z-10">
            <div className={`w-12 h-12 rounded-xl bg-${data.color}-100 dark:bg-${data.color}-900/30 flex items-center justify-center text-${data.color}-600 dark:text-${data.color}-400 mb-6 group-hover:scale-110 transition-transform`}>
                {level === 'beginner' && <Star className="w-6 h-6" />}
                {level === 'intermediate' && <Layers className="w-6 h-6" />}
                {level === 'advanced' && <Award className="w-6 h-6" />}
            </div>
            <h3 className="text-2xl font-bold mb-3 text-slate-900 dark:text-white">{data.title}</h3>
            <p className="text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">{data.desc}</p>
            <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 flex items-center font-bold text-blue-600 dark:text-blue-400 group-hover:gap-2 transition-all">Start Course <ArrowLeft className="w-4 h-4 ml-2 rotate-180" /></div>
        </div>
    </div>
);

const LearningCard = ({ icon: Icon, title, level, desc, topics, onClick }) => (
    <div onClick={onClick} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 hover:shadow-xl hover:border-blue-500/30 transition-all group cursor-pointer active:scale-95 h-full flex flex-col">
        <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform"><Icon className="w-6 h-6" /></div>
            <span className={`px-3 py-1 rounded-full text-xs font-bold ${level === 'Beginner' ? 'bg-green-100 text-green-700' : level === 'Intermediate' ? 'bg-yellow-100 text-yellow-700' : level === 'Advanced' ? 'bg-purple-100 text-purple-700' : level === 'Critical' ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-700'}`}>{level}</span>
        </div>
        <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{title}</h3>
        <p className="text-slate-600 dark:text-slate-400 text-sm mb-6 leading-relaxed flex-1">{desc}</p>
        <div className="space-y-2">{topics.map((topic, i) => (<div key={i} className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-500"><div className="w-1.5 h-1.5 rounded-full bg-blue-500/50"></div>{topic}</div>))}</div>
    </div>
);

export default Academy;
