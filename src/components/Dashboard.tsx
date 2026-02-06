"use client";

import React from "react";
import { Zap, TrendingUp, Activity } from "lucide-react";
import { useAudioAnalyzer } from "@/hooks/useAudioAnalyzer";
import { motion } from "framer-motion";
import { useTokenData } from "@/hooks/useTokenData";
import { StartOverlay } from "./StartOverlay";

import { Chat } from "./Chat";

export const Dashboard = ({ children }: { children: React.ReactNode }) => {
    const { volume } = useAudioAnalyzer();
    const { data: tokenData, loading: tokenLoading } = useTokenData();

    return (
        <div className="min-h-screen bg-black text-[#00ff00] font-mono flex flex-col items-center relative overflow-hidden">
            <StartOverlay />
            {/* Background Matrix/Grid Effect */}
            <div className="absolute inset-0 z-0 opacity-10 pointer-events-none bg-[linear-gradient(rgba(0,255,0,0.1)_2px,transparent_2px),linear-gradient(90deg,rgba(0,255,0,0.1)_2px,transparent_2px)] bg-[size:50px_50px]" />

            {/* Header */}
            <header className="w-full border-b border-[#00ff00] p-4 flex justify-between items-center bg-[#050505] z-20">
                <h1 className="text-2xl font-bold tracking-tighter shadow-green-500 drop-shadow-[0_0_5px_#00ff00]">
                    PUMP.DJ <span className="text-xs align-top opacity-70">v1.0</span>
                </h1>
                <div className="flex gap-4 text-xs">
                    <div className="flex items-center gap-1">
                        <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                        LIVE
                    </div>
                    <div>SOL/USD: $145.20</div>
                </div>
            </header>

            {/* Main Content Area */}
            <main className="flex-1 w-full max-w-6xl flex flex-col lg:flex-row gap-6 p-6 z-10 relative">

                {/* Left Panel: Token Info */}
                <aside className="lg:w-1/4 hidden lg:flex flex-col gap-4">
                    <div className="bg-[#111] border border-[#333] p-4 rounded-lg">
                        <h2 className="text-[#00ff00] mb-4 border-b border-[#333] pb-2 flex items-center gap-2">
                            <TrendingUp size={16} /> TOKEN METRICS
                        </h2>
                        <div className="space-y-4 text-sm text-gray-400">
                            <div className="flex justify-between">
                                <span>MCAP:</span>
                                <span className="text-white">
                                    {tokenLoading ? "..." : tokenData ? `$${tokenData.marketCap.toLocaleString()}` : "$0"}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span>SUPPLY:</span>
                                <span className="text-white">
                                    {tokenLoading ? "..." : tokenData ? tokenData.supply.toLocaleString() : "1,000,000,000"}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span>HOLDERS:</span>
                                <span className="text-white">
                                    {tokenLoading ? "..." : tokenData?.holders ? tokenData.holders.toLocaleString() : "TBD"}
                                </span>
                            </div>
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            animate={{ boxShadow: `0 0 ${10 + volume * 20}px #00ff00` }}
                            className="w-full mt-6 bg-[#00ff00] text-black font-bold py-3 rounded uppercase tracking-wide flex items-center justify-center gap-2"
                        >
                            <Zap size={18} fill="black" /> Buy $PUMP
                        </motion.button>
                    </div>
                </aside>

                {/* Center Stage (Children) */}
                <section className="flex-1 flex flex-col gap-6">
                    {children}
                </section>

                {/* Right Panel: Hype Meter & Activity */}
                <aside className="lg:w-1/4 flex flex-col gap-4">
                    {/* Hype Meter */}
                    <div className="bg-[#111] border border-[#333] p-4 rounded-lg">
                        <h2 className="text-[#00ff00] mb-2 flex items-center gap-2 border-b border-[#333] pb-2">
                            <Activity size={16} /> HYPE METER
                        </h2>
                        <div className="h-40 flex items-end justify-between gap-1 p-2 bg-[#050505] rounded border border-[#222]">
                            {/* Visual simulation of hype history */}
                            {Array.from({ length: 15 }).map((_, i) => (
                                <motion.div
                                    key={i}
                                    className="flex-1 bg-gradient-to-t from-[#00ff00] to-transparent opacity-50"
                                    animate={{
                                        height: `${Math.random() * 100}%`,
                                        opacity: 0.2 + (volume * 0.8)
                                    }}
                                    transition={{ type: "spring", stiffness: 100, damping: 20 }}
                                />
                            ))}
                        </div>
                        <div className="mt-2 text-center text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#00ff00] to-white">
                            {Math.round(volume * 100)} dB
                        </div>
                    </div>

                    {/* Live Activity / Chat */}
                    <Chat />
                </aside>

            </main>

            {/* Footer Ticker */}
            <footer className="w-full bg-[#00ff00] text-black overflow-hidden py-1 whitespace-nowrap border-t border-[#00ff00]">
                <motion.div
                    className="inline-block"
                    animate={{ x: ["100%", "-100%"] }}
                    transition={{ ease: "linear", duration: 20, repeat: Infinity }}
                >
                    PUMP THE JAM • BUY THE DIP • WAGMI • PUMP THE JAM • BUY THE DIP • WAGMI • PUMP THE JAM • BUY THE DIP • WAGMI
                </motion.div>
            </footer>
        </div>
    );
};
