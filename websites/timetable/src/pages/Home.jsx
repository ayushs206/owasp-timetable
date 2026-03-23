import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BackgroundElements from "@/components/BackgroundElements";
import Seo from "@/components/Seo";
import { SEO_SITE_URL, SEO_SITE_NAME } from "@/lib/seo.config";

// Temporary placeholders for our cards until we implement them
import ScheduleCard from "@/components/ScheduleCard";
import FreeSlotsCard from "@/components/FreeSlotsCard";
import CalendarCard from "@/components/CalendarCard";

const siteUrl = SEO_SITE_URL || "https://owasp-projects-site-timetable.vercel.app";

const homeStructuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      name: SEO_SITE_NAME,
      url: siteUrl,
      inLanguage: "en",
    },
    {
      "@type": "WebApplication",
      name: SEO_SITE_NAME,
      applicationCategory: "EducationApplication",
      operatingSystem: "Web",
      description:
        "Student timetable dashboard to view schedules, find free slots, and sync calendar events.",
      url: siteUrl,
    },
  ],
};

export function HomeSite() {
  return (
    <div className="min-h-screen flex flex-col relative text-foreground w-full">
      <Seo
        title="Thapar"
        description="Ditch messy Excel sheets. Select your batch to view your timetable in a clean, interactive format, and instantly find common free slots with friends to plan your day smarter."
        path="/"
        keywords={["timetable", "schedule", "free slots", "calendar sync", "tiet", "owasp student chapter", "thapar"]}
        structuredData={homeStructuredData}
      />
      <BackgroundElements />
      <Navbar />

      <main className="flex-1 w-full max-w-[1400px] mx-auto px-6 pt-32 pb-16 flex flex-col items-center justify-center">
        <div className="text-center space-y-4 mb-16">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-white to-white/60">
            Timetable & Free Slots
          </h1>
          <p className="text-lg text-white/60 max-w-2xl mx-auto">
            Ditch messy Excel sheets. Select your batch to view your timetable in a clean, interactive format, and instantly find common free slots with friends to plan your day smarter.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
          <CalendarCard />
          <ScheduleCard />
          <FreeSlotsCard />
        </div>

        <section className="w-full mt-12 glass-card rounded-2xl p-6 md:p-8 border border-white/10">
          <h2 className="text-2xl font-bold text-white tracking-tight">How this works</h2>
          <p className="text-sm text-white/60 mt-2 max-w-3xl">
            Quick heads-up so you know exactly what changes are personal to you and what gets synced externally.
          </p>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
              <h3 className="text-sm font-semibold text-white">Google Calendar Sync</h3>
              <p className="text-sm text-white/60 mt-1">
                Sync uses the official college Excel timetable. Login is allowed only with valid Thapar email accounts.
              </p>
            </div>

            <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
              <h3 className="text-sm font-semibold text-white">Your Editable Schedule</h3>
              <p className="text-sm text-white/60 mt-1">
                You can edit classes for personal preview and save them locally on your device. Reset brings you back to the original batch timetable.
              </p>
            </div>

            <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
              <h3 className="text-sm font-semibold text-white">Free Slots Logic</h3>
              <p className="text-sm text-white/60 mt-1">
                Free slots calculation prefers your locally saved batch changes. If no local data exists, it uses backend timetable data.
              </p>
            </div>

            <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
              <h3 className="text-sm font-semibold text-white">Export</h3>
              <p className="text-sm text-white/60 mt-1">
                Download your schedule as a PNG anytime from the Schedule page.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}