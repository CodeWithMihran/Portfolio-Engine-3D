import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation } from "react-router-dom";

const defaultLinks = [
  { id: "about", title: "About" },
  { id: "projects", title: "Projects" },
  { id: "skills", title: "Skills" },
  { id: "experience", title: "Experience" },
  { id: "contact", title: "Contact" },
];

const Navbar = ({ profile, sections = defaultLinks }) => {
  const [active, setActive] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const location = useLocation();

  // Check scroll position for styling and auth state
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (id, title) => {
    setActive(title);
    setIsMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      const offset = 80; // Account for navbar height
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  return (
    <nav
      className={`fixed left-0 top-0 z-[100] w-full transition-all duration-500 ${
        scrolled 
          ? "py-3 bg-[#050816]/40 backdrop-blur-2xl border-b border-white/5" 
          : "py-6 bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 lg:px-8">
        
        {/* 🚀 Brand Logo */}
        <button
          className="group flex items-center gap-4"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          <div className="relative flex h-12 w-12 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-600 text-xl font-black text-slate-950 shadow-[0_0_20px_rgba(34,211,238,0.3)] transition-transform group-hover:scale-110 active:scale-95">
            {profile?.fullName?.charAt(0) || "M"}
            <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
          </div>
          <div className="hidden text-left sm:block">
            <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-cyan-400/60">System</p>
            <p className="text-lg font-bold tracking-tighter text-white">
              {profile?.fullName?.split(" ")[0] || "Mihran"}<span className="text-cyan-400">.</span>dev
            </p>
          </div>
        </button>

        {/* 💻 Desktop Navigation */}
        <ul className="hidden items-center gap-2 rounded-full border border-white/5 bg-white/[0.03] p-1.5 backdrop-blur-md md:flex">
          {sections.map((link) => (
            <li key={link.id}>
              <button
                onClick={() => handleNavClick(link.id, link.title)}
                className={`relative rounded-full px-5 py-2 text-xs font-bold uppercase tracking-widest transition-all ${
                  active === link.title 
                    ? "text-cyan-400" 
                    : "text-white/50 hover:text-white hover:bg-white/5"
                }`}
              >
                {link.title}
                {active === link.title && (
                  <motion.div
                    layoutId="nav-active"
                    className="absolute inset-0 z-[-1] rounded-full bg-cyan-400/10 border border-cyan-400/20"
                    transition={{ type: "spring", duration: 0.6 }}
                  />
                )}
              </button>
            </li>
          ))}
        </ul>

        {/* 🔐 Auth Button & Mobile Toggle */}
        <div className="flex items-center gap-4">
          <Link
            to={isLoggedIn ? "/admin" : "/login"}
            className="hidden rounded-xl border border-white/10 bg-white/5 px-5 py-2.5 text-[10px] font-black uppercase tracking-[0.2em] text-white transition-all hover:border-cyan-400/50 hover:bg-cyan-400/10 hover:text-cyan-400 sm:block"
          >
            {isLoggedIn ? "Dashboard" : "Admin"}
          </Link>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="flex h-10 w-10 flex-col items-center justify-center gap-1.5 rounded-xl border border-white/10 bg-white/5 md:hidden"
          >
            <span className={`h-0.5 w-5 bg-white transition-all ${isMobileMenuOpen ? "translate-y-2 rotate-45" : ""}`} />
            <span className={`h-0.5 w-5 bg-white transition-all ${isMobileMenuOpen ? "opacity-0" : ""}`} />
            <span className={`h-0.5 w-5 bg-white transition-all ${isMobileMenuOpen ? "-translate-y-2 -rotate-45" : ""}`} />
          </button>
        </div>
      </div>

      {/* 📱 Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t border-white/5 bg-[#050816]/95 backdrop-blur-2xl md:hidden"
          >
            <ul className="flex flex-col gap-2 p-6">
              {sections.map((link) => (
                <li key={link.id}>
                  <button
                    onClick={() => handleNavClick(link.id, link.title)}
                    className="w-full rounded-xl p-4 text-left text-sm font-bold uppercase tracking-widest text-white/60 hover:bg-white/5 hover:text-cyan-400"
                  >
                    {link.title}
                  </button>
                </li>
              ))}
              <li className="mt-4 pt-4 border-t border-white/5">
                <Link
                  to="/login"
                  className="block w-full rounded-xl bg-cyan-500 p-4 text-center text-xs font-black uppercase tracking-widest text-slate-950"
                >
                  System Access
                </Link>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;