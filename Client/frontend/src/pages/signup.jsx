import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { GoogleLogin } from '@react-oauth/google';
import { motion } from "framer-motion";
import axios from "../utils/axiosInstance";
import Footer from "../components/footer";


export default function SignUpPage() {
  const navigate = useNavigate();
  const [role, setRole] = useState("");
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/auth/register", { ...formData, role });

      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-black text-white font-sans">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="flex-grow flex flex-col items-center justify-center px-4 py-12 relative z-10"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-black to-black opacity-50 z-[-1]" />

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl md:text-6xl font-extrabold tracking-tight text-center mb-10 text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400"
        >
          Create Your Account
        </motion.h1>

        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="flex flex-col gap-5 w-full max-w-md bg-white/5 p-8 rounded-2xl border border-white/10 backdrop-blur-sm shadow-2xl"
        >
          <div className="space-y-4">
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-5 py-4 rounded-xl bg-black/60 border border-white/20 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all duration-200"
            />
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-5 py-4 rounded-xl bg-black/60 border border-white/20 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all duration-200"
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-5 py-4 rounded-xl bg-black/60 border border-white/20 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all duration-200"
            />
          </div>

          <div className="grid grid-cols-2 gap-4 mt-2">
            <motion.button
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setRole("player")}
              className={`py-3 rounded-xl font-bold text-sm tracking-wide transition-all duration-300 border ${role === "player"
                ? "bg-white text-black border-white shadow-lg shadow-white/10"
                : "bg-transparent text-gray-400 border-white/20 hover:border-white/50 hover:text-white"
                }`}
            >
              PLAYER
            </motion.button>
            <motion.button
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setRole("scout")}
              className={`py-3 rounded-xl font-bold text-sm tracking-wide transition-all duration-300 border ${role === "scout"
                ? "bg-white text-black border-white shadow-lg shadow-white/10"
                : "bg-transparent text-gray-400 border-white/20 hover:border-white/50 hover:text-white"
                }`}
            >
              SCOUT
            </motion.button>
          </div>

          <motion.button
            whileHover={{ scale: 1.02, backgroundColor: "#e5e5e5" }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="w-full bg-white text-black font-extrabold text-lg py-4 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 mt-4"
          >
            SIGN UP
          </motion.button>

          <div className="flex items-center justify-center mt-4 w-full">
            <GoogleLogin
              onSuccess={async (credentialResponse) => {
                try {
                  const res = await axios.post("/auth/google", {
                    token: credentialResponse.credential,
                    role: role || 'player' // Pass selected role if any
                  });
                  localStorage.setItem("token", res.data.token);
                  alert("Google Signup Successful");
                  if (res.data.user.role === "scout") {
                    navigate("/scouthomepage");
                  } else {
                    navigate("/playerhomepage");
                  }
                } catch (err) {
                  console.log(err);
                  alert("Google Signup Failed");
                }
              }}
              onError={() => {
                console.log('Signup Failed');
                alert("Google Signup Failed");
              }}
            />
          </div>
        </motion.form>
      </motion.div>
      <Footer />
    </div>
  );
}