"use client";

import React from "react";
import { Zap, TrendingUp, Activity } from "lucide-react";
import { useAudioAnalyzer } from "@/hooks/useAudioAnalyzer";
import { motion } from "framer-motion";
import { useTokenData } from "@/hooks/useTokenData";
import { StartOverlay } from "./StartOverlay";

import { Chat } from "./Chat";
import { TrackList } from "./TrackList";

const BackgroundVisualizer = () => {
    const { bass, mid, treble, volume } = useAudioAnalyzer();

    return (
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
            <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,0,0.1)_2px,transparent_2px),linear-gradient(90deg,rgba(0,255,0,0.1)_2px,transparent_2px)] bg-[size:50px_50px] opacity-10" />

            <motion.div
                className="absolute inset-0 bg-[radial-gradient(circle_at_center,#00ff0015,transparent_70%)]"
                animate={{ opacity: 0.3 + volume * 0.7, scale: 1 + bass * 0.05 }}
                transition={{ type: "tween", duration: 0.1 }}
            />

            <div className="absolute bottom-0 left-0 right-0 flex justify-center items-end gap-[2px] h-[40%] px-4 opacity-[0.08]">
                {Array.from({ length: 48 }).map((_, i) => {
                    const position = i / 48;
                    let intensity;
                    if (position < 0.3) intensity = bass;
                    else if (position < 0.6) intensity = mid;
                    else intensity = treble;

                    return (
                        <motion.div
                            key={i}
                            className="flex-1 bg-gradient-to-t from-[#00ff00] to-[#00ff0000] rounded-t-sm"
                            animate={{
                                height: `${Math.max(5, intensity * 100 + Math.random() * 20)}%`,
                            }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        />
                    );
                })}
            </div>

            <motion.div
                className="absolute top-0 left-0 right-0 flex justify-center items-start gap-[2px] h-[30%] px-4 opacity-[0.05] rotate-180"
                animate={{ opacity: volume > 0.1 ? 0.05 : 0 }}
            >
                {Array.from({ length: 32 }).map((_, i) => {
                    const position = i / 32;
                    let intensity;
                    if (position < 0.3) intensity = bass;
                    else if (position < 0.6) intensity = mid;
                    else intensity = treble;

                    return (
                        <motion.div
                            key={i}
                            className="flex-1 bg-gradient-to-t from-[#00ff00] to-[#00ff0000] rounded-t-sm"
                            animate={{
                                height: `${Math.max(3, intensity * 80 + Math.random() * 15)}%`,
                            }}
                            transition={{ type: "spring", stiffness: 200, damping: 25 }}
                        />
                    );
                })}
            </motion.div>

            <motion.div
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[#00ff00] blur-[200px]"
                animate={{ opacity: bass * 0.06, scale: 0.8 + bass * 0.4 }}
                transition={{ type: "tween", duration: 0.15 }}
            />
        </div>
    );
};

export const Dashboard = ({ children }: { children: React.ReactNode }) => {
    const { volume } = useAudioAnalyzer();
    const { data: tokenData, loading: tokenLoading } = useTokenData();

    return (
        <div className="h-screen bg-black text-[#00ff00] font-mono flex flex-col items-center relative overflow-hidden">
            <StartOverlay />
            <BackgroundVisualizer />

            <header className="w-full border-b border-[#00ff00] p-4 flex justify-between items-center bg-[#050505]/80 backdrop-blur-sm z-20 shrink-0">
                <h1 className="text-2xl font-bold tracking-tighter shadow-green-500 drop-shadow-[0_0_5px_#00ff00]">
                    PUMP.DJ <span className="text-xs align-top opacity-70">v1.0</span>
                </h1>
                <div className="flex gap-4 text-xs">
                    <div className="flex items-center gap-1">
                        <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                        LIVE
                    </div>
                </div>
            </header>

            <main className="flex-1 w-full max-w-[1600px] flex flex-col lg:flex-row gap-6 p-4 lg:p-6 z-10 relative overflow-hidden">

                <aside className="lg:w-80 hidden lg:flex flex-col gap-4 overflow-hidden h-full shrink-0">
                    <div className="bg-[#111]/80 backdrop-blur-sm border border-[#333] p-4 rounded-lg shrink-0">
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
                        </div>

                        <motion.a
                            href="https://pump.fun/coin/UPobTBUrQ7gzv6ApMSvNGyzLnWHWeigKnbpuGmwpump"
                            target="_blank"
                            rel="noopener noreferrer"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            animate={{ boxShadow: `0 0 ${10 + volume * 20}px #00ff00` }}
                            className="w-full mt-6 bg-[#00ff00] text-black font-bold py-3 rounded uppercase tracking-wide flex items-center justify-center gap-2"
                        >
                            <Zap size={18} fill="black" /> Buy $VIBE
                        </motion.a>
                    </div>

                    <div className="flex-1 min-h-[300px] overflow-hidden">
                        <TrackList />
                    </div>
                </aside>

                <section className="flex-1 flex flex-col gap-6 overflow-y-auto scrollbar-thin scrollbar-thumb-[#00ff00] scrollbar-track-transparent pr-2">
                    {children}
                </section>

                <aside className="lg:w-80 flex flex-col gap-4 overflow-y-auto scrollbar-none shrink-0 h-full">
                    <div className="bg-[#111]/80 backdrop-blur-sm border border-[#333] p-4 rounded-lg shrink-0">
                        <h2 className="text-[#00ff00] mb-2 flex items-center gap-2 border-b border-[#333] pb-2">
                            <Activity size={16} /> HYPE METER
                        </h2>
                        <div className="h-40 flex items-end justify-between gap-1 p-2 bg-[#050505] rounded border border-[#222]">
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

                    <div className="flex-1 min-h-[300px]">
                        <Chat />
                    </div>
                </aside>

            </main>

            <footer className="w-full bg-[#00ff00] text-black overflow-hidden py-1 whitespace-nowrap border-t border-[#00ff00] shrink-0 z-20">
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
