"use client";

import React, { createContext, useContext, useState } from "react";

export interface Track {
    url: string;
    title: string;
    image?: string;
    author?: string;
    duration?: string;
}

interface PlayerContextType {
    currentTrack: Track | null;
    isPlaying: boolean;
    playTrack: (track: Track) => void;
    togglePlay: () => void;
    setPlaying: (playing: boolean) => void;
}

const PlayerContext = createContext<PlayerContextType | null>(null);

export const PlayerProvider = ({ children }: { children: React.ReactNode }) => {
    const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);

    const playTrack = (track: Track) => {
        setCurrentTrack(track);
        setIsPlaying(true);
    };

    const togglePlay = () => {
        setIsPlaying(prev => !prev);
    };

    return (
        <PlayerContext.Provider value={{ currentTrack, isPlaying, playTrack, togglePlay, setPlaying: setIsPlaying }}>
            {children}
        </PlayerContext.Provider>
    );
};

export const usePlayer = () => {
    const context = useContext(PlayerContext);
    if (!context) {
        throw new Error("usePlayer must be used within a PlayerProvider");
    }
    return context;
};
