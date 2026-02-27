import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function Navbar() {
    const navigate = useNavigate();

    return (
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.8 }}
            className="fixed top-0 left-0 w-full z-50 flex items-center justify-between px-8 py-4 bg-black/90 backdrop-blur-md shadow-lg"
        >
            {/* Logo */}
            <div
                className="text-white text-3xl font-black tracking-tighter cursor-pointer italic"
                onClick={() => navigate("/")}
            >
                SCOUT<span className="text-[#CEFF00]">ENT</span>
            </div>

            {/* Navigation Links */}
            <div className="flex items-center gap-6">
                <Link
                    to="/login"
                    className="text-white font-bold text-sm tracking-widest uppercase hover:text-[#CEFF00] transition-colors"
                >
                    Login
                </Link>
                <button
                    onClick={() => navigate("/signup")}
                    className="px-6 py-2 bg-white text-black font-black text-sm uppercase tracking-wider skew-x-[-12deg] hover:bg-[#CEFF00] transition-colors"
                >
                    <span className="block skew-x-[12deg]">Join Now</span>
                </button>
            </div>
        </motion.nav>
    );
}
