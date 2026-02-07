"use client";

import { Dashboard } from "@/components/Dashboard";
import { DJStage } from "@/components/DJStage";
import { MusicController } from "@/components/MusicController";

export default function Home() {
  return (
    <Dashboard>
      <div className="flex flex-col w-full h-full gap-6">
        {/* The Main Stage Container */}
        <div className="relative w-full aspect-video bg-[#050505] border-2 border-[#111] rounded-lg overflow-hidden shadow-[0_0_40px_rgba(0,255,0,0.1)] group shrink-0">
          {/* Decorative Corner Borders */}
          <div className="absolute top-0 left-0 w-4 h-4 border-l-2 border-t-2 border-[#00ff00] z-20" />
          <div className="absolute top-0 right-0 w-4 h-4 border-r-2 border-t-2 border-[#00ff00] z-20" />
          <div className="absolute bottom-0 left-0 w-4 h-4 border-l-2 border-b-2 border-[#00ff00] z-20" />
          <div className="absolute bottom-0 right-0 w-4 h-4 border-r-2 border-b-2 border-[#00ff00] z-20" />

          {/* Live Badge */}
          <div className="absolute top-4 left-4 z-20 bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded animate-pulse shadow-[0_0_10px_red]">
            LIVE FEED
          </div>

          <DJStage />
        </div>

        {/* Controller Section */}
        <div className="w-full pb-10">
            <MusicController />
        </div>
      </div>
    </Dashboard>
  );
}
