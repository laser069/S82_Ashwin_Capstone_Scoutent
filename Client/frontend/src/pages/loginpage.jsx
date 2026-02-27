import { useState } from "react";
import { GoogleLogin } from '@react-oauth/google';
import { motion } from "framer-motion";
import axios from "../utils/axiosInstance";
import { useNavigate } from "react-router-dom";
import playerhomepage from "./playerHomepage";
import Footer from "../components/footer";


export default function LoginPage() {
  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/auth/login", formData);
      alert("Login successful");
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userName", res.data.user?.name || "");
      localStorage.setItem("userId", res.data.user?.id || "");
      localStorage.setItem("userRole", res.data.user?.role || "");

      // Redirect based on role:
      if (res.data.user.role === "scout") {
        navigate("/scouthomepage");
      } else if (res.data.user.role === "player") {
        navigate("/playerhomepage");
      } else {
        navigate("/"); // fallback
      }
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="flex flex-col items-center justify-center min-h-screen bg-black px-4"
    >
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-white text-5xl md:text-7xl font-extrabold tracking-wide text-center mb-8"
      >
        Login to Your Account
      </motion.h1>

      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="flex flex-col gap-4 w-72"
      >
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="px-4 py-3 rounded-md bg-black border border-white text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          className="px-4 py-3 rounded-md bg-black border border-white text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white"
        />

        <motion.button
          whileHover={{ scale: 1.05, backgroundColor: "#d4d4d4" }}
          whileTap={{ scale: 0.95 }}
          type="submit"
          className="w-full bg-white text-black transition duration-300 rounded-md py-3 text-lg font-semibold shadow-md mt-4"
        >
          Login

        </motion.button>

        <div className="flex items-center justify-center mt-4">
          <GoogleLogin
            onSuccess={async (credentialResponse) => {
              try {
                const res = await axios.post("/auth/google", {
                  token: credentialResponse.credential,
                });
                localStorage.setItem("token", res.data.token);
                localStorage.setItem("userName", res.data.user?.name || "");
                localStorage.setItem("userId", res.data.user?.id || "");
                localStorage.setItem("userRole", res.data.user?.role || "");
                alert("Google Login Successful");
                if (res.data.user.role === "scout") {
                  navigate("/scouthomepage");
                } else {
                  navigate("/playerhomepage");
                }
              } catch (err) {
                console.error("Google Login Error:", err);
                console.log("Error Details:", err.response?.data);
                alert(`Google Login Failed: ${err.response?.data?.message || err.message}`);
              }
            }}
            onError={() => {
              console.log('Login Failed');
              alert("Google Login Failed");
            }}
          />
        </div>

      </motion.form>
      <div className="absolute bottom-0 w-full z-10">
        <Footer />
      </div>
    </motion.div>

  );
}