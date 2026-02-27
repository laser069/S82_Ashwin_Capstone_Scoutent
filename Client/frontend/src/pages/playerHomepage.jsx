import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Footer from "../components/footer";
import UploadModal from "../components/UploadModal";

const cardVariants = {
  hidden: { opacity: 0, y: 60 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.2 + i * 0.15, duration: 0.6, ease: "easeOut" },
  }),
};

export default function PlayerHomePage() {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [userName, setUserName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const name = localStorage.getItem("userName") || "Athlete";
    setUserName(name);
  }, []);

  const features = [
    {
      id: "upload",
      number: "01",
      title: "Upload\nVideo",
      subtitle: "Showcase your skills",
      description:
        "Drop your best footage — match highlights, training clips, skill showcases. Let your game do the talking.",
      accent: "#CEFF00",
      textAccent: "text-black",
      bgAccent: "bg-[#CEFF00]",
      action: () => setIsUploadModalOpen(true),
      cta: "Upload Now",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" className="w-10 h-10" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
        </svg>
      ),
    },
    {
      id: "messages",
      number: "02",
      title: "Messages",
      subtitle: "Connect with scouts",
      description:
        "Direct lines to scouts and recruiters. Get discovered and have real conversations about your future.",
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
      id: "scoutpoint",
      number: "03",
      title: "Scout\nPoint",
      subtitle: "Track your rating",
      description:
        "Your personal scouting score — built from views, engagements, and scout activity on your profile.",
      accent: "#CEFF00",
      textAccent: "text-black",
      bgAccent: "bg-[#CEFF00]",
      action: () => navigate("/scoutpoint"),
      cta: "View Score",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" className="w-10 h-10" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
        </svg>
      ),
    },
    {
      id: "browse",
      number: "04",
      title: "Browse\nVideos",
      subtitle: "Watch & discover",
      description:
        "Explore highlight reels from players across all sports — including your own uploads. See what scouts are watching.",
      accent: "#ffffff",
      textAccent: "text-black",
      bgAccent: "bg-white",
      action: () => navigate("/feed"),
      cta: "Watch Now",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" className="w-10 h-10" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 010 1.972l-11.54 6.347a1.125 1.125 0 01-1.667-.986V5.653z" />
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
        <div className="text-white text-3xl font-black tracking-tighter italic cursor-pointer"
          onClick={() => navigate("/")}>
          SCOUT<span className="text-[#CEFF00]">ENT</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#CEFF00] flex items-center justify-center">
            <span className="text-black font-black text-sm">
              {userName.charAt(0).toUpperCase() || "A"}
            </span>
          </div>
          <span className="text-gray-300 text-sm font-medium hidden sm:block">{userName}</span>
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
            Player Dashboard
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
                {userName.split(" ")[0] || "Athlete"}
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
            Your stage. Your story. Upload your highlights, connect with scouts,
            and track your rising profile score.
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
                {/* Card border glow effect on hover */}
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

      {/* Upload Modal */}
      <UploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
      />

      <Footer />
    </div>
  );
}