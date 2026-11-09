import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Award, Briefcase, Code2, Contact, Download, GraduationCap, Home, Menu, Sparkles, Trophy, X } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useStore } from '../store/useStore';

void motion;

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const NAV_ITEMS = [
  { label: 'Home', href: '#', icon: Home },
  { label: 'About', href: '#about', icon: Home },
  { label: 'Projects', href: '#projects', icon: Briefcase },
  { label: 'Skills', href: '#skills', icon: Code2 },
  { label: 'Experience', href: '#experience', icon: Briefcase },
  { label: 'Education', href: '#education', icon: GraduationCap },
  { label: 'Certificates', href: '#certificates', icon: Award },
  { label: 'Achievements', href: '#achievements', icon: Trophy },
  { label: 'Resume', href: '#resume', icon: Download },
  { label: 'Contact', href: '#contact', icon: Contact },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [active, setActive] = useState('Home');
  const profile = useStore((state) => state.profile);
  const visibleNavItems = useMemo(() => {
    const sectionVisibility = profile?.sectionVisibility || {};
    return NAV_ITEMS.filter((item) => {
      const sectionId = item.href.slice(1);
      if (!sectionId) return true;
      if (sectionId === 'resume') return Boolean(profile?.resume);
      return sectionVisibility[sectionId] !== false;
    });
  }, [profile]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 80);
      const sections = visibleNavItems.map((item) => item.href.slice(1)).filter(Boolean);
      for (let index = sections.length - 1; index >= 0; index -= 1) {
        const section = document.getElementById(sections[index]);
        if (section && window.scrollY >= section.offsetTop - 160) {
          const match = NAV_ITEMS.find((item) => item.href === `#${sections[index]}`);
          if (match) {
            setActive(match.label);
          }
          return;
        }
      }
      setActive('Home');
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [visibleNavItems]);

  useEffect(() => {
    if (!mobileMenuOpen) return undefined;
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') setMobileMenuOpen(false);
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [mobileMenuOpen]);

  return (
    <header className="fixed top-0 left-0 right-0 z-[1000] px-4 pt-5 sm:px-6">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between">
        <a href="#" className="hidden items-center gap-3 xl:flex">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-rose-300/25 bg-rose-500/10 text-sm font-black tracking-[0.3em] text-rose-100">
            MM
          </div>
          <div>
            <p className="text-sm font-bold text-white">{profile?.fullName || 'Md Mihran Sohail'}</p>
            <p className="text-[11px] font-mono uppercase tracking-[0.25em] text-slate-500">
              {profile?.title || 'Developer Portfolio'}
            </p>
          </div>
        </a>

        <motion.nav
          initial={{ y: -40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        className={cn(
          'hidden items-center gap-2 rounded-full border px-3 py-2 transition-all duration-500 xl:flex',
          scrolled
            ? 'border-white/10 bg-[#0e0b0f]/85 shadow-[0_22px_50px_rgba(0,0,0,0.48)] backdrop-blur-2xl'
            : 'border-transparent bg-transparent'
        )}
      >
        {visibleNavItems.map((item) => (
          <a
            key={item.label}
            href={item.href}
            onClick={() => setActive(item.label)}
            className={cn(
              'group relative rounded-full px-4 py-2 text-sm font-medium transition-all',
              active === item.label ? 'text-white' : 'text-slate-400 hover:bg-white/5 hover:text-white'
            )}
          >
            {item.label}
            <span
              className={cn(
                'absolute bottom-1 left-1/2 h-[2px] -translate-x-1/2 rounded-full bg-rose-300 transition-all',
                active === item.label ? 'w-6' : 'w-0 group-hover:w-4'
              )}
            />
          </a>
        ))}
        </motion.nav>

        <div className="flex w-full items-center justify-between xl:hidden">
          <div>
            <div className="text-xl font-black tracking-tight text-white">MMS.</div>
            <div className="text-[10px] font-mono uppercase tracking-[0.3em] text-slate-500">Portfolio</div>
          </div>
        <button
          type="button"
          aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={mobileMenuOpen}
          aria-controls="mobile-navigation"
          onClick={() => setMobileMenuOpen((value) => !value)}
          className="rounded-2xl border border-white/10 bg-slate-950/75 p-3 text-white backdrop-blur-2xl"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
      </div>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -14 }}
            id="mobile-navigation"
            aria-label="Portfolio sections"
            className="absolute top-24 left-4 right-4 flex max-h-[calc(100dvh-7rem)] flex-col gap-3 overflow-y-auto rounded-3xl border border-white/10 bg-[#0c0b0e]/95 p-4 shadow-2xl backdrop-blur-2xl xl:hidden sm:p-6"
          >
            {visibleNavItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={() => {
                  setActive(item.label);
                  setMobileMenuOpen(false);
                }}
                className="flex items-center gap-4 rounded-2xl border border-white/5 bg-white/5 p-4 text-slate-300 transition-all active:bg-rose-400/15 active:text-white"
              >
                <item.icon size={20} className="text-rose-200" />
                <span className="text-xs font-semibold uppercase tracking-widest">{item.label}</span>
              </a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
