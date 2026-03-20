import { useEffect, useState } from "react";
import { useSearchParams, useLocation, Link } from "react-router-dom";
import { ArrowLeft, Loader2, CodeXml } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BackgroundElements from "@/components/BackgroundElements";

export default function ResultViewer() {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const type = searchParams.get("type"); // schedule or freeslots
  const batch = searchParams.get("batch");

  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        if (type === "schedule" && batch) {
          const res = await fetch(`/api/v1/timetable/schedule/${encodeURIComponent(batch)}`);
          if (res.ok) {
            const data = await res.json();
            setResult(data);
          } else {
            setResult({ error: "Failed to fetch schedule data" });
          }
        } else if (type === "freeslots") {
          const batches = location.state?.batches || [];
          if (batches.length > 0) {
            // Assume POST request
            const res = await fetch(`/api/v1/timetable/freeslots`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ batches })
            });
            if (res.ok) {
              const data = await res.json();
              setResult(data);
            } else {
              setResult({ error: "Failed to fetch free slots", submitted_batches: batches });
            }
          } else {
            setResult({ error: "No batches provided for free slots." });
          }
        } else {
          setResult({ error: "Invalid type specified." });
        }
      } catch (err) {
        setResult({ error: "API connection failed.", details: err.message, payload: type === "freeslots" ? location.state?.batches : batch });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [type, batch, location.state]);

  return (
    <div className="min-h-screen flex flex-col relative text-foreground w-full">
      <BackgroundElements />
      <Navbar />

      <main className="flex-1 w-full max-w-7xl mx-auto px-6 pt-32 pb-16 flex flex-col">
        <div className="mb-8">
          <Link to="/" className="inline-flex items-center gap-2 text-white/50 hover:text-white transition-colors">
            <ArrowLeft size={16} />
            <span>Back to Dashboard</span>
          </Link>
          <h1 className="text-3xl font-bold text-white mt-6 mb-2">
            {type === "schedule" ? `Schedule for ${batch}` : type === "freeslots" ? "Common Free Slots" : "Results"}
          </h1>
          <p className="text-white/50">
            Raw JSON response handler (Will be converted to Grid view later)
          </p>
        </div>

        <div className="glass-card rounded-2xl p-6 min-h-[400px] flex flex-col">
          {loading ? (
            <div className="flex flex-col items-center justify-center flex-1 text-white/50 gap-4">
              <Loader2 size={32} className="animate-spin text-rose-500" />
              <p>Fetching data from API...</p>
            </div>
          ) : (
            <div className="flex-1 flex flex-col relative">
              <div className="flex items-center gap-2 mb-4 text-white/40 uppercase tracking-widest text-xs font-bold border-b border-white/10 pb-4">
                <CodeXml size={16} />
                JSON Paylod
              </div>
              <pre className="text-sm font-mono text-white/80 overflow-auto bg-black/20 p-4 rounded-lg flex-1 border border-white/5">
                {JSON.stringify(result, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
