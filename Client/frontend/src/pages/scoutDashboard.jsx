import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Footer from "../components/footer";

const cardVariants = {
    hidden: { opacity: 0, y: 60 },
    visible: (i) => ({
        opacity: 1,
        y: 0,
        transition: { delay: 0.2 + i * 0.15, duration: 0.6, ease: "easeOut" },
    }),
};

export default function ScoutDashboardPage() {
    const [userName, setUserName] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const name = localStorage.getItem("userName") || "Scout";
        setUserName(name);
    }, []);

    const features = [
        {
            id: "discover",
            number: "01",
            title: "Discover\nPlayers",
            subtitle: "Scout the next talent",
            description:
                "Browse highlight reels and performance videos from players across all sports. Filter by sport, position, age, and location to find your perfect prospect.",
            accent: "#CEFF00",
            textAccent: "text-black",
            bgAccent: "bg-[#CEFF00]",
            action: () => navigate("/feed"),
            cta: "Browse Feed",
            icon: (
                <svg viewBox="0 0 24 24" fill="none" className="w-10 h-10" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" />
                </svg>
            ),
        },
        {
            id: "messages",
            number: "02",
            title: "Messages",
            subtitle: "Connect with players",
            description:
                "Reach out directly to prospects you're interested in. Build real conversations and relationships — move fast on the talent you spot.",
            accent: "#ffffff",
            textAccent: "text-black",
            bgAccent: "bg-white",
            action: () => navigate("/messages"),
            cta: "Open Inbox",
            icon: (
                <svg viewBox="0 0 24 24" fill="none" className="w-10 h-10" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
                </svg>
            ),
        },
        {
            id: "shortlist",
            number: "03",
            title: "My\nShortlist",
            subtitle: "Your curated prospects",
            description:
                "Every player you bookmark from the feed is saved here. Review, compare, and manage your shortlisted talent pool all in one place.",
            accent: "#CEFF00",
            textAccent: "text-black",
            bgAccent: "bg-[#CEFF00]",
            action: () => navigate("/feed"),
            cta: "View Shortlist",
            icon: (
                <svg viewBox="0 0 24 24" fill="none" className="w-10 h-10" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
                </svg>
            ),
        },
        {
            id: "scoutpoint",
            number: "04",
            title: "Scout\nPoint",
            subtitle: "Player analytics hub",
            description:
                "Deep-dive into ScoutPoint ratings — an algorithmic score built from views, engagement, and scout activity. See who's trending before everyone else.",
            accent: "#ffffff",
            textAccent: "text-black",
            bgAccent: "bg-white",
            action: () => navigate("/scoutpoint"),
            cta: "View Rankings",
            icon: (
                <svg viewBox="0 0 24 24" fill="none" className="w-10 h-10" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                </svg>
            ),
        },
    ];

    return (
        <div className="min-h-screen bg-black text-white font-sans selection:bg-[#CEFF00] selection:text-black overflow-x-hidden">
            {/* ── TOP NAV BAR ── */}
            <motion.nav
                initial={{ y: -80, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.7 }}
                className="fixed top-0 left-0 w-full z-50 flex items-center justify-between px-8 py-4 bg-black/90 backdrop-blur-md border-b border-white/10"
            >
                <div
                    className="text-white text-3xl font-black tracking-tighter italic cursor-pointer"
                    onClick={() => navigate("/")}
                >
                    SCOUT<span className="text-[#CEFF00]">ENT</span>
                </div>
                <div className="flex items-center gap-4">
                    {/* Feed quick link */}
                    <button
                        onClick={() => navigate("/feed")}
                        className="text-gray-400 hover:text-[#CEFF00] transition-colors text-sm font-bold uppercase tracking-widest"
                    >
                        Feed
                    </button>
                    {/* Avatar */}
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#CEFF00] flex items-center justify-center">
                            <span className="text-black font-black text-sm">
                                {userName.charAt(0).toUpperCase() || "S"}
                            </span>
                        </div>
                        <span className="text-gray-300 text-sm font-medium hidden sm:block">{userName}</span>
                    </div>
                    {/* Logout */}
                    <button
                        onClick={() => {
                            localStorage.removeItem("token");
                            localStorage.removeItem("userId");
                            localStorage.removeItem("userName");
                            localStorage.removeItem("userRole");
                            navigate("/login");
                        }}
                        className="text-gray-600 hover:text-red-400 transition-colors text-sm font-bold uppercase tracking-widest"
                    >
                        Logout
                    </button>
                </div>
            </motion.nav>

            {/* ── HERO WELCOME SECTION ── */}
            <div className="relative pt-24 pb-16 px-6 md:px-12 overflow-hidden">
                {/* Background accent lines */}
                <div className="absolute top-0 right-0 w-[60%] h-full pointer-events-none">
                    <div className="absolute top-20 right-[-10%] w-[500px] h-[500px] border border-white/5 rounded-full" />
                    <div className="absolute top-10 right-[5%] w-[300px] h-[300px] border border-[#CEFF00]/10 rounded-full" />
                </div>

                <div className="max-w-7xl mx-auto">
                    {/* Eyebrow label */}
                    <motion.p
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                        className="text-[#CEFF00] text-sm font-black uppercase tracking-[0.3em] mb-4"
                    >
                        Scout Dashboard
                    </motion.p>

                    {/* Welcome heading */}
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.1 }}
                    >
                        <h1 className="text-6xl md:text-8xl lg:text-9xl font-black italic uppercase tracking-tighter leading-[0.9] mb-6">
                            Hey,{" "}
                            <span className="text-[#CEFF00] inline-block">
                                {userName.split(" ")[0] || "Scout"}
                            </span>
                            <span className="text-white">.</span>
                        </h1>
                    </motion.div>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        className="text-gray-400 text-lg md:text-xl max-w-lg leading-relaxed"
                    >
                        Your scouting command centre. Discover rising talent, shortlist your best prospects, and connect with players directly.
                    </motion.p>

                    {/* Decorative separator */}
                    <motion.div
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
                        style={{ originX: 0 }}
                        className="mt-10 h-[2px] w-32 bg-[#CEFF00]"
                    />
                </div>
            </div>

            {/* ── FEATURE CARDS SECTION ── */}
            <div className="px-6 md:px-12 pb-32">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {features.map((feat, i) => (
                            <motion.div
                                key={feat.id}
                                custom={i}
                                variants={cardVariants}
                                initial="hidden"
                                animate="visible"
                                whileHover="hover"
                                className="group relative cursor-pointer overflow-hidden"
                                onClick={feat.action}
                            >
                                {/* Card border glow on hover */}
                                <motion.div
                                    className="absolute inset-0 rounded-none border border-white/10 group-hover:border-[#CEFF00]/60 transition-colors duration-500"
                                    style={{ zIndex: 1 }}
                                />

                                {/* Background fill on hover */}
                                <motion.div
                                    className="absolute bottom-0 left-0 w-full bg-[#CEFF00]/5 group-hover:bg-[#CEFF00]/10 transition-all duration-500"
                                    style={{ height: "100%", zIndex: 0 }}
                                />

                                <div className="relative z-10 p-8 md:p-10 flex flex-col h-full min-h-[400px]">
                                    {/* Number + Icon row */}
                                    <div className="flex items-start justify-between mb-auto">
                                        <span className="text-7xl font-black text-white/5 group-hover:text-[#CEFF00]/20 transition-colors duration-500 leading-none select-none">
                                            {feat.number}
                                        </span>
                                        <span className="text-white/40 group-hover:text-[#CEFF00] transition-colors duration-300">
                                            {feat.icon}
                                        </span>
                                    </div>

                                    {/* Top accent line */}
                                    <div className="h-[2px] w-12 bg-white/20 group-hover:w-full group-hover:bg-[#CEFF00] transition-all duration-500 mb-6" />

                                    {/* Title */}
                                    <h2 className="text-4xl md:text-5xl font-black italic uppercase tracking-tighter leading-[1] mb-3 whitespace-pre-line">
                                        {feat.title}
                                    </h2>

                                    {/* Subtitle */}
                                    <p className="text-[#CEFF00] text-xs font-black uppercase tracking-[0.2em] mb-4">
                                        {feat.subtitle}
                                    </p>

                                    {/* Description */}
                                    <p className="text-gray-500 text-sm leading-relaxed mb-8 group-hover:text-gray-300 transition-colors duration-300">
                                        {feat.description}
                                    </p>

                                    {/* CTA */}
                                    <div className="mt-auto">
                                        <motion.span
                                            whileHover={{ scale: 1.03 }}
                                            whileTap={{ scale: 0.97 }}
                                            className={`inline-block px-6 py-3 ${feat.bgAccent} ${feat.textAccent} font-black uppercase tracking-wider text-sm skew-x-[-8deg] transition-all duration-300 group-hover:shadow-[0_0_24px_rgba(206,255,0,0.4)]`}
                                        >
                                            <span className="block skew-x-[8deg]">{feat.cta} →</span>
                                        </motion.span>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}
