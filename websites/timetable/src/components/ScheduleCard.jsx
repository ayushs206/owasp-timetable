import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, ChevronDown, Check, Loader2 } from "lucide-react";

export default function ScheduleCard() {
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBatch, setSelectedBatch] = useState("");
  const [search, setSearch] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedType, setSelectedType] = useState("All");
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
      navigate(`/result?type=schedule&batch=${encodeURIComponent(selectedBatch)}`);
    }
  };

  return (
    <div className="glass-card rounded-2xl p-6 md:p-8 flex flex-col relative overflow-hidden group hover:border-white/20 transition-all">
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-rose-500/20 rounded-full blur-3xl group-hover:bg-rose-500/30 transition-all pointer-events-none" />

      <div className="flex items-center gap-4 mb-6 relative z-10">
        <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-rose-500 shadow-inner">
          <Calendar size={24} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Schedule</h2>
          <p className="text-sm text-white/50">2025-26 Even Sem</p>
        </div>
      </div>

      <div className="space-y-4 mb-8 relative z-10 flex-1">
        {loading ? (
          <div className="flex items-center gap-3 text-white/50 h-[42px] px-4 glass rounded-lg">
            <Loader2 size={16} className="animate-spin" />
            <span className="text-sm">Loading batches...</span>
          </div>
        ) : (
          <>
            {/* <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-white/70">Filter by Type</label>
              <div className="flex flex-wrap gap-2">
                {types.map(t => (
                  <button
                    key={t}
                    onClick={() => setSelectedType(t)}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${selectedType === t ? "bg-rose-500/20 text-rose-300 border border-rose-500/30" : "bg-white/5 text-white/60 border border-white/10 hover:bg-white/10"
                      }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div> */}

            <div className="flex flex-col gap-2 relative group/input pt-2">
              <label className="text-sm font-medium text-white/70">Select your batch</label>
              <div className="flex items-center gap-2 glass px-4 py-2.5 rounded-lg border-white/10 focus-within:border-rose-500/50 focus-within:ring-2 focus-within:ring-rose-500/20 transition-all">
                <input
                  type="text"
                  placeholder="Search batch (e.g. CO15)"
                  className="bg-transparent border-none outline-none text-white w-full placeholder:text-white/30 text-sm"
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setIsDropdownOpen(true);
                  }}
                  onFocus={() => setIsDropdownOpen(Boolean(search.trim()))}
                />
                <ChevronDown size={16} className="text-white/40" />
              </div>

              {search && isDropdownOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 max-h-48 overflow-y-auto glass border-white/10 rounded-lg p-1 z-20 shadow-xl backdrop-blur-2xl">
                  {filteredBatches.length > 0 ? (
                    filteredBatches.map((batch) => (
                      <button
                        key={batch}
                        onClick={() => {
                          setSelectedBatch(batch);
                          setSearch(batch);
                          setIsDropdownOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2 rounded-md text-sm transition-all flex items-center justify-between
                          ${selectedBatch === batch ? 'bg-rose-500/20 text-rose-300' : 'text-white/70 hover:bg-white/10 hover:text-white'}
                        `}
                      >
                        <span>{batch}</span>
                        {selectedBatch === batch && <Check size={14} />}
                      </button>
                    ))
                  ) : (
                    <div className="p-3 text-sm text-white/40 text-center">No batches found</div>
                  )}
                </div>
              )}
            </div>
          </>
        )}
      </div>

      <button
        onClick={handleSelect}
        disabled={!selectedBatch}
        className="w-full relative z-10 py-3 px-4 bg-white text-black font-semibold rounded-lg hover:bg-white/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-[0_0_15px_rgba(255,255,255,0.1)] hover:shadow-[0_0_20px_rgba(255,255,255,0.2)] active:scale-[0.98]"
      >
        View Schedule
      </button>
    </div>
  );
}
