"use client";

import React, { useState } from "react";
import { useAudioContext } from "@/context/AudioContext";
import { usePlayer } from "@/context/PlayerContext";
import { Play } from "lucide-react";

const DEFAULT_TRACK = {
    url: "https://www.youtube.com/watch?v=RaLbiz73z5Q",
    title: "PumpFun DJ Radio",
    image: "https://i.ytimg.com/vi/RaLbiz73z5Q/hqdefault.jpg",
};

export const StartOverlay = () => {
    const { resumeContext, audioContext } = useAudioContext();
    const { playTrack } = usePlayer();
    const [started, setStarted] = useState(false);

    const handleStart = async () => {
        await resumeContext();
        playTrack(DEFAULT_TRACK);
        setStarted(true);
    };

    if (started || (audioContext?.state === "running")) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
            <button
                onClick={handleStart}
                className="group relative flex items-center gap-4 bg-[#00ff00] text-black px-8 py-4 rounded-full font-bold text-xl hover:scale-105 transition shadow-[0_0_30px_#00ff00]"
            >
                <Play size={32} fill="black" />
                ENTER THE STAGE
                <div className="absolute inset-0 rounded-full border-2 border-[#00ff00] animate-ping opacity-50 pointer-events-none" />
            </button>
        </div>
    );
};
