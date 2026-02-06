"use client";

import { AudioProvider } from "@/context/AudioContext";
import { PlayerProvider } from "@/context/PlayerContext";

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <AudioProvider>
            <PlayerProvider>
                {children}
            </PlayerProvider>
        </AudioProvider>
    );
}
