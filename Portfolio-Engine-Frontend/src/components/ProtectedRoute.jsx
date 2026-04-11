import { useState, useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import API from "../services/api";

const ProtectedRoute = ({ children }) => {
  const [isAuthorized, setIsAuthorized] = useState(null); // null = pending, true = ok, false = fail
  const location = useLocation();

  useEffect(() => {
    const verifyAccess = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setIsAuthorized(false);
        return;
      }

      try {
        // 🛡️ Optional: Call a "verify" endpoint if your backend has one
        // Otherwise, we do a client-side check of the token's existence
        // If the token was malformed, the API interceptor would throw an error here
        await API.get("/auth/verify"); 
        setIsAuthorized(true);
      } catch (error) {
        console.error("Authorization sync failed. Purging session.");
        localStorage.removeItem("token");
        localStorage.removeItem("admin");
        setIsAuthorized(false);
      }
    };

    verifyAccess();
  }, []);

  // --- 🌌 CINEMATIC AUTHORIZATION SPINNER ---
  if (isAuthorized === null) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center bg-[#020617]">
        <div className="relative flex items-center justify-center">
          {/* Outer Pulsing Ring */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
            className="h-20 w-20 rounded-full border-t-2 border-b-2 border-cyan-500/30"
          />
          {/* Inner Fast Ring */}
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
            className="absolute h-12 w-12 rounded-full border-r-2 border-l-2 border-cyan-400"
          />
          {/* Center Glow */}
          <div className="absolute h-2 w-2 rounded-full bg-white shadow-[0_0_15px_#fff]" />
        </div>
        
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-8 text-[10px] font-black uppercase tracking-[0.5em] text-cyan-400/60"
        >
          Verifying Identity Tunnel
        </motion.p>
      </div>
    );
  }

  // --- 🚪 REDIRECT IF UNAUTHORIZED ---
  if (!isAuthorized) {
    // We save the location they were trying to go to, so we can redirect back after login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // --- ✅ ACCESS GRANTED ---
  return children;
};

export default ProtectedRoute;