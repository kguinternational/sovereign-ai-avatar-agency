"use client";

import { useState, useEffect } from "react";
import { Timer, AlertTriangle, ShieldCheck, Wallet, ArrowRight } from "lucide-react";

export default function FireSaleStorefront() {
  const [timeLeft, setTimeLeft] = useState(48 * 60 * 60); // 48 hours in seconds

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Mock list, user can replace with their actual 100 domains
  const domains = [
    { name: "miami-real-estate.crypto", price: "$25" },
    { name: "sarah-smith.nft", price: "$15" },
    { name: "web3-plumbing.x", price: "$10" },
    { name: "fast-loans.wallet", price: "$50" },
    { name: "nyc-pizza.crypto", price: "$20" },
    { name: "global-logistics.x", price: "$30" },
  ];

  return (
    <div className="min-h-screen bg-gray-950 text-white font-sans selection:bg-red-500 selection:text-white">
      {/* URGENCY BANNER */}
      <div className="bg-red-600 text-white py-3 px-4 text-center font-bold tracking-widest uppercase flex items-center justify-center animate-pulse">
        <AlertTriangle className="mr-2" /> 
        48-HOUR LIQUIDATION FIRE SALE — EVERYTHING MUST GO 
        <AlertTriangle className="ml-2" />
      </div>

      <div className="max-w-6xl mx-auto px-6 py-12">
        <header className="text-center mb-16">
          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 bg-gradient-to-r from-red-500 to-orange-400 bg-clip-text text-transparent">
            Premium Web3 Domain Portfolio
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
            I am liquidating my entire portfolio of 100 premium Unstoppable Domains to raise capital immediately. Prices are slashed to the absolute floor. First come, first served.
          </p>
          
          <div className="mt-8 inline-flex flex-col items-center justify-center p-6 bg-gray-900 border border-gray-800 rounded-2xl shadow-2xl">
            <span className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-2">Offer Expires In</span>
            <div className="text-6xl font-mono font-bold text-red-500 flex items-center">
              <Timer className="w-12 h-12 mr-4 opacity-50" />
              {formatTime(timeLeft)}
            </div>
          </div>
        </header>

        {/* BULK BUY OFFER */}
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-red-500/30 rounded-3xl p-8 md:p-12 mb-16 text-center transform hover:scale-[1.02] transition-transform">
          <div className="inline-block bg-red-500/10 text-red-400 font-bold px-4 py-2 rounded-full mb-6 border border-red-500/20">
            💎 INVESTOR SPECIAL
          </div>
          <h2 className="text-4xl font-bold mb-4">Buy The Entire Portfolio</h2>
          <p className="text-gray-400 text-lg mb-8 max-w-2xl mx-auto">
            Skip the individual sales. Acquire all 100 premium domains instantly in a single transaction for a massive discount. Instant transfer to your wallet.
          </p>
          <div className="flex flex-col md:flex-row items-center justify-center gap-6">
            <div className="text-left">
              <span className="block text-gray-500 line-through text-xl">Est Value: $5,000+</span>
              <span className="block text-5xl font-extrabold text-white">Buy It Now: $1,000</span>
            </div>
            <button className="bg-red-600 hover:bg-red-500 text-white px-8 py-4 rounded-xl font-bold text-lg flex items-center shadow-lg shadow-red-500/20 transition-all">
              <Wallet className="mr-3" /> Connect Wallet & Buy All
            </button>
          </div>
        </div>

        {/* INDIVIDUAL DOMAINS GRID */}
        <div className="mb-8 flex justify-between items-end border-b border-gray-800 pb-4">
          <h2 className="text-2xl font-bold">Individual Domains</h2>
          <span className="text-gray-500 text-sm">Showing 6 of 100</span>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {domains.map((domain, i) => (
            <div key={i} className="bg-gray-900 border border-gray-800 hover:border-gray-700 p-6 rounded-2xl flex flex-col justify-between group transition-colors">
              <div className="mb-6">
                <ShieldCheck className="text-blue-500 w-6 h-6 mb-3" />
                <h3 className="font-mono text-lg font-bold text-gray-200 group-hover:text-white transition-colors break-all">
                  {domain.name}
                </h3>
              </div>
              <div className="flex justify-between items-center mt-auto pt-4 border-t border-gray-800">
                <span className="text-2xl font-bold text-green-400">{domain.price}</span>
                <button className="text-sm bg-white text-black font-bold px-4 py-2 rounded-lg hover:bg-gray-200 flex items-center transition-colors">
                  Buy <ArrowRight className="w-4 h-4 ml-1" />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <button className="bg-gray-800 hover:bg-gray-700 text-white px-8 py-4 rounded-xl font-bold transition-colors">
            Load Remaining 94 Domains...
          </button>
        </div>

        <footer className="mt-24 pt-8 border-t border-gray-900 text-center text-gray-600 text-sm">
          <p>Verified Unstoppable Domains owner. All transfers are executed securely via smart contract.</p>
        </footer>
      </div>
    </div>
  );
}
