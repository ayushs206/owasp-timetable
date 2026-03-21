import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Users, X, Info, ChevronDown, Check, Loader2 } from "lucide-react";

export default function FreeSlotsCard() {
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBatches, setSelectedBatches] = useState([]);
  const [search, setSearch] = useState("");
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
    }
  };

  const handleRemove = (batch) => {
    setSelectedBatches(selectedBatches.filter((b) => b !== batch));
  };

  const handleSubmit = () => {
    if (selectedBatches.length >= 2 && selectedBatches.length <= 9) {
      navigate("/result?type=freeslots", { state: { batches: selectedBatches } });
    }
  };

  const isValidCount = selectedBatches.length >= 2 && selectedBatches.length <= 9;

  return (
    <div className="glass-card rounded-2xl p-6 md:p-8 flex flex-col relative overflow-hidden group hover:border-white/20 transition-all">
      {/* Decorative gradient orb */}
      <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-fuchsia-500/20 rounded-full blur-3xl group-hover:bg-fuchsia-500/30 transition-all pointer-events-none" />

      <div className="flex items-center gap-4 mb-6 relative z-10">
        <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-fuchsia-500 shadow-inner">
          <Users size={24} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Free Slots</h2>
          <p className="text-sm text-white/50">Find common free time</p>
        </div>
      </div>

      <div className="space-y-4 mb-8 relative z-10 flex-1 flex flex-col">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-white/70">Select 2-9 batches</label>
          <span className={`text-xs px-2 py-0.5 rounded-full ${isValidCount ? 'bg-fuchsia-500/20 text-fuchsia-300' : 'bg-white/10 text-white/50'}`}>
            {selectedBatches.length}/9
          </span>
        </div>

        {loading ? (
          <div className="flex items-center gap-3 text-white/50 h-[42px] px-4 glass rounded-lg">
            <Loader2 size={16} className="animate-spin" />
            <span className="text-sm">Loading batches...</span>
          </div>
        ) : (
          <div className="flex flex-col gap-2 relative group/input">
            <div className="flex items-center gap-2 glass px-4 py-2.5 rounded-lg border-white/10 focus-within:border-fuchsia-500/50 focus-within:ring-2 focus-within:ring-fuchsia-500/20 transition-all">
              <input
                type="text"
                placeholder="Search batch (e.g. 1A11)"
                className="bg-transparent border-none outline-none text-white w-full placeholder:text-white/30 text-sm"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                disabled={selectedBatches.length >= 9}
              />
              <ChevronDown size={16} className="text-white/40" />
            </div>

            {search && (
              <div className="absolute top-full left-0 right-0 mt-2 max-h-48 overflow-y-auto glass border-white/10 rounded-lg p-1 z-20 shadow-xl backdrop-blur-2xl">
                {filteredBatches.length > 0 ? (
                  filteredBatches.map((batch) => (
                    <button
                      key={batch}
                      onClick={() => handleAdd(batch)}
                      className="w-full text-left px-3 py-2 rounded-md text-sm transition-all flex items-center justify-between text-white/70 hover:bg-white/10 hover:text-white"
                    >
                      <span>{batch}</span>
                      <Check size={14} className="opacity-0" />
                    </button>
                  ))
                ) : (
                  <div className="p-3 text-sm text-white/40 text-center">No batches found</div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Selected Badges */}
        <div className="flex flex-wrap gap-2 mt-2">
          {selectedBatches.map((batch) => (
            <div key={batch} className="flex items-center gap-1 bg-white/10 border border-white/10 rounded-full pl-3 pr-1 py-1 text-sm text-white/90">
              <span className="font-medium">{batch}</span>
              <button
                onClick={() => handleRemove(batch)}
                className="p-1 hover:bg-white/10 rounded-full transition-colors text-white/50 hover:text-white"
              >
                <X size={14} />
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
        className="w-full relative z-10 py-3 px-4 bg-white text-black font-semibold rounded-lg hover:bg-white/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-[0_0_15px_rgba(255,255,255,0.1)] hover:shadow-[0_0_20px_rgba(255,255,255,0.2)] active:scale-[0.98]"
      >
        Find Free Slots
      </button>
    </div>
  );
}
