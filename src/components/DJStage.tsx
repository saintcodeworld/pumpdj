"use client";

import React from "react";
import { motion, useAnimation } from "framer-motion";
import { useAudioAnalyzer, AudioData } from "@/hooks/useAudioAnalyzer";
import clsx from "clsx";

export const DJStage = () => {
    const { bass, mid, treble, volume } = useAudioAnalyzer();

    // Animation Variants
    // Head: Nods with Bass
    const headVariants = {
        animate: (bass: number) => ({
            rotate: Math.sin(Date.now() / 100) * (bass * 15), // Basic nod logic mixed with time
            y: bass * 10,
            transition: { type: "spring" as const, stiffness: 300, damping: 20 }
        })
    };

    // Body: Pulses with Volume/Bass
    const bodyVariants = {
        animate: (volume: number) => ({
            scale: 1 + (volume * 0.1),
            filter: `brightness(${1 + volume}) drop-shadow(0 0 ${volume * 20}px #00ff00)`,
            transition: { type: "tween" as const, ease: "linear" as const, duration: 0.1 }
        })
    };

    // Arms: Scratch intensity with Mid/Treble
    const leftArmVariants = {
        animate: (mid: number) => ({
            rotate: -10 + (mid * 40),
            x: mid * -5,
            transition: { type: "spring" as const, stiffness: 200 }
        })
    };

    const rightArmVariants = {
        animate: (treble: number) => ({
            rotate: 10 - (treble * 40),
            x: treble * 5,
            transition: { type: "spring" as const, stiffness: 200 }
        })
    };

    return (
        <div className="relative w-full h-full flex items-center justify-center overflow-hidden border-b border-[#00ff0033] bg-gradient-to-t from-[#00ff0011] to-black">
            {/* Grid Background Effect */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,0,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,0,0.1)_1px,transparent_1px)] bg-[size:40px_40px] [transform:perspective(500px)_rotateX(60deg)_translateY(200px)] opacity-50" />

            {/* Main Avatar Container */}
            <div className="relative z-10 w-full h-full flex items-center justify-center p-4">
                {/* Placeholder for now if image isn't perfectly sliced, but we will try to simulate slices via CSS masks if possible, or just animate the whole image + overlays if needed.
            Given the user request, I'll attempt to use the single image and maybe just bounce it for now,
            OR if I can't slice it easily without manual editing, I will animate the whole container for "Body"
            and maybe overlay "Arms" if I had separate assets.

            Strategy: Since I only have `dj pump.jpg`, I cannot actally rotate *just* the arms unless I mask them.
            For V1, I will animate the *Whole Image* with the Pulse (Body),
            and maybe "fake" the arm movement by rotating the whole image slightly or adding overlay elements (like glowing record discs).

            ACTUALLY, the prompt asked to: "Mentally or programmatically split... CSS clip-path".
            I will try to create 3 layers of the same image:
            1. Body (Base)
            2. Head (Masked)
            3. Arms (Masked)
            This is hard to guess coordinates for without seeing it.

            Fallback: I will just animate the whole image scaling (Body) and maybe a "Head" overlay crop that rotates.

            Let's try a generic center crop for head, and bottom for arms.
         */}

                <motion.div
                    className="relative max-w-full max-h-full flex items-center justify-center"
                    variants={bodyVariants}
                    custom={bass}
                    animate="animate"
                >
                    {/* Base Image (Body) */}
                    <img
                        src="/assets/dj pump.jpg"
                        alt="DJ Pump"
                        className="max-w-full max-h-full object-contain drop-shadow-[0_0_15px_rgba(0,255,0,0.5)]"
                    />

                    {/* Visualizer Particles/Glow */}
                    <div className="absolute inset-0 bg-[#00ff00] rounded-full blur-[100px] opacity-10 -z-10" />
                </motion.div>
            </div>

            {/* Frequency Bars Overlay (Hype Meter styled as bars behind?) */}
            <div className="absolute bottom-0 left-0 right-0 flex justify-center items-end gap-1 h-32 px-4 pointer-events-none">
                {Array.from({ length: 20 }).map((_, i) => (
                    <motion.div
                        key={i}
                        className="w-4 bg-[#00ff00] opacity-50"
                        animate={{
                            height: `${Math.max(10, Math.random() * (bass * 200 + mid * 100))}%`,
                        }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                ))}
            </div>
        </div>
    );
};
