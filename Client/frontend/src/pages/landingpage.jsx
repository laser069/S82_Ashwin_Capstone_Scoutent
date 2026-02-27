import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/navbar";
import Footer from "../components/footer";

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-screen bg-black text-white font-sans selection:bg-[#CEFF00] selection:text-black">
      <Navbar />

      {/* --- HERO SECTION --- */}
      <div className="relative h-screen w-full overflow-hidden">
        {/* Immersive Video Background */}
        <video
          src="/videos/scoutent-landing.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="absolute top-0 left-0 w-full h-full object-cover"
        />

        {/* Gradient Overlay - Top (for Navbar) and Bottom (for Content) */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-transparent to-black/90" />

        {/* Hero Content - Bottom Aligned */}
        <div className="absolute bottom-0 left-0 w-full px-6 md:px-12 pb-24 z-10 flex flex-col items-start max-w-7xl mx-auto pointer-events-none">
          {/* pointer-events-none on container to let clicks pass through empty spaces if needed, but safe to keep buttons interactive via pointer-events-auto */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="pointer-events-auto"
          >
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black italic uppercase tracking-tighter leading-none mb-6">
              Unleash <br />
              <span className="text-[#CEFF00]">Potential</span>
            </h1>
            <p className="max-w-xl text-lg md:text-xl font-medium text-gray-200 mb-8 tracking-wide">
              The world's biggest stage for upcoming talent. Upload your skills, catch the eye of top scouts, and turn your passion into a career.
            </p>

            <div className="flex flex-wrap gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/signup")}
                className="px-8 py-4 bg-[#CEFF00] text-black text-lg font-black uppercase tracking-wider skew-x-[-12deg] hover:bg-white transition-colors"
              >
                <span className="block skew-x-[12deg]">Start Your Journey</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 border-2 border-white text-white text-lg font-black uppercase tracking-wider skew-x-[-12deg] hover:bg-white hover:text-black transition-colors"
              >
                <span className="block skew-x-[12deg]">Watch Highlights</span>
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* --- FEATURES / HYPE SECTION --- */}
      <div className="bg-black py-24 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">

            {/* Feature 1 */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="group cursor-pointer"
            >
              <div className="h-1 w-20 bg-[#CEFF00] mb-6 transition-all duration-300 group-hover:w-full" />
              <h3 className="text-4xl font-black uppercase italic tracking-tight mb-4">01. Create</h3>
              <p className="text-gray-400 text-lg leading-relaxed">
                Build your professional athlete profile. Showcase your stats, achievements, and journey.
              </p>
            </motion.div>

            {/* Feature 2 */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="group cursor-pointer"
            >
              <div className="h-1 w-20 bg-white mb-6 transition-all duration-300 group-hover:w-full group-hover:bg-[#CEFF00]" />
              <h3 className="text-4xl font-black uppercase italic tracking-tight mb-4">02. Upload</h3>
              <p className="text-gray-400 text-lg leading-relaxed">
                Post your best game footage and training clips. Let your performance speak for itself.
              </p>
            </motion.div>

            {/* Feature 3 */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="group cursor-pointer"
            >
              <div className="h-1 w-20 bg-white mb-6 transition-all duration-300 group-hover:w-full group-hover:bg-[#CEFF00]" />
              <h3 className="text-4xl font-black uppercase italic tracking-tight mb-4">03. Get Scouted</h3>
              <p className="text-gray-400 text-lg leading-relaxed">
                Connect directly with scouts and clubs looking for the next big star. Your future starts here.
              </p>
            </motion.div>

          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
