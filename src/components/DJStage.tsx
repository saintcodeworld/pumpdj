"use client";

import React, { useRef, useEffect } from "react";
import { usePlayer } from "@/context/PlayerContext";

export const DJStage = () => {
    const { isPlaying } = usePlayer();
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        if (isPlaying) {
            video.play().catch(() => {});
        } else {
            video.pause();
            if (!video.currentTime) {
                video.currentTime = 0;
            }
        }
    }, [isPlaying]);

    return (
        <div className="absolute inset-0 flex items-center justify-center overflow-hidden bg-black">
            <video
                ref={videoRef}
                src="/animation.mp4"
                loop
                muted
                playsInline
                preload="auto"
                className="absolute inset-0 w-full h-full object-contain"
            />
        </div>
    );
};
