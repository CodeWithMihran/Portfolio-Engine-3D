import { useState } from "react";

const Navbar = () => {
  const [active, setActive] = useState("");

  const navLinks = [
    { id: "about", title: "About" },
    { id: "projects", title: "Projects" },
    { id: "skills", title: "Skills" },
    { id: "contact", title: "Contact" },
  ];

  return (
    <nav className="fixed top-0 w-full z-50 bg-black/40 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        
        {/* Logo */}
        <h1 className="text-white text-xl font-bold cursor-pointer">
          Mihran.dev
        </h1>

        {/* Links */}
        <ul className="flex gap-8 text-gray-300">
          {navLinks.map((link) => (
            <li
              key={link.id}
              className={`cursor-pointer hover:text-white ${
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
      </div>
    </nav>
  );
};

export default Navbar;