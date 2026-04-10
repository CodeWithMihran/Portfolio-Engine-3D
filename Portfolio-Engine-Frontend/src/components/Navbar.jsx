import { useState } from "react";

const Navbar = ({ profile }) => {
  const [active, setActive] = useState("");

  const navLinks = [
    { id: "about", title: "About" },
    { id: "projects", title: "Projects" },
    { id: "skills", title: "Skills" },
    { id: "contact", title: "Contact" },
  ];

  return (
    <nav className="fixed left-0 top-0 z-50 w-full border-b border-white/8 bg-[#050816]/70 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
        <button
          className="group flex items-center gap-3"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-300 via-sky-400 to-emerald-300 text-base font-black text-slate-950 shadow-[0_0_30px_rgba(34,211,238,0.3)] transition group-hover:scale-105">
            M
          </div>
          <div className="text-left">
            <p className="text-sm uppercase tracking-[0.3em] text-white/40">Portfolio</p>
            <p className="text-lg font-semibold text-white">
              {profile?.fullName || "Mihran.dev"}
            </p>
          </div>
        </button>

        <ul className="hidden gap-8 text-sm text-white/70 md:flex">
          {navLinks.map((link) => (
            <li
              key={link.id}
              className={`cursor-pointer transition hover:text-white ${
                active === link.title ? "text-white" : ""
              }`}
              onClick={() => {
                setActive(link.title);
                document
                  .getElementById(link.id)
                  ?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              {link.title}
            </li>
          ))}
        </ul>

        <a
          href="/login"
          className="rounded-full border border-white/15 bg-white/5 px-5 py-2 text-sm font-medium text-white transition hover:bg-white/10"
        >
          Admin
        </a>
      </div>
    </nav>
  );
};

export default Navbar;
