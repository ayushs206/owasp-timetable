import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Users, X, Info, ChevronDown, Check, Loader2 } from "lucide-react";

export default function FreeSlotsCard() {
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBatches, setSelectedBatches] = useState([]);
  const [search, setSearch] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
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

  const filteredBatches = Array.isArray(batches)
    ? batches.filter((b) => {
        if (typeof b !== "string") return false;
        const matchSearch = b.toLowerCase().includes(search.toLowerCase());
        const isNotSelected = !selectedBatches.includes(b);
        return matchSearch && isNotSelected;
      })
    : [];

  const handleAdd = (batch) => {
    if (selectedBatches.length < 9) {
      setSelectedBatches([...selectedBatches, batch]);
      setSearch("");
      setIsDropdownOpen(false);
    }
  };

  const handleRemove = (batch) => {
    setSelectedBatches(selectedBatches.filter((b) => b !== batch));
  };

  const handleSubmit = () => {
    if (selectedBatches.length >= 2 && selectedBatches.length <= 9) {
      navigate("/freeslots", { state: { batches: selectedBatches } });
    }
  };

  const isValidCount = selectedBatches.length >= 2 && selectedBatches.length <= 9;

  return (
    <div className="glass-card rounded-2xl p-6 md:p-8 flex flex-col relative overflow-visible group hover:border-white/20 transition-all">
      {/* Decorative gradient orb */}
      <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-fuchsia-500/10 rounded-full blur-3xl transition-all pointer-events-none" />

      <div className="flex items-center gap-4 mb-6 relative z-10">
        <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-fuchsia-500 shadow-inner">
          <Users size={24} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Free Slots</h2>
          <p className="text-sm text-white/50">Find common free time</p>
        </div>
      </div>

      <div className="space-y-4 mb-8 relative z-20 flex-1 flex flex-col">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-white/70">Select 2-9 batches</label>
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${isValidCount ? 'bg-fuchsia-500/20 text-fuchsia-300 ring-1 ring-fuchsia-500/30' : 'bg-white/10 text-white/50'}`}>
            {selectedBatches.length}/9
          </span>
        </div>

        {loading ? (
          <div className="flex items-center gap-3 text-white/50 h-[42px] px-4 glass rounded-lg">
            <Loader2 size={16} className="animate-spin" />
            <span className="text-sm">Loading batches...</span>
          </div>
        ) : (
          <div className="flex flex-col gap-2 relative group/input" ref={dropdownRef}>
            <div 
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border transition-all cursor-text ${isDropdownOpen ? 'border-fuchsia-500/50 ring-2 ring-fuchsia-500/20 bg-black/40' : 'glass border-white/10'}`}
              onClick={() => setIsDropdownOpen(true)}
            >
              <input
                type="text"
                placeholder={selectedBatches.length >= 9 ? "Max batches selected" : "Search batch (e.g. 1A11)"}
                className="bg-transparent border-none outline-none text-white w-full placeholder:text-white/30 text-sm"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setIsDropdownOpen(true);
                }}
                onFocus={() => setIsDropdownOpen(true)}
                disabled={selectedBatches.length >= 9}
              />
              <ChevronDown size={16} className={`text-white/40 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </div>

            {isDropdownOpen && (
              <div className="absolute top-[110%] left-0 right-0 max-h-56 overflow-y-auto bg-black/80 border border-white/20 rounded-xl p-2 z-[100] shadow-[0_10px_40px_rgba(0,0,0,0.8)] backdrop-blur-2xl">
                {filteredBatches.length > 0 ? (
                  filteredBatches.map((batch) => (
                    <button
                      key={batch}
                      onClick={() => handleAdd(batch)}
                      className="w-full text-left px-3 py-2.5 rounded-lg text-sm transition-all flex items-center justify-between text-white/70 hover:bg-white/10 hover:text-white mb-0.5"
                    >
                      <span className="font-medium">{batch}</span>
                      <Check size={16} className="opacity-0" />
                    </button>
                  ))
                ) : (
                  <div className="p-4 text-sm text-white/40 text-center flex flex-col items-center gap-2">
                    <span className="opacity-50 text-xl block">📭</span>
                    No available batches match '{search}'
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Selected Badges */}
        <div className="flex flex-wrap gap-2 mt-2">
          {selectedBatches.map((batch) => (
            <div key={batch} className="flex items-center gap-1 bg-white/10 border border-white/10 rounded-full pl-3 pr-1 py-1 text-sm text-white/90 shadow-sm backdrop-blur-md animate-in fade-in zoom-in duration-200">
              <span className="font-medium">{batch}</span>
              <button
                onClick={() => handleRemove(batch)}
                className="p-1 hover:bg-white/20 rounded-full transition-colors text-white/60 hover:text-white group"
              >
                <X size={14} className="group-hover:scale-110 transition-transform" />
              </button>
            </div>
          ))}
          {selectedBatches.length === 0 && (
            <div className="flex items-center gap-2 text-white/30 text-sm italic py-2">
              <Info size={14} /> Add batches to find common free slots.
            </div>
          )}
        </div>
      </div>

      <button
        onClick={handleSubmit}
        disabled={!isValidCount}
        className="w-full relative z-10 py-3 px-4 bg-white text-black font-bold rounded-xl hover:bg-white/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_25px_rgba(255,255,255,0.25)] active:scale-[0.98]"
      >
        Find Free Slots
      </button>
    </div>
  );
}
