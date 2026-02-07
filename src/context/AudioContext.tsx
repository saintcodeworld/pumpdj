"use client";

import React, { createContext, useContext, useEffect, useRef, useState } from "react";

interface AudioContextType {
    audioContext: AudioContext | null;
    analyser: AnalyserNode | null;
    connectSource: (element: HTMLMediaElement) => void;
    isAudioReady: boolean;
    setSimulationMode: (enabled: boolean) => void;
    simulationMode: boolean;
    resumeContext: () => Promise<void>;
}

const AudioContextData = createContext<AudioContextType | null>(null);

export const AudioProvider = ({ children }: { children: React.ReactNode }) => {
    const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
    const [analyser, setAnalyser] = useState<AnalyserNode | null>(null);
    const [isAudioReady, setIsAudioReady] = useState(false);
    const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
    const [simulationMode, setSimulationMode] = useState(false);

    useEffect(() => {
        // Initialize AudioContext on mount (must be resumed by user interaction later)
        const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const ana = ctx.createAnalyser();
        ana.fftSize = 256; // Trade-off between resolution and performance
        ana.smoothingTimeConstant = 0.8;

        setAudioContext(ctx);
        setAnalyser(ana);

        return () => {
            ctx.close();
        };
    }, []);

    const connectSource = (element: HTMLMediaElement) => {
        if (!audioContext || !analyser) return;

        // Prevent double connection
        if (sourceRef.current) {
            // already connected to something? 
            // specific logic might be needed to disconnect, but for now we assume one main player
            return;
        }

        try {
            const source = audioContext.createMediaElementSource(element);
            source.connect(analyser);
            analyser.connect(audioContext.destination);
            sourceRef.current = source;
            setIsAudioReady(true);
            setSimulationMode(false); // Disable simulation if real connection succeeds
            console.log("Audio source connected successfully");
        } catch (e) {
            console.error("Failed to connect audio source:", e);
            // Usually fails if element is already connected or cross-origin issues
        }
    };

    const resumeContext = async () => {
        if (audioContext && audioContext.state === "suspended") {
            await audioContext.resume();
        }
    };

    return (
        <AudioContextData.Provider
            value={{ audioContext, analyser, connectSource, isAudioReady, resumeContext, simulationMode, setSimulationMode }}
        >
            {children}
        </AudioContextData.Provider>
    );
};

export const useAudioContext = () => {
    const context = useContext(AudioContextData);
    if (!context) {
        throw new Error("useAudioContext must be used within an AudioProvider");
    }
    return context;
};
