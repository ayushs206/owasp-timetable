import { Github, Instagram } from "lucide-react";
import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-4 md:px-6 py-4">
      <div className="max-w-7xl mx-auto rounded-2xl px-5 md:px-6 py-3 flex items-center justify-between border border-white/15 bg-zinc-950/85 backdrop-blur-xl supports-[backdrop-filter]:bg-zinc-950/70 shadow-[0_8px_30px_rgba(0,0,0,0.45)] md:border-white/10 md:bg-white/5 md:backdrop-blur-md md:supports-[backdrop-filter]:bg-white/5 md:shadow-[0_4px_20px_rgba(0,0,0,0.28)]">
        <Link to={import.meta.env.VITE_OFFICIAL_SITE || "/"} className="flex items-center gap-2 group">
          <img
            src="/OwaspLogo.png"
            alt="OWASP Logo"
            className="h-8 w-auto transition-transform duration-200 group-hover:scale-105"
          />
        </Link>
        <div className="flex items-center gap-4">
          <a
            href={import.meta.env.VITE_GITHUB || "https://github.com/OWASP-STUDENT-CHAPTER/"}
            target="_blank"
            rel="noreferrer"
            className="rounded-full p-2 text-white/85 hover:text-white hover:bg-white/15 transition-colors md:text-white/70 md:hover:bg-white/10"
          >
            <Github size={20} />
          </a>
          <a
            href={import.meta.env.VITE_INSTAGRM || "https://www.instagram.com/owasp_tiet/"}
            target="_blank"
            rel="noreferrer"
            className="rounded-full p-2 text-white/85 hover:text-white hover:bg-white/15 transition-colors md:text-white/70 md:hover:bg-white/10"
          >
            <Instagram size={20} />
          </a>
        </div>
      </div>
    </nav>
  );
}
