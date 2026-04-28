import { useEffect, useState } from 'react';
import { Briefcase, Code2, Contact, GraduationCap, Home, Menu, Trophy, X } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const NAV_ITEMS = [
  { label: 'Home', href: '#', icon: Home },
  { label: 'Projects', href: '#projects', icon: Briefcase },
  { label: 'Skills', href: '#skills', icon: Code2 },
  { label: 'Journey', href: '#journey', icon: GraduationCap },
  { label: 'Credentials', href: '#credentials', icon: Trophy },
  { label: 'Contact', href: '#contact', icon: Contact },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-[1000] flex justify-center p-6">
      <nav
        className={cn(
          'hidden items-center gap-2 rounded-full border px-3 py-2 transition-all duration-500 md:flex',
          scrolled
            ? 'border-slate-700 bg-slate-900/80 shadow-2xl shadow-blue-500/10 backdrop-blur-xl'
            : 'border-transparent bg-transparent'
        )}
      >
        {NAV_ITEMS.map((item) => (
          <a
            key={item.label}
            href={item.href}
            className="group relative rounded-full px-4 py-2 text-sm font-medium text-slate-400 transition-all hover:bg-white/5 hover:text-white"
          >
            {item.label}
            <span className="absolute bottom-1 left-1/2 h-[2px] w-0 -translate-x-1/2 rounded-full bg-blue-500 transition-all group-hover:w-4" />
          </a>
        ))}
      </nav>

      <div className="flex w-full items-center justify-between md:hidden">
        <div className="text-xl font-bold tracking-tighter text-white">MMS.</div>
        <button
          onClick={() => setMobileMenuOpen((value) => !value)}
          className="rounded-2xl border border-slate-800 bg-slate-900/80 p-3 text-white backdrop-blur-md"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {mobileMenuOpen && (
        <div className="absolute top-24 left-6 right-6 flex flex-col gap-4 rounded-3xl border border-slate-800 bg-slate-900/95 p-6 shadow-2xl backdrop-blur-2xl md:hidden">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.label}
              href={item.href}
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-4 rounded-2xl border border-white/5 bg-white/5 p-4 text-slate-300 transition-all active:bg-blue-500/20 active:text-white"
            >
              <item.icon size={20} className="text-blue-400" />
              <span className="text-xs font-semibold uppercase tracking-widest">{item.label}</span>
            </a>
          ))}
        </div>
      )}
    </header>
  );
}
