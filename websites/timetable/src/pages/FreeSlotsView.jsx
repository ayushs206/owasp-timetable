import { useEffect, useState, useMemo } from "react";
import { useLocation, Link } from "react-router-dom";
import { ArrowLeft, Loader2, Users, ChevronDown } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BackgroundElements from "@/components/BackgroundElements";
import Seo from "@/components/Seo";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
const TIMES = [
  "08:00 AM",
  "08:50 AM",
  "09:40 AM",
  "10:30 AM",
  "11:20 AM",
  "12:10 PM",
  "01:00 PM",
  "01:50 PM",
  "02:40 PM",
  "03:30 PM",
  "04:20 PM",
];

const getScheduleStorageKey = (batchName) => `timetable:schedule:${batchName}`;

const isValidScheduleShape = (value) => value && typeof value === "object" && !Array.isArray(value);

const normalizeBatchSchedules = (payload, batches) => {
  const raw = payload?.data ?? payload;
  if (Array.isArray(raw)) {
    return raw;
  }

  if (raw && typeof raw === "object") {
    return batches.map((batch) => raw[batch] || raw[batch?.toUpperCase?.()] || null);
  }

  return [];
};

const getStoredScheduleForBatch = (batchName) => {
  try {
    const stored = localStorage.getItem(getScheduleStorageKey(batchName));
    if (!stored) return null;

    const parsed = JSON.parse(stored);
    return isValidScheduleShape(parsed) ? parsed : null;
  } catch {
    return null;
  }
};

const hasClassInSlot = (schedule, day, time) => {
  const dayData = schedule?.[day];
  if (!dayData || typeof dayData !== "object") return false;

  const slotValue = dayData[time];
  if (slotValue === undefined || slotValue === null) return false;

  if (Array.isArray(slotValue)) {
    return slotValue.some((item) => String(item ?? "").trim() !== "");
  }

  if (typeof slotValue === "string") {
    return slotValue.trim() !== "";
  }

  if (typeof slotValue === "object") {
    return Object.keys(slotValue).length > 0;
  }

  return Boolean(slotValue);
};

const calculateCommonFreeSlots = (schedules) => {
  const validSchedules = schedules.filter((schedule) => isValidScheduleShape(schedule));

  return DAYS.reduce((acc, day) => {
    acc[day] = TIMES.filter((time) => validSchedules.every((schedule) => !hasClassInSlot(schedule, day, time)));
    return acc;
  }, {});
};

