import { Heart } from "lucide-react";

export default function Footer() {
  const contributors = [
    {
      name: "Ayush Singla",
      github: "https://github.com/ayushs206",
      avatar: "https://github.com/ayushs206.png",
    },
    // Add more if needed, user didn't specify other names, so I'll leave them room to add or just use theirs.
  ];

  return (
    <footer className="w-full py-8 mt-20 border-t border-white/5 bg-background relative z-10">
      <div className="max-w-7xl mx-auto px-6 flex flex-col items-center gap-6">
        <div className="flex items-center gap-2 text-white/60">
          <span>Made with</span>
          <Heart size={16} className="text-red-500 fill-red-500 animate-pulse" />
          <span>by</span>
        </div>
        
        <div className="flex flex-wrap justify-center gap-6">
          {contributors.map((c, i) => (
            <a
              key={i}
              href={c.github}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-3 glass px-4 py-2 rounded-full hover:bg-white/5 transition-all group"
            >
              <img
                src={c.avatar}
                alt={c.name}
                className="w-8 h-8 rounded-full border border-white/10 group-hover:scale-110 transition-transform"
              />
              <span className="text-sm font-medium text-white/80 group-hover:text-white">
                {c.name}
              </span>
            </a>
          ))}
        </div>
        
        <p className="text-xs text-white/40 mt-4">
          © {new Date().getFullYear()} OWASP Student Chapter. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
