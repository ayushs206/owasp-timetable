import { useEffect, useState, useRef } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { ArrowLeft, Loader2, Calendar, Download, Plus, Trash2, X, ChevronDown } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BackgroundElements from "@/components/BackgroundElements";
import { toPng } from 'html-to-image';

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

const getTypeColors = (type) => {
  const t = (type || "").toLowerCase();
  if (t.includes("lecture")) return "bg-blue-500/10 border-blue-500/30 text-blue-300";
  if (t.includes("practical") || t.includes("lab")) return "bg-emerald-500/10 border-emerald-500/30 text-emerald-300";
  if (t.includes("tutorial")) return "bg-fuchsia-500/10 border-fuchsia-500/30 text-fuchsia-300";
  return "bg-white/5 border-white/10 text-white/70";
};

const getTypeBadgeColors = (type) => {
  const t = (type || "").toLowerCase();
  if (t.includes("lecture")) return "bg-blue-500/20 text-blue-400";
  if (t.includes("practical") || t.includes("lab")) return "bg-emerald-500/20 text-emerald-400";
  if (t.includes("tutorial")) return "bg-fuchsia-500/20 text-fuchsia-400";
  return "bg-white/10 text-white/50";
};

export default function ScheduleView() {
  const [searchParams] = useSearchParams();
  const batch = searchParams.get("batch");

  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState(null); // original
  const [editedResult, setEditedResult] = useState(null); // local edits
  const [error, setError] = useState(null);
  
  const [expandedDay, setExpandedDay] = useState(DAYS[0]);
  const [isDownloading, setIsDownloading] = useState(false);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentEditSlot, setCurrentEditSlot] = useState(null); // { day, time }
  const [modalFormData, setModalFormData] = useState({ code: "", location: "", name: "", type: "Lecture" });

  const desktopTableRef = useRef(null);
  const hiddenTableRef = useRef(null); // For mobile capturing

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        if (batch) {
          const res = await fetch(`/api/v1/timetable/schedule/${encodeURIComponent(batch)}`);
          if (res.ok) {
            const data = await res.json();
            setResult(data.data);
            setEditedResult(JSON.parse(JSON.stringify(data.data))); // copy
          } else {
            setError("Failed to fetch schedule data.");
          }
        } else {
          setError("No batch specified.");
        }
      } catch (err) {
        setError(`API connection failed: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [batch]);

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      // ALways use the hidden off-screen table for reliable, unclipped PNG generation
      const element = hiddenTableRef.current;
      if (!element) return;

      // Small delay to ensure React commits and CSS paints the hidden table properly
      await new Promise(r => setTimeout(r, 100));
      
      const dataUrl = await toPng(element, { 
        backgroundColor: "#09090b", 
        pixelRatio: 2,
        skipFonts: false,
        style: {
          transform: 'none',
        }
      });
      
      const a = document.createElement("a");
      a.href = dataUrl;
      a.download = `Timetable_${batch}.png`;
      a.click();
    } catch (err) {
      console.error("Failed to generate PNG", err);
    } finally {
      setIsDownloading(false);
    }
  };

  const openSlotModal = (day, time, slotData) => {
    setCurrentEditSlot({ day, time });
    if (slotData && Array.isArray(slotData)) {
      setModalFormData({
        code: slotData[0] || "",
        location: slotData[1] || "",
        name: slotData[2] || "",
        type: slotData[3] || "Lecture"
      });
    } else if (slotData && typeof slotData === "string") {
      setModalFormData({ code: "", location: "", name: slotData, type: "Lecture" });
    } else {
      setModalFormData({ code: "", location: "", name: "", type: "Lecture" });
    }
    setIsModalOpen(true);
  };

  const saveSlot = () => {
    const { day, time } = currentEditSlot;
    const newSchedule = { ...editedResult };
    if (!newSchedule[day]) newSchedule[day] = {};
    
    newSchedule[day][time] = [
      modalFormData.code.trim(),
      modalFormData.location.trim(),
      modalFormData.name.trim() || "Subject",
      modalFormData.type
    ];
    
    setEditedResult(newSchedule);
    setIsModalOpen(false);
  };

  const deleteSlot = () => {
    const { day, time } = currentEditSlot;
    const newSchedule = { ...editedResult };
    if (newSchedule[day]) {
      delete newSchedule[day][time];
    }
    setEditedResult(newSchedule);
    setIsModalOpen(false);
  };

  // Shared generic cell render function
  const renderCellContent = (subjectList, isDesktop = true) => {
    if (!subjectList) return null;

    let code, loc, name, type;
    if (Array.isArray(subjectList)) {
      [code, loc, name, type] = subjectList;
    } else {
      name = subjectList;
      type = "Unknown";
    }

    if (isDesktop) {
      return (
        <div className={`flex flex-col h-full w-full p-1.5 rounded-md transition-all justify-center items-center text-center ${getTypeColors(type)}`}>
          <div className="flex justify-center items-center gap-1.5 mb-0.5 opacity-80 flex-wrap">
            <span className="font-bold text-[9px] uppercase tracking-wider">{code}</span>
            {loc && (
              <span className="text-[9px] tracking-wide inline-flex items-center gap-1">
                <div className="w-1 h-1 rounded-full bg-current opacity-50" />
                {loc}
              </span>
            )}
          </div>
          <span className="font-semibold text-[11px] leading-tight mb-1" title={name}>{name}</span>
          <span className={`text-[8px] px-1.5 py-0.5 rounded shadow-sm whitespace-nowrap uppercase tracking-wider ${getTypeBadgeColors(type)}`}>
            {type}
          </span>
        </div>
      );
    } else {
      // Mobile List view rendering
      return (
        <div className={`flex flex-col w-full p-3 border rounded-lg ${getTypeColors(type)}`}>
          <div className="flex justify-between items-start mb-1">
            <span className="font-bold text-xs uppercase tracking-wider">{code}</span>
            <span className={`text-[10px] px-2 py-0.5 rounded-full whitespace-nowrap ${getTypeBadgeColors(type)}`}>
              {type}
            </span>
          </div>
          <span className="font-semibold text-sm leading-tight mb-2">{name}</span>
          <span className="text-xs opacity-80 mt-auto truncate flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-current opacity-50" />
            {loc || "TBA"}
          </span>
        </div>
      );
    }
  };

  // Render unified table component (used for Desktop UI AND Hidden Mobile capture container)
  const renderDesktopTable = (refProps, isCaptureOnly = false) => (
    <div 
      {...refProps} 
      className={`w-full ${!isCaptureOnly ? "overflow-x-auto custom-scrollbar bg-black/40 rounded-2xl p-4 shadow-2xl glass-card border-none" : "bg-[#09090b] text-white p-4 w-[1100px] block"}`}
    >
      {!isCaptureOnly && (
        <div className="mb-4 flex items-center justify-between pb-4 border-b border-white/10">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Calendar className="text-rose-500" /> Schedule: {batch}
          </h2>
        </div>
      )}
      <table className="w-full text-left border-collapse table-fixed min-w-[1000px]">
        <thead>
          <tr>
            <th className={`p-3 border-b border-r border-white/10 bg-white/5 font-semibold text-white/90 w-24 text-sm ${!isCaptureOnly ? "sticky left-0 z-20 backdrop-blur-md" : ""}`}>
              Day
            </th>
            {TIMES.map((time) => {
                const [timeVal, period] = time.split(" ");
                return (
                <th key={time} className="p-2 border-b border-r border-white/10 bg-white/5 font-medium text-center w-[90px]">
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
              <td className={`p-3 border-b border-white/5 bg-black/40 font-medium text-white/80 border-r border-white/10 text-sm w-24 ${!isCaptureOnly ? "sticky left-0 z-10 backdrop-blur-md group-hover:bg-white/5" : ""}`}>
                {day.slice(0, 3)}
              </td>
              {TIMES.map((time) => {
                const subjectList = editedResult?.[day]?.[time];
                return (
                  <td
                    key={time}
                    onClick={() => !isCaptureOnly && openSlotModal(day, time, subjectList)}
                    className={`p-1.5 border-b border-r border-white/5 text-center transition-all h-[100px] w-[90px] align-top
                      ${!isCaptureOnly ? "cursor-pointer hover:bg-white/5" : ""} 
                    `}
                  >
                    {subjectList ? (
                      renderCellContent(subjectList, true)
                    ) : (
                      <div className={`flex items-center justify-center w-full h-full rounded-md border border-dashed border-white/10 text-white/10 ${!isCaptureOnly && "group-hover:text-white/30 group-hover:border-white/30 group-hover:bg-white/5"} transition-all min-h-[50px]`}>
                        {!isCaptureOnly ? <Plus size={16} /> : <span className="opacity-0 select-none">.</span>}
                      </div>
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col relative text-foreground w-full">
      <BackgroundElements />
      <Navbar />

      <main className="flex-1 w-full max-w-[1400px] mx-auto px-4 md:px-6 pt-32 pb-16 flex flex-col">
        <div className="mb-8 flex flex-col gap-6">
          <Link to="/" className="inline-flex items-center gap-2 text-white/50 hover:text-white transition-colors w-fit">
            <ArrowLeft size={16} />
            <span>Back to Dashboard</span>
          </Link>
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-white flex items-center gap-3 mb-2">
                <span className="p-2 bg-rose-500/20 text-rose-500 rounded-lg">
                  <Calendar size={24} />
                </span>
                Schedule for {batch}
              </h1>
              <p className="text-white/50">Edit your classes manually, then download your personalized timetable.</p>
            </div>
            
            {result && (
              <button
                onClick={handleDownload}
                disabled={isDownloading}
                className="flex items-center gap-2 px-4 py-2.5 bg-white text-black font-semibold rounded-lg hover:bg-white/90 transition-all shadow-lg active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed whitespace-nowrap w-fit self-start md:self-end"
              >
                {isDownloading ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
                Download PNG
              </button>
            )}
          </div>
        </div>

        <div className="relative flex flex-col flex-1">
          {loading ? (
            <div className="glass-card rounded-2xl p-6 min-h-[400px] flex flex-col items-center justify-center text-white/50 gap-4">
              <Loader2 size={32} className="animate-spin text-rose-500" />
              <p>Fetching schedule...</p>
            </div>
          ) : error ? (
            <div className="glass-card rounded-2xl p-6 min-h-[400px] flex flex-col items-center justify-center text-rose-400 gap-4">
              <p>{error}</p>
            </div>
          ) : editedResult ? (
            <>
              {/* Desktop View */}
              <div className="hidden md:block w-full">
                {renderDesktopTable({ ref: desktopTableRef })}
              </div>

              {/* Mobile View: Accordion */}
              <div className="md:hidden flex flex-col gap-4">
                {DAYS.map((day) => {
                  const daySlots = Object.entries(editedResult[day] || {}).sort((a,b) => TIMES.indexOf(a[0]) - TIMES.indexOf(b[0]));
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
                          <span className="text-xs px-2 py-1 rounded-full bg-white/10 text-white/60">
                            {daySlots.length} classes
                          </span>
                        </div>
                        <ChevronDown size={18} className={`text-white/50 transition-transform ${isExpanded ? "rotate-180" : ""}`} />
                      </button>

                      <div className={`transition-all duration-300 overflow-hidden ${isExpanded ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"}`}>
                        <div className="p-4 bg-black/20 border-t border-white/5 flex flex-col gap-3">
                          {/* List Filled Slots */}
                          {daySlots.map(([time, slotData]) => (
                            <div key={time} className="flex gap-4 items-stretch cursor-pointer hover:opacity-90 active:scale-[0.98] transition-all" onClick={() => openSlotModal(day, time, slotData)}>
                              <div className="flex flex-col items-end justify-start min-w-[70px] pt-1">
                                <span className="font-bold text-white/90 text-sm">{time.split(' ')[0]}</span>
                                <span className="text-[10px] text-white/50 tracking-wider">{time.split(' ')[1]}</span>
                              </div>
                              <div className="flex-1">
                                {renderCellContent(slotData, false)}
                              </div>
                            </div>
                          ))}
                          
                          {/* Unfilled slots adding interface */}
                          {daySlots.length === 0 && (
                            <div className="text-center p-4 text-white/40 text-sm italic">
                              No classes on this day.
                            </div>
                          )}
                          
                          <div className="pt-2 mt-2 border-t border-white/10">
                            <button
                              onClick={(e) => { e.stopPropagation(); openSlotModal(day, TIMES[0], null); }}
                              className="w-full py-2.5 flex items-center justify-center gap-2 text-sm text-white/60 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-colors border-dashed"
                            >
                              <Plus size={16} /> Add Class
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Hidden Desktop Table for Reliable PNG Captures */}
              <div className="absolute top-[-9999px] left-[-9999px]">
                {renderDesktopTable({ ref: hiddenTableRef }, true)}
              </div>
            </>
          ) : (
            <div className="glass-card rounded-2xl p-6 min-h-[400px] flex flex-col items-center justify-center text-white/50">
              <p>No data to display.</p>
            </div>
          )}
        </div>
      </main>

      <Footer />

      {/* Editor Modal */}
      {isModalOpen && currentEditSlot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="glass-card bg-[#09090b]/90 rounded-2xl p-6 w-full max-w-md border border-white/10 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>
            
            <h3 className="text-xl font-bold text-white mb-1">Edit Timetable Slot</h3>
            <p className="text-sm text-white/50 mb-6">{currentEditSlot.day} at {currentEditSlot.time}</p>

            <div className="space-y-4">
              <div className="md:hidden">
                {/* On mobile, allow changing the time itself when 'adding a class' from empty day */}
                <label className="block text-xs font-medium text-white/70 mb-1">Time Slot</label>
                <select 
                  className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-white outline-none focus:border-rose-500/50"
                  value={currentEditSlot.time}
                  onChange={(e) => setCurrentEditSlot({ ...currentEditSlot, time: e.target.value })}
                >
                  {TIMES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-white/70 mb-1">Type</label>
                <select 
                  className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-white outline-none focus:border-rose-500/50"
                  value={modalFormData.type}
                  onChange={(e) => setModalFormData({ ...modalFormData, type: e.target.value })}
                >
                  <option value="Lecture">Lecture</option>
                  <option value="Practical">Practical / Lab</option>
                  <option value="Tutorial">Tutorial</option>
                  <option value="Event">Event / Other</option>
                </select>
              </div>
              
              <div>
                <label className="block text-xs font-medium text-white/70 mb-1">Lecture Code (Optional)</label>
                <input 
                  type="text" 
                  placeholder="e.g. UPH013P"
                  className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-white outline-none focus:border-rose-500/50"
                  value={modalFormData.code}
                  onChange={(e) => setModalFormData({ ...modalFormData, code: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-white/70 mb-1">Name</label>
                <input 
                  type="text" 
                  autoFocus
                  placeholder="e.g. PHYSICS"
                  className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-white outline-none focus:border-rose-500/50"
                  value={modalFormData.name}
                  onChange={(e) => setModalFormData({ ...modalFormData, name: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-white/70 mb-1">Location</label>
                <input 
                  type="text" 
                  placeholder="e.g. G312 LAB1"
                  className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-white outline-none focus:border-rose-500/50"
                  value={modalFormData.location}
                  onChange={(e) => setModalFormData({ ...modalFormData, location: e.target.value })}
                />
              </div>
            </div>

            <div className="flex items-center justify-between gap-4 mt-8">
               <button 
                  onClick={deleteSlot}
                  className="flex items-center gap-2 px-4 py-2 text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors font-medium text-sm"
                >
                  <Trash2 size={16} /> Remove
                </button>
              
              <div className="flex gap-2">
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-white/70 hover:bg-white/10 rounded-lg transition-colors text-sm font-medium"
                >
                  Cancel
                </button>
                <button 
                  onClick={saveSlot}
                  disabled={!modalFormData.name}
                  className="px-4 py-2 bg-white text-black font-semibold rounded-lg hover:bg-white/90 transition-all shadow-lg active:scale-95 disabled:opacity-50 text-sm"
                >
                  Save
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