export default function FreeSlotsView() {
  const location = useLocation();
  const rawBatches = location.state?.batches;
  const batches = useMemo(() => rawBatches || [], [rawBatches]);

  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [expandedDay, setExpandedDay] = useState(DAYS[0]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        if (batches.length > 0) {
          const res = await fetch(`/api/v1/timetable/freeslots`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ batches }),
          });
          if (res.ok) {
            const data = await res.json();
            const backendSchedules = normalizeBatchSchedules(data, batches);

            const mergedSchedules = batches.map((batchName, index) => {
              const localSchedule = getStoredScheduleForBatch(batchName);
              if (localSchedule) return localSchedule;

              const backendSchedule = backendSchedules[index];
              return isValidScheduleShape(backendSchedule) ? backendSchedule : {};
            });

            setResult(calculateCommonFreeSlots(mergedSchedules));
          } else {
            setError("Failed to fetch free slots data.");
          }
        } else {
          setError("No batches provided for free slots.");
        }
      } catch (err) {
        setError(`API connection failed: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [batches]);

  return (
    <div className="min-h-screen flex flex-col relative text-foreground w-full">
      <Seo
        title="Common Free Slots"
        description="Compare selected batches and discover overlapping free time slots for easier planning."
        path="/freeslots"
        keywords={[
          "free slots",
          "common availability",
          "batch comparison",
          "student planner",
        ]}
      />
      <BackgroundElements />
      <Navbar />

      <main className="flex-1 w-full max-w-7xl mx-auto px-6 pt-32 pb-16 flex flex-col">
        <div className="mb-8">
          <Link to="/" className="inline-flex items-center gap-2 text-white/50 hover:text-white transition-colors">
            <ArrowLeft size={16} />
            <span>Back to Dashboard</span>
          </Link>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mt-6 mb-2">
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <span className="p-2 bg-fuchsia-500/20 text-fuchsia-500 rounded-lg">
                <Users size={24} />
              </span>
              Common Free Slots
            </h1>
            {batches.length > 0 && (
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-white/50 text-sm">Batches:</span>
                <div className="flex flex-wrap gap-1">
                  {batches.map((b) => (
                    <span key={b} className="text-xs px-2 py-1 bg-white/10 rounded-md text-white/80">
                      {b}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
          <p className="text-white/50">Find overlapping free time slots among selected batches.</p>
        </div>

        <div className="glass-card rounded-2xl p-6 min-h-[400px] flex flex-col relative overflow-hidden">
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-fuchsia-500/10 rounded-full blur-3xl pointer-events-none" />

          {loading ? (
            <div className="flex flex-col items-center justify-center flex-1 text-white/50 gap-4 relative z-10">
              <Loader2 size={32} className="animate-spin text-fuchsia-500" />
              <p>Calculating common free slots...</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center flex-1 text-rose-400 gap-4 relative z-10">
              <p>{error}</p>
            </div>
          ) : result ? (
            <div className="flex-1 flex flex-col relative z-10 w-full">
              {/* Desktop View: Grid (Refined to optimally fill screen) */}
              <div className="hidden md:block w-full overflow-x-auto custom-scrollbar">
                <table className="w-full text-left border-collapse table-fixed min-w-[700px]">
                  <thead>
                    <tr>
                      <th className="p-4 border-b border-white/10 bg-white/5/50 font-semibold text-white/90 w-28 text-sm sticky left-0 z-20 backdrop-blur-md">
                        Day
                      </th>
                      {TIMES.map((time) => {
                         const [timeVal, period] = time.split(" ");
                         return (
                          <th
                            key={time}
                            className="p-3 border-b border-white/10 bg-white/5/50 font-medium text-center"
                          >
                            <div className="flex flex-col items-center justify-center gap-0.5">
                              <span className="text-sm text-white/90">{timeVal}</span>
                              <span className="text-[10px] text-white/50 tracking-widest">{period}</span>
                            </div>
                          </th>
                        );
                      })}
                    </tr>
                  </thead>
                  <tbody>
                    {DAYS.map((day) => (
                      <tr key={day} className="group transition-colors">
                        <td className="p-4 border-b border-white/5 bg-black/40 group-hover:bg-white/5 font-medium text-white/80 border-r border-white/10 text-sm sticky left-0 z-10 w-28 backdrop-blur-md transition-colors">
                          {day}
                        </td>
                        {TIMES.map((time) => {
                          const isFree = result[day]?.includes(time);
                          return (
                            <td
                              key={time}
                              className={`p-2 border-b border-white/5 text-center transition-all ${
                                isFree
                                  ? "bg-emerald-500/[0.08] hover:bg-emerald-500/[0.15]"
                                  : "text-white/20 hover:bg-white/5"
                              }`}
                            >
                              <div className="flex items-center justify-center min-h-[48px] w-full h-full">
                                {isFree ? (
                                  <span className="px-3 py-1.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-semibold text-xs tracking-wider shadow-[0_0_15px_rgba(16,185,129,0.1)]">
                                    FREE
                                  </span>
                                ) : (
                                  <span className="opacity-20">-</span>
                                )}
                              </div>
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile View: Accordion / List */}
              <div className="md:hidden flex flex-col gap-4">
                {DAYS.map((day) => {
                  const freeTimes = result[day] || [];
                  const isExpanded = expandedDay === day;

                  return (
                    <div key={day} className="flex flex-col rounded-xl overflow-hidden glass border-white/10">
                      <button
                        onClick={() => setExpandedDay(isExpanded ? null : day)}
                        className={`flex items-center justify-between p-4 transition-colors ${
                          isExpanded ? "bg-white/10" : "hover:bg-white/5"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="font-semibold text-white/90">{day}</span>
                          <span
                            className={`text-xs px-2 py-1 rounded-full ${
                              freeTimes.length > 0
                                ? "bg-emerald-500/20 text-emerald-400"
                                : "bg-white/10 text-white/40"
                            }`}
                          >
                            {freeTimes.length} slots free
                          </span>
                        </div>
                        <ChevronDown
                          size={18}
                          className={`text-white/50 transition-transform ${
                            isExpanded ? "rotate-180" : ""
                          }`}
                        />
                      </button>

                      <div
                        className={`transition-all duration-300 overflow-hidden ${
                          isExpanded ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
                        }`}
                      >
                        <div className="p-4 bg-black/20 border-t border-white/5 flex flex-col gap-2">
                          {freeTimes.length > 0 ? (
                            <div className="grid grid-cols-2 gap-2">
                              {freeTimes.map((time) => (
                                <div
                                  key={time}
                                  className="flex items-center justify-center p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium"
                                >
                                  {time}
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="text-center p-4 text-white/40 text-sm italic">
                              No free slots on this day.
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center flex-1 text-white/50 relative z-10">
              <p>No data to display.</p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
