"use client";
import { Github, Instagram } from "lucide-react";

export default function Background() {
    const fadeUpVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: (i) => ({
            opacity: 1,
            y: 0,
            transition: {
                duration: 1,
                delay: 0.5 + i * 0.2,
                ease: [0.25, 0.4, 0.25, 1],
            },
        }),
    };

    return (
        <div className="relative min-h-dvh w-full overflow-hidden bg-[#030303]">
            <div
                className="absolute inset-0 bg-gradient-to-br from-indigo-500/[0.05] via-transparent to-rose-500/[0.05] blur-3xl" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.06),transparent_35%),radial-gradient(circle_at_80%_80%,rgba(255,255,255,0.04),transparent_32%)]" />

            <header className="absolute inset-x-0 top-0 z-20 px-4 pt-4 sm:px-6">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: [0.25, 0.4, 0.25, 1] }}
                    className="mx-auto max-w-5xl rounded-full border border-white/15 bg-white/[0.03] backdrop-blur-xl shadow-[0_8px_30px_rgba(0,0,0,0.35)] px-4 py-3 md:px-6"
                >
                    <div className="hidden sm:flex items-center justify-between">
                        <img
                            src="/OwaspLogo.png"
                            alt="OWASP Logo"
                            className="h-8 w-auto object-contain"
                        />

                        <div className="flex items-center gap-2">
                            <a
                                href="https://github.com"
                                target="_blank"
                                rel="noreferrer"
                                aria-label="GitHub"
                                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-black/20 text-white/80 transition hover:text-white hover:border-white/35"
                            >
                                <Github className="h-4 w-4" />
                            </a>
                            <a
                                href="https://instagram.com"
                                target="_blank"
                                rel="noreferrer"
                                aria-label="Instagram"
                                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-black/20 text-white/80 transition hover:text-white hover:border-white/35"
                            >
                                <Instagram className="h-4 w-4" />
                            </a>
                        </div>
                    </div>

                    <div className="sm:hidden flex items-center justify-center">
                        <img
                            src="/OwaspLogo.png"
                            alt="OWASP Logo"
                            className="h-8 w-auto object-contain"
                        />
                    </div>
                </motion.div>
            </header>

            <main className="relative z-10 flex min-h-dvh items-center justify-center px-4 sm:px-6 pt-24 pb-20">
                <div className="w-full max-w-2xl">
                    <motion.div
                        custom={0}
                        variants={fadeUpVariants}
                        initial="hidden"
                        animate="visible"
                        className="rounded-3xl border border-white/15 bg-white/[0.05] backdrop-blur-2xl p-6 sm:p-8 md:p-10 shadow-[0_25px_65px_rgba(0,0,0,0.45)]"
                    >
                        <motion.h1
                            custom={1}
                            variants={fadeUpVariants}
                            initial="hidden"
                            animate="visible"
                            className="text-center text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight text-white"
                        >
                            Heading Option
                        </motion.h1>

                        <motion.form
                            custom={2}
                            variants={fadeUpVariants}
                            initial="hidden"
                            animate="visible"
                            onSubmit={(e) => e.preventDefault()}
                            className="mt-6 flex flex-col gap-3 sm:flex-row"
                        >
                            <label htmlFor="search" className="sr-only">Search</label>
                            <input
                                id="search"
                                type="text"
                                placeholder={"Search batch..."}
                                list="available-batches"
                                className="h-12 w-full rounded-xl border border-white/20 bg-black/25 px-4 text-white placeholder:text-white/50 outline-none ring-0 transition focus:border-indigo-300/70"
                            />

                            <button
                                type="submit"
                                className="h-12 rounded-xl bg-gradient-to-r from-indigo-400 to-rose-400 px-6 font-medium text-[#111] transition hover:brightness-110"
                            >
                                Submit
                            </button>
                        </motion.form>
                    </motion.div>
                </div>
            </main>

            <footer className="absolute inset-x-0 bottom-6 z-20 px-4 sm:px-6">
                <motion.div
                    custom={3}
                    variants={fadeUpVariants}
                    initial="hidden"
                    animate="visible"
                    className="mx-auto max-w-3xl text-center"
                >
                    <p className="mt-2 text-xs sm:text-sm text-white/50 leading-relaxed">
                        Designed by <a href="https://github.com/AkkshitaAA" target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:text-indigo-300">Akkshita</a> and <a href="https://github.com/raggarwal25" target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:text-indigo-300">Rudrakshi</a>
                        <br />
                        Developed by
                        <a href="https://github.com/ayushs206" target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:text-indigo-300"> Ayush Singla</a>
                    </p>
                </motion.div>
            </footer>
            <div
                className="absolute inset-0 bg-gradient-to-t from-[#030303] via-transparent to-[#030303]/80 pointer-events-none" />
        </div>
    );
}