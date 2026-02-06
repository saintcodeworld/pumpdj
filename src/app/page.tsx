"use client";

import { Dashboard } from "@/components/Dashboard";
import { DJStage } from "@/components/DJStage";
import { MusicController } from "@/components/MusicController";

export default function Home() {
  return (
    <Dashboard>
      <div className="flex flex-col gap-8 w-full">
        {/* The Main Stage */}
        <section className="w-full aspect-video bg-[#050505] border border-[#00ff00] rounded-xl overflow-hidden shadow-[0_0_20px_#00ff0033] relative">
          <DJStage />

          {/* Overlay Text/branding driven by music? */}
        </section>

        {/* Controller */}
        <MusicController />
      </div>
    </Dashboard>
  );
}
