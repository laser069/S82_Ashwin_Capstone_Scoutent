import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const scoreCategories = [
    { label: "Video Views", value: 72, color: "#CEFF00" },
    { label: "Scout Visits", value: 58, color: "#ffffff" },
    { label: "Engagement", value: 84, color: "#CEFF00" },
    { label: "Profile Complete", value: 65, color: "#ffffff" },
];

function CircleProgress({ value, size = 120, stroke = 8, color = "#CEFF00" }) {
    const r = (size - stroke) / 2;
    const circ = 2 * Math.PI * r;
    const offset = circ - (value / 100) * circ;
    return (
        <svg width={size} height={size} className="-rotate-90">
            <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth={stroke} />
            <motion.circle
                cx={size / 2}
                cy={size / 2}
                r={r}
                fill="none"
                stroke={color}
                strokeWidth={stroke}
                strokeLinecap="butt"
                strokeDasharray={circ}
                initial={{ strokeDashoffset: circ }}
                animate={{ strokeDashoffset: offset }}
                transition={{ duration: 1.2, ease: "easeOut", delay: 0.4 }}
            />
        </svg>
    );
}

export default function ScoutPointPage() {
    const navigate = useNavigate();
    const overallScore = 72;

    return (
        <div className="min-h-screen bg-black text-white font-sans selection:bg-[#CEFF00] selection:text-black">
            {/* Nav */}
            <motion.nav
                initial={{ y: -80, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.7 }}
                className="fixed top-0 left-0 w-full z-50 flex items-center justify-between px-8 py-4 bg-black/90 backdrop-blur-md border-b border-white/10"
            >
                <div
                    className="text-white text-3xl font-black tracking-tighter italic cursor-pointer"
                    onClick={() => navigate("/playerhomepage")}
                >
                    SCOUT<span className="text-[#CEFF00]">ENT</span>
                </div>
                <button
                    onClick={() => navigate("/playerhomepage")}
                    className="flex items-center gap-2 text-gray-400 hover:text-[#CEFF00] transition-colors text-sm font-bold uppercase tracking-widest"
                >
                    <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                    </svg>
                    Dashboard
                </button>
            </motion.nav>

            <div className="pt-28 pb-20 px-6 md:px-12 max-w-5xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="mb-14"
                >
                    <p className="text-[#CEFF00] text-xs font-black uppercase tracking-[0.3em] mb-3">
                        Your Rating
                    </p>
                    <h1 className="text-6xl md:text-7xl font-black italic uppercase tracking-tighter leading-[0.9]">
                        Scout<br />Point
                    </h1>
                    <div className="h-[2px] w-20 bg-[#CEFF00] mt-6" />
                </motion.div>

                {/* Overall score hero */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.7, delay: 0.2 }}
                    className="flex flex-col md:flex-row items-center gap-12 mb-16 p-10 border border-white/10 bg-white/2 relative overflow-hidden"
                >
                    {/* Background number */}
                    <span className="absolute right-6 bottom-2 text-[10rem] font-black text-white/3 leading-none select-none pointer-events-none">
                        SP
                    </span>

                    {/* Circle */}
                    <div className="relative flex items-center justify-center shrink-0">
                        <CircleProgress value={overallScore} size={180} stroke={10} color="#CEFF00" />
                        <div className="absolute flex flex-col items-center">
                            <span className="text-5xl font-black text-[#CEFF00]">{overallScore}</span>
                            <span className="text-gray-500 text-xs font-bold uppercase tracking-widest">/ 100</span>
                        </div>
                    </div>

                    <div>
                        <p className="text-[#CEFF00] text-xs font-black uppercase tracking-[0.3em] mb-2">Overall Score</p>
                        <h2 className="text-4xl font-black italic uppercase tracking-tighter mb-4">Rising Star</h2>
                        <p className="text-gray-400 max-w-md leading-relaxed text-sm">
                            Your ScoutPoint is calculated from video engagement, scout profile visits,
                            and how complete your player profile is. Keep uploading and engaging to climb the rankings.
                        </p>
                        <div className="mt-6 inline-block px-6 py-3 bg-[#CEFF00] text-black font-black uppercase tracking-wider text-sm skew-x-[-8deg]">
                            <span className="block skew-x-[8deg]">Top 28% of Players</span>
                        </div>
                    </div>
                </motion.div>

                {/* Category breakdowns */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {scoreCategories.map((cat, i) => (
                        <motion.div
                            key={cat.label}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 + i * 0.1 }}
                            className="p-6 border border-white/10 hover:border-[#CEFF00]/40 transition-colors duration-300"
                        >
                            <div className="flex justify-between items-center mb-3">
                                <span className="text-gray-400 text-sm font-bold uppercase tracking-widest">{cat.label}</span>
                                <span className="text-white font-black text-xl">{cat.value}</span>
                            </div>
                            <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
                                <motion.div
                                    className="h-full rounded-full"
                                    style={{ backgroundColor: cat.color }}
                                    initial={{ width: 0 }}
                                    animate={{ width: `${cat.value}%` }}
                                    transition={{ duration: 1, ease: "easeOut", delay: 0.5 + i * 0.1 }}
                                />
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Coming soon note */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.9 }}
                    className="mt-12 p-6 border border-dashed border-white/10 text-center"
                >
                    <p className="text-gray-600 text-sm uppercase tracking-widest font-bold">
                        Live scoring engine — Coming Soon
                    </p>
                </motion.div>
            </div>
        </div>
    );
}
