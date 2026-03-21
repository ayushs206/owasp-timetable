import { useEffect, useState, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, ChevronDown, Check, Loader2 } from "lucide-react";

export default function ScheduleCard() {
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBatch, setSelectedBatch] = useState("");
  const [search, setSearch] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [selectedType] = useState("All");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBatches = async () => {
      try {
        const response = await fetch("/api/v1/timetable/batches");
        if (response.ok) {
          const data = await response.json();
          const batchArray = Array.isArray(data) ? data : (data?.data || data?.batches || []);
          setBatches(batchArray);
        } else {
          setBatches([]);
        }
      } catch {
        setBatches([]);
      } finally {
        setLoading(false);
      }
    };
    fetchBatches();
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const types = useMemo(() => {
    if (!Array.isArray(batches)) return ["All"];
    const extractedTypes = batches.map(b => typeof b === 'string' ? b.replace(/[0-9]/g, '') : null).filter(Boolean);
    return ["All", ...Array.from(new Set(extractedTypes))];
  }, [batches]);

  const filteredBatches = Array.isArray(batches) ? batches.filter((b) => {
    if (typeof b !== 'string') return false;
    const matchSearch = b.toLowerCase().includes(search.toLowerCase());
    const matchType = selectedType === "All" || b.startsWith(selectedType);
    return matchSearch && matchType;
  }) : [];

  const handleSelect = () => {
    if (selectedBatch) {
      navigate(`/schedule?batch=${encodeURIComponent(selectedBatch)}`);
    }
  };

  return (
    <div className="glass-card rounded-2xl p-6 md:p-8 flex flex-col relative overflow-visible group hover:border-white/20 transition-all">
      <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/10 rounded-full blur-3xl transition-all pointer-events-none" />

      <div className="flex items-center gap-4 mb-6 relative z-10">
        <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-rose-500 shadow-inner">
          <Calendar size={24} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Schedule</h2>
          <p className="text-sm text-white/50">2025-26 Even Sem</p>
        </div>
      </div>

      <div className="space-y-4 mb-8 relative z-20 flex-1">
        {loading ? (
          <div className="flex items-center gap-3 text-white/50 h-[42px] px-4 glass rounded-lg">
            <Loader2 size={16} className="animate-spin" />
            <span className="text-sm">Loading batches...</span>
          </div>
        ) : (
          <div className="flex flex-col gap-2 relative group/input pt-2" ref={dropdownRef}>
            <label className="text-sm font-medium text-white/70">Select your batch</label>
            <div 
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border transition-all cursor-text ${isDropdownOpen ? 'border-rose-500/50 ring-2 ring-rose-500/20 bg-black/40' : 'glass border-white/10'}`}
              onClick={() => setIsDropdownOpen(true)}
            >
              <input
                type="text"
                placeholder="Search batch (e.g. 1A11)"
                className="bg-transparent border-none outline-none text-white w-full placeholder:text-white/30 text-sm"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setIsDropdownOpen(true);
                }}
                onFocus={() => setIsDropdownOpen(true)}
              />
              <ChevronDown size={16} className={`text-white/40 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </div>

            {isDropdownOpen && (
              <div className="absolute top-[110%] left-0 right-0 max-h-56 overflow-y-auto bg-black/80 border border-white/20 rounded-xl p-2 z-[100] shadow-[0_10px_40px_rgba(0,0,0,0.8)] backdrop-blur-2xl">
                {filteredBatches.length > 0 ? (
                  filteredBatches.map((batch) => (
                    <button
                      key={batch}
                      onClick={() => {
                        setSelectedBatch(batch);
                        setSearch(batch);
                        setIsDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2.5 rounded-lg text-sm transition-all flex items-center justify-between mb-0.5
                        ${selectedBatch === batch ? 'bg-rose-500/20 text-rose-300' : 'text-white/70 hover:bg-white/10 hover:text-white'}
                      `}
                    >
                      <span className="font-medium">{batch}</span>
                      {selectedBatch === batch && <Check size={16} />}
                    </button>
                  ))
                ) : (
                  <div className="p-4 text-sm text-white/40 text-center flex flex-col items-center gap-2">
                    <span className="opacity-50 text-xl block">📭</span>
                    No batches match '{search}'
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      <button
        onClick={handleSelect}
        disabled={!selectedBatch}
        className="w-full relative z-10 py-3 px-4 bg-white text-black font-bold rounded-xl hover:bg-white/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_25px_rgba(255,255,255,0.25)] active:scale-[0.98]"
      >
        View Schedule
      </button>
    </div>
  );
}
