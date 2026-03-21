import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BackgroundElements from "@/components/BackgroundElements";

// Temporary placeholders for our cards until we implement them
import ScheduleCard from "@/components/ScheduleCard";
import FreeSlotsCard from "@/components/FreeSlotsCard";

export function HomeSite() {
  return (
    <div className="min-h-screen flex flex-col relative text-foreground w-full">
      <BackgroundElements />
      <Navbar />

      <main className="flex-1 w-full max-w-7xl mx-auto px-6 pt-32 pb-16 flex flex-col items-center justify-center">
        <div className="text-center space-y-4 mb-16">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-white to-white/60">
            Timetable & Free Slots
          </h1>
          <p className="text-lg text-white/60 max-w-2xl mx-auto">
            Ditch messy Excel sheets. Select your batch to view your timetable in a clean, interactive format, and instantly find common free slots with friends to plan your day smarter.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-5xl">
          <ScheduleCard />
          <FreeSlotsCard />
        </div>
      </main>

      <Footer />
    </div>
  );
}