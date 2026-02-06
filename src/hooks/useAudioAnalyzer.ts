"use client";

import { useEffect, useRef, useState } from "react";
import { useAudioContext } from "../context/AudioContext";

export interface AudioData {
    bass: number; // 0-1
    mid: number;  // 0-1
    treble: number; // 0-1
    volume: number; // 0-1 decibel-ish representation
}

export const useAudioAnalyzer = () => {
    const { analyser, isAudioReady, simulationMode } = useAudioContext();
    const [audioData, setAudioData] = useState<AudioData>({
        bass: 0,
        mid: 0,
        treble: 0,
        volume: 0,
    });
    const rAF = useRef<number | null>(null);
    const simTimeRef = useRef(0);

    useEffect(() => {
        // Real analysis
        if (analyser && isAudioReady && !simulationMode) {
            const bufferLength = analyser.frequencyBinCount;
            const dataArray = new Uint8Array(bufferLength);

            const update = () => {
                analyser.getByteFrequencyData(dataArray);

                // Simple frequency range mapping (assuming fftSize 256 -> 128 bins)
                // 44.1kHz / 256 = ~172Hz per bin (approx)
                // Actually: SampleRate / FFTSize. 44100 / 256 = 172Hz per bin? No.
                // 44100 Hz / 2 = 22050 Hz Nyquist.
                // 128 bins. 22050 / 128 = ~172 Hz per bin.

                // Bass: 20-250 Hz -> bins 0-2
                const bassRange = dataArray.slice(0, 3);
                const midRange = dataArray.slice(3, 20); // ~500Hz - 3kHz
                const trebleRange = dataArray.slice(20, 100); // 3kHz+

                const getAvg = (arr: Uint8Array) => arr.reduce((a, b) => a + b, 0) / arr.length;

                const bassAvg = getAvg(bassRange);
                const midAvg = getAvg(midRange);
                const trebleAvg = getAvg(trebleRange);
                const totalAvg = getAvg(dataArray);

                setAudioData({
                    bass: bassAvg / 255,
                    mid: midAvg / 255,
                    treble: trebleAvg / 255,
                    volume: totalAvg / 255,
                });

                rAF.current = requestAnimationFrame(update);
            };

            update();
        }
        // Simulation Mode
        else if (simulationMode) {
            const updateSim = () => {
                simTimeRef.current += 0.1;
                const t = simTimeRef.current;

                // Fake beats based on sine waves
                const beat = Math.abs(Math.sin(t * 2)); // 120ish BPM feel

                // Random-ish modulation
                const bassSim = beat * 0.8 + Math.random() * 0.2;
                const midSim = Math.abs(Math.sin(t * 1.5)) * 0.6 + Math.random() * 0.3;
                const trebleSim = Math.abs(Math.cos(t * 3)) * 0.5 + Math.random() * 0.4;
                const volSim = 0.5 + Math.random() * 0.3;

                setAudioData({
                    bass: bassSim,
                    mid: midSim,
                    treble: trebleSim,
                    volume: volSim,
                });

                rAF.current = requestAnimationFrame(updateSim);
            };
            updateSim();
        }

        return () => {
            if (rAF.current) cancelAnimationFrame(rAF.current);
        };
    }, [analyser, isAudioReady, simulationMode]);

    return audioData;
};
