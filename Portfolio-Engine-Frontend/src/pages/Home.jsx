import { useEffect, useState, useMemo } from "react";
import HeroCanvas from "../canvas/HeroCanvas";
import Navbar from "../components/Navbar";
import Achievements from "../sections/Achievements";
import About from "../sections/About";
import Certificates from "../sections/Certificates";
import Contact from "../sections/Contact";
import Education from "../sections/Education";
import Experience from "../sections/Experience";
import Projects from "../sections/Projects";
import Skills from "../sections/Skills";
import API from "../services/api";
import { motion, AnimatePresence } from "framer-motion";

const emptyProfile = {
  fullName: "Mihran Sohail",
  title: "Full Stack Developer",
  bio: "",
  tagline: "",
  theme: {
    primaryColor: "#67e8f9",
    backgroundColor: "#050816",
    ambientLightIntensity: 0.7,
  },
  sectionVisibility: {
    hero: true,
    about: true,
    projects: true,
    skills: true,
    experience: true,
    education: true,
    certificates: true,
    achievements: true,
    contact: true,
  },
};

const Home = () => {
  const [profile, setProfile] = useState(emptyProfile);
  const [skills, setSkills] = useState([]);
  const [projects, setProjects] = useState([]);
  const [experiences, setExperiences] = useState([]);
  const [educations, setEducations] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadHomeData = async () => {
      try {
        const endpoints = [
          "/profile", "/skills", "/projects", "/experiences", 
          "/education", "/certificates", "/achievements"
        ];
        
        const results = await Promise.allSettled(endpoints.map(url => API.get(url)));

        // Handle Profile specially to merge theme and visibility
        if (results[0].status === "fulfilled") {
          const data = results[0].value.data;
          setProfile(prev => ({
            ...prev,
            ...data,
            theme: { ...prev.theme, ...data.theme },
            sectionVisibility: { ...prev.sectionVisibility, ...data.sectionVisibility }
          }));
        }

        if (results[1].status === "fulfilled") setSkills(results[1].value.data || []);
        if (results[2].status === "fulfilled") setProjects(results[2].value.data || []);
        if (results[3].status === "fulfilled") setExperiences(results[3].value.data || []);
        if (results[4].status === "fulfilled") setEducations(results[4].value.data || []);
        if (results[5].status === "fulfilled") setCertificates(results[5].value.data || []);
        if (results[6].status === "fulfilled") setAchievements(results[6].value.data || []);

      } catch (err) {
        console.error("Universe Loading Error:", err);
      } finally {
        setLoading(false);
      }
    };

    loadHomeData();
  }, []);

  // 🌍 Navigation Logic based on visibility and data existence
  const navSections = useMemo(() => {
    const vis = profile.sectionVisibility || {};
    return [
      vis.about && { id: "about", title: "About" },
      vis.projects && projects.length > 0 && { id: "projects", title: "Projects" },
      vis.skills && skills.length > 0 && { id: "skills", title: "Skills" },
      vis.experience && experiences.length > 0 && { id: "experience", title: "Experience" },
      vis.education && educations.length > 0 && { id: "education", title: "Education" },
      vis.contact && { id: "contact", title: "Contact" },
    ].filter(Boolean);
  }, [profile, projects, skills, experiences, educations]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#050816]">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
          className="h-12 w-12 rounded-full border-t-2 border-cyan-400"
        />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-slate-950 text-white selection:bg-cyan-400 selection:text-black">
      
      {/* 🌌 FULL SCREEN 3D BACKGROUND (The Planet) */}
      <div className="fixed inset-0 z-0 h-screen w-full">
        <HeroCanvas profile={profile} projects={projects} />
      </div>

      <Navbar profile={profile} sections={navSections} />

      {/* 🚀 SCROLLABLE CONTENT LAYER */}
      <main className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
        
        {/* HERO SECTION - Now an overlay over the 3D scene */}
        <section id="hero" className="flex min-h-screen flex-col justify-center pt-20">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="pointer-events-none max-w-3xl space-y-6"
          >
             {/* Content is handled primarily by HeroCanvas overlay, 
                 but we can add extra "floating" detail here if needed */}
          </motion.div>
        </section>

        {/* DATA SECTIONS - Each wrapped in a "Space Glass" container for readability */}
        <div className="space-y-32 pb-32">
          
          <AnimatePresence>
            {profile.sectionVisibility.about && (
              <section id="about" className="scroll-mt-32 backdrop-blur-sm rounded-[3rem] border border-white/5 bg-black/20 p-8 lg:p-12">
                <About profile={profile} />
              </section>
            )}

            {profile.sectionVisibility.projects && projects.length > 0 && (
              <section id="projects" className="scroll-mt-32">
                <Projects projects={projects} loading={loading} />
              </section>
            )}

            {profile.sectionVisibility.skills && skills.length > 0 && (
              <section id="skills" className="scroll-mt-32">
                <Skills skills={skills} loading={loading} />
              </section>
            )}

            {profile.sectionVisibility.experience && experiences.length > 0 && (
              <section id="experience" className="scroll-mt-32">
                <Experience experiences={experiences} loading={loading} />
              </section>
            )}

            {profile.sectionVisibility.education && educations.length > 0 && (
              <section id="education" className="scroll-mt-32">
                <Education educations={educations} loading={loading} />
              </section>
            )}

            {(certificates.length > 0 || achievements.length > 0) && (
              <div className="grid gap-12 lg:grid-cols-2">
                 {profile.sectionVisibility.certificates && (
                    <Certificates certificates={certificates} />
                 )}
                 {profile.sectionVisibility.achievements && (
                    <Achievements achievements={achievements} />
                 )}
              </div>
            )}

            {profile.sectionVisibility.contact && (
              <section id="contact" className="scroll-mt-32 pb-20">
                <Contact profile={profile} />
              </section>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* 🎞️ CINEMATIC FOOTER */}
      <footer className="relative z-10 border-t border-white/5 bg-black/40 py-10 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-sm text-white/30 tracking-widest uppercase">
            © 2026 {profile.fullName} • System Stable
          </p>
          <div className="flex gap-6">
            {Object.entries(profile.socialLinks).map(([key, url]) => (
              url && (
                <a key={key} href={url} target="_blank" rel="noreferrer" className="text-white/40 hover:text-cyan-400 transition-colors capitalize text-xs font-bold tracking-widest">
                  {key}
                </a>
              )
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;