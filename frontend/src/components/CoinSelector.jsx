import React, { useState, useEffect, useRef } from 'react';

const COIN_MAP = {
  'coin_Bitcoin': { symbol: 'BTC', name: 'Bitcoin' },
  'coin_Ethereum': { symbol: 'ETH', name: 'Ethereum' },
  'coin_BinanceCoin': { symbol: 'BNB', name: 'Binance Coin' },
  'coin_Cardano': { symbol: 'ADA', name: 'Cardano' },
  'coin_Dogecoin': { symbol: 'DOGE', name: 'Dogecoin' },
  'coin_Ripple': { symbol: 'XRP', name: 'XRP' },
  'coin_Solana': { symbol: 'SOL', name: 'Solana' },
  'coin_Polkadot': { symbol: 'DOT', name: 'Polkadot' },
  'coin_Litecoin': { symbol: 'LTC', name: 'Litecoin' },
  'coin_Tron': { symbol: 'TRX', name: 'Tron' },
  'coin_Avalanche': { symbol: 'AVAX', name: 'Avalanche' },
  'coin_Chainlink': { symbol: 'LINK', name: 'Chainlink' },
  'coin_Stellar': { symbol: 'XLM', name: 'Stellar' },
  'coin_Uniswap': { symbol: 'UNI', name: 'Uniswap' },
  'coin_Aave': { symbol: 'AAVE', name: 'Aave' },
  'coin_Cosmos': { symbol: 'ATOM', name: 'Cosmos' },
  'coin_Monero': { symbol: 'XMR', name: 'Monero' },
  'coin_EOS': { symbol: 'EOS', name: 'EOS' },
  'coin_Iota': { symbol: 'MIOTA', name: 'IOTA' },
  'coin_Neo': { symbol: 'NEO', name: 'NEO' },
  'coin_XEM': { symbol: 'XEM', name: 'NEM' },
  'coin_Tezos': { symbol: 'XTZ', name: 'Tezos' },
  'coin_USDCoin': { symbol: 'USDC', name: 'USD Coin' },
  'coin_Tether': { symbol: 'USDT', name: 'Tether' },
  'coin_CryptocomCoin': { symbol: 'CRO', name: 'Cronos' },
  'coin_WrappedBitcoin': { symbol: 'WBTC', name: 'Wrapped Bitcoin' },
  'coin_BitcoinCash': { symbol: 'BCH', name: 'Bitcoin Cash' },
  'coin_Theta': { symbol: 'THETA', name: 'Theta' },
  'coin_Terra': { symbol: 'LUNA', name: 'Terra' },
};

const CoinSelector = ({ onSelect }) => {
  const [coins, setCoins] = useState([]);
  const [selectedCoin, setSelectedCoin] = useState(null);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef(null);

  useEffect(() => {
    fetch('http://127.0.0.1:8000/coins')
      .then(res => res.json())
      .then(data => {
        setCoins(data.coins);
        if (data.coins.length > 0) {
          setSelectedCoin(data.coins[0]);
          if (onSelect) onSelect(data.coins[0]);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch coins:", err);
        setLoading(false);
      });
  }, []);

  const getCoinInfo = (coinKey) => {
    return COIN_MAP[coinKey] || {
      symbol: coinKey.replace('coin_', '').substring(0, 4).toUpperCase(),
      name: coinKey.replace('coin_', '')
    };
  };

  const handleSelect = (coin) => {
    setSelectedCoin(coin);
    if (onSelect) onSelect(coin);
  };

  const getIconUrl = (symbol) => {
    return `https://assets.coincap.io/assets/icons/${symbol.toLowerCase()}@2x.png`;
  };

  const scroll = (direction) => {
    if (scrollRef.current) {
      const { current } = scrollRef;
      const scrollAmount = 200;
      if (direction === 'left') {
        current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
      } else {
        current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      }
    }
  };

  if (loading) return <div className="animate-pulse h-12 w-full bg-slate-800 dark:bg-slate-700 rounded-xl"></div>;

  return (
    <div className="w-full relative group">
      {/* Scroll Buttons */}
      <button
        onClick={() => scroll('left')}
        className="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-black/50 p-2 rounded-full text-white hover:bg-black/80 transition-all opacity-0 group-hover:opacity-100 disabled:opacity-0 backdrop-blur-sm"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
      </button>

      <button
        onClick={() => scroll('right')}
        className="absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-black/50 p-2 rounded-full text-white hover:bg-black/80 transition-all opacity-0 group-hover:opacity-100 disabled:opacity-0 backdrop-blur-sm"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
      </button>

      {/* Horizontal Scrollable List */}
      <div
        ref={scrollRef}
        className="flex flex-row flex-nowrap overflow-x-auto pb-6 pt-4 gap-6 custom-scrollbar snap-x scroll-smooth px-4 items-start w-full"
      >
        {coins.map(coin => {
          const info = getCoinInfo(coin);
          const isSelected = selectedCoin === coin;

          return (
            <div
              key={coin}
              onClick={() => handleSelect(coin)}
              className={`flex-shrink-0 snap-center flex flex-col items-center gap-3 cursor-pointer group/item w-20 transition-all duration-300 ${isSelected ? '-translate-y-2 scale-110 opacity-100' : 'translate-y-0 scale-100 opacity-70 hover:opacity-100'
                }`}
            >
              <div
                className={`relative rounded-full transition-all duration-300 ${isSelected ? 'shadow-[0_0_20px_rgba(59,130,246,0.6)] ring-4 ring-blue-500/30' : ''
                  }`}
              >
                <img
                  src={getIconUrl(info.symbol)}
                  alt={info.name}
                  className="w-12 h-12 rounded-full relative z-10 bg-slate-900 dark:bg-slate-900 bg-white object-cover"
                  onError={(e) => e.target.src = `https://ui-avatars.com/api/?name=${info.symbol}&background=0f172a&color=fff`}
                />
              </div>

              <div className="flex flex-col items-center text-center leading-tight">
                <span
                  className={`text-xs font-bold mb-0.5 transition-colors duration-300 ${isSelected ? 'text-blue-600 dark:text-blue-400' : 'text-slate-600 dark:text-slate-300 group-hover/item:text-slate-900 dark:group-hover/item:text-white'
                    }`}
                >
                  {info.name}
                </span>
                <span
                  className={`text-[10px] font-medium transition-colors duration-300 ${isSelected ? 'text-blue-400 dark:text-blue-200' : 'text-slate-400 dark:text-slate-500'
                    }`}
                >
                  ({info.symbol})
                </span>
              </div>
            </div>
          );
        })}

        {coins.length === 0 && (
          <div className="w-full text-center py-4 text-slate-500 dark:text-slate-400 text-sm">
            No assets found
          </div>
        )}
      </div>
    </div>
  );
};

export default CoinSelector;
