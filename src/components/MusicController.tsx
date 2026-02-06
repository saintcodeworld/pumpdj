"use client";

import React, { useState, useRef } from "react";
import dynamic from 'next/dynamic';
import { Play, Pause, Search, Volume2, SkipBack, SkipForward, Radio } from "lucide-react";
import { useAudioContext } from "@/context/AudioContext";


// Dynamic import to prevent SSR issues with Audio/Video players
const ReactPlayer = dynamic(() => import("react-player"), { ssr: false });

export const MusicController = () => {
    const [inputValue, setInputValue] = useState("");
    const [currentTrack, setCurrentTrack] = useState<{ url: string; title: string; image?: string } | null>(null);
    const [playing, setPlaying] = useState(false);
    const [volume, setVolume] = useState(0.8);
    const [loading, setLoading] = useState(false);
    const [showVideo, setShowVideo] = useState(true); // Default to visible for reliability

    // RP is now the dynamically imported component, cast to any to avoid strict type/ref mismatches
    const RP = ReactPlayer as any;
    const playerRef = useRef<any>(null);
    const { connectSource, resumeContext, setSimulationMode } = useAudioContext();

    // 1. Search Logic
    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        const query = inputValue.trim();
        if (!query) return;

        setLoading(true);
        setPlaying(false); // Stop current track

        // Resume Audio Context early
        await resumeContext();

        try {
            // ALWAYS use API to get metadata, even for URLs
            // The API now handles URL parsing to extract Video ID
            const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);

            if (!res.ok) throw new Error("API Error");

            const data = await res.json();

            if (data.url) {
                setCurrentTrack({
                    url: data.url,
                    title: data.title || query,
                    image: data.image
                });
                // CRITICAL: Auto-play after load
                setPlaying(true);
            } else {
                alert("No track found.");
            }
        } catch (error) {
            console.error(error);
            // Fallback for direct URLs if API fails
            if (query.startsWith("http")) {
                setCurrentTrack({
                    url: query,
                    title: "Unknown Track",
                    image: "/assets/dj pump.jpg"
                });
                setPlaying(true);
            } else {
                alert("Search failed. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    // 2. Playback Logic
    const togglePlay = async () => {
        await resumeContext();
        setPlaying(!playing);
    };

    const handlePlayerReady = (player: any) => {
        const internalPlayer = player.getInternalPlayer();

        // Attempt to connect audio source for visualizer
        if (internalPlayer instanceof HTMLMediaElement) {
            internalPlayer.crossOrigin = "anonymous";
            connectSource(internalPlayer);
            setSimulationMode(false);
        } else {
            // It's likely an iframe (YouTube), so we must use simulation
            setSimulationMode(true);
        }
    };

    const handlePlayerError = (e: any) => {
        console.error("Player Error:", e);
        // Fallback to simulation mode if playback fails slightly but continues
        setSimulationMode(true);
    };

    return (
        <div className="w-full max-w-4xl mx-auto mt-6 flex flex-col gap-4">

            {/* 1. Main Controller Deck */}
            <div className="bg-[#0a0a0a] border border-[#00ff00] rounded-xl overflow-hidden shadow-[0_0_20px_#00ff0022]">

                {/* Search Header */}
                <div className="bg-[#111] p-4 border-b border-[#222] flex gap-2">
                    <form onSubmit={handleSearch} className="flex-1 flex gap-2">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#00ff0055]" size={16} />
                            <input
                                type="text"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                placeholder="Search song or paste YouTube URL..."
                                className="w-full bg-black border border-[#333] text-[#00ff00] pl-10 pr-4 py-2 rounded focus:outline-none focus:border-[#00ff00] focus:shadow-[0_0_10px_#00ff0033] font-mono transition-all"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-[#00ff00] text-black px-6 py-2 rounded font-bold font-mono hover:bg-[#00cc00] disabled:opacity-50 transition flex items-center gap-2"
                        >
                            {loading ? <span className="animate-spin">⏳</span> : "LOAD DECK"}
                        </button>
                    </form>
                </div>

                <div className="flex flex-col md:flex-row">
                    {/* Left: Player Visual / Screen */}
                    <div className="md:w-1/3 bg-black relative min-h-[200px] border-r border-[#222]">
                        {currentTrack ? (
                            <div className="relative w-full h-full flex flex-col">
                                {/* The Player - VISIBLE now to ensure browser compliance */}
                                <div className={`relative w-full aspect-video ${showVideo ? 'block' : 'hidden'}`}>
                                    <RP
                                        key={currentTrack.url} // Forces remount on track change
                                        ref={playerRef}
                                        url={currentTrack.url}
                                        playing={playing}
                                        volume={volume}
                                        controls={true}
                                        width="100%"
                                        height="100%"
                                        onReady={() => handlePlayerReady(playerRef.current)}
                                        onPlay={() => setPlaying(true)}
                                        onPause={() => setPlaying(false)}
                                        onError={handlePlayerError}
                                        config={{
                                            youtube: {
                                                playerVars: { showinfo: 1, autoplay: 0 }
                                            }
                                        } as any}
                                    />
                                </div>

                                {/* Overlay info if video is hidden or for style */}
                                <div className="p-3 bg-black/90 border-t border-[#222]">
                                    <h3 className="text-[#00ff00] font-bold text-sm line-clamp-1">{currentTrack.title}</h3>
                                    <div className="flex items-center gap-2 mt-2">
                                        <button
                                            onClick={() => setShowVideo(!showVideo)}
                                            className="text-[10px] text-gray-500 hover:text-white border border-gray-800 px-2 py-1 rounded"
                                        >
                                            {showVideo ? "HIDE VIDEO" : "SHOW VIDEO"}
                                        </button>
                                        <span className="text-[10px] text-[#00ff00] animate-pulse">● LIVE SIGNAL</span>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-[#222] p-6 text-center">
                                <Radio size={48} className="mb-2 opacity-20" />
                                <span className="font-mono text-xs">DECK EMPTY<br />LOAD A TRACK TO BEGIN</span>
                            </div>
                        )}
                    </div>

                    {/* Right: Controls */}
                    <div className="md:w-2/3 p-6 flex flex-col justify-between bg-[#080808]">

                        {/* Status Display */}
                        <div className="mb-6 p-4 bg-[#111] border border-[#222] rounded font-mono text-xs text-[#00ff00]/70 h-24 overflow-y-auto">
                            <p>{">"} SYSTEM READY...</p>
                            <p>{">"} AUDIO ENGINE: ONLINE</p>
                            {loading && <p className="text-yellow-500">{">"} SEARCHING ARCHIVES...</p>}
                            {currentTrack && <p className="text-white">{">"} TRACK LOADED: {currentTrack.title}</p>}
                            {playing && <p className="animate-pulse">{">"} PLAYBACK ACTIVE...</p>}
                        </div>

                        {/* Main Controls */}
                        <div className="flex items-center justify-between gap-4">
                            <div className="flex items-center gap-4">
                                <button className="p-2 text-gray-500 hover:text-white transition"><SkipBack size={24} /></button>
                                <button
                                    onClick={togglePlay}
                                    disabled={!currentTrack}
                                    className={`w-16 h-16 rounded-full flex items-center justify-center transition-all ${playing
                                        ? "bg-[#00ff00] text-black shadow-[0_0_20px_#00ff00]"
                                        : "bg-[#222] text-[#00ff00] hover:bg-[#333] border-2 border-[#00ff00]"
                                        }`}
                                >
                                    {playing ? <Pause size={32} fill="black" /> : <Play size={32} fill={currentTrack ? "#00ff00" : "none"} />}
                                </button>
                                <button className="p-2 text-gray-500 hover:text-white transition"><SkipForward size={24} /></button>
                            </div>

                            {/* Volume */}
                            <div className="flex items-center gap-3 bg-[#111] p-3 rounded-full border border-[#333]">
                                <Volume2 size={18} className="text-[#00ff00]" />
                                <input
                                    type="range"
                                    min={0}
                                    max={1}
                                    step={0.05}
                                    value={volume}
                                    onChange={(e) => setVolume(parseFloat(e.target.value))}
                                    className="w-24 accent-[#00ff00] h-1.5 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <p className="text-center text-[#333] text-xs font-mono uppercase">
                Powered by YouTube Audio Stream • Pump.DJ v1.0
            </p>
        </div>
    );
};
