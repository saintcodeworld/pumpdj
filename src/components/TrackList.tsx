"use client";

import React, { useEffect, useState } from "react";
import { Disc, Play, Music } from "lucide-react";
import { usePlayer, Track } from "@/context/PlayerContext";

export const TrackList = () => {
    const [tracks, setTracks] = useState<Track[]>([]);
    const [loading, setLoading] = useState(true);
    const { playTrack, currentTrack, isPlaying } = usePlayer();

    useEffect(() => {
        const fetchTracks = async () => {
            try {
                // Fetch default genre
                const res = await fetch("/api/tracks?genre=cyberpunk%20electronic%20music");
                if (res.ok) {
                    const data = await res.json();
                    console.log("[DJ] Playlist loaded:", data.length, "tracks. First:", data[0]);
                    setTracks(data);
                }
            } catch (error) {
                console.error("Failed to load playlist", error);
            } finally {
                setLoading(false);
            }
        };

        fetchTracks();
    }, []);

    return (
        <div className="bg-[#111] border border-[#333] rounded-lg flex flex-col h-full overflow-hidden">
            <h2 className="text-[#00ff00] p-4 border-b border-[#333] flex items-center gap-2 font-bold tracking-wider shrink-0">
                <Music size={16} /> PLAYLIST
            </h2>
            
            <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-[#00ff00] scrollbar-track-[#111] p-2 space-y-1">
                {loading ? (
                    <div className="text-center text-gray-500 py-10 animate-pulse">
                        LOADING ARCHIVES...
                    </div>
                ) : (
                    tracks.map((track) => {
                        const isActive = currentTrack?.url === track.url;
                        return (
                            <button
                                key={track.url}
                                onClick={() => {
                                    console.log("[DJ] Track clicked:", track.url, track.title);
                                    playTrack(track);
                                }}
                                className={`w-full text-left p-3 rounded flex items-center gap-3 transition-all group ${
                                    isActive 
                                    ? "bg-[#00ff00]/10 border border-[#00ff00]/50" 
                                    : "hover:bg-[#222] border border-transparent"
                                }`}
                            >
                                <div className={`w-10 h-10 rounded overflow-hidden bg-black shrink-0 relative flex items-center justify-center border ${isActive ? "border-[#00ff00]" : "border-[#333]"}`}>
                                    {track.image ? (
                                        <img src={track.image} alt={track.title} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                                    ) : (
                                        <Disc size={20} className="text-gray-600" />
                                    )}
                                    {isActive && isPlaying && (
                                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                            <div className="w-3 h-3 bg-[#00ff00] animate-pulse rounded-full" />
                                        </div>
                                    )}
                                </div>
                                
                                <div className="flex-1 min-w-0">
                                    <div className={`text-xs font-bold truncate ${isActive ? "text-[#00ff00]" : "text-gray-300 group-hover:text-white"}`}>
                                        {track.title}
                                    </div>
                                    <div className="text-[10px] text-gray-600 truncate">
                                        {track.author || "Unknown Artist"}
                                    </div>
                                </div>

                                {isActive ? (
                                    <div className="text-[#00ff00] text-[10px] font-mono animate-pulse">PLAYING</div>
                                ) : (
                                    <Play size={12} className="text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                                )}
                            </button>
                        );
                    })
                )}
            </div>
        </div>
    );
};
