import { Github, Instagram } from "lucide-react";
import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4">
      <div className="max-w-7xl mx-auto glass rounded-2xl px-6 py-3 flex items-center justify-between">
        <Link to={import.meta.env.VITE_OFFICIAL_SITE || "/"} className="flex items-center gap-2 group">
          <img
            src="/OwaspLogo.png"
            alt="OWASP Logo"
            className="h-8 w-auto group-hover:scale-105 transition-transform"
          />
        </Link>
        <div className="flex items-center gap-4">
          <a
            href={import.meta.env.VITE_GITHUB || "https://github.com/OWASP-STUDENT-CHAPTER/"}
            target="_blank"
            rel="noreferrer"
            className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-all"
          >
            <Github size={20} />
          </a>
          <a
            href={import.meta.env.VITE_INSTAGRM || "https://www.instagram.com/owasp_tiet/"}
            target="_blank"
            rel="noreferrer"
            className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-all"
          >
            <Instagram size={20} />
          </a>
        </div>
      </div>
    </nav>
  );
}
