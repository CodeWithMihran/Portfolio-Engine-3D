import { useEffect, useState } from "react";
import HeroCanvas from "../canvas/HeroCanvas";
import Navbar from "../components/Navbar";
import About from "../sections/About";
import Contact from "../sections/Contact";
import Projects from "../sections/Projects";
import Skills from "../sections/Skills";
import API from "../services/api";

const fallbackProfile = {
  fullName: "Md Mihran Sohail",
  title: "Full Stack Developer",
  bio: "I build cinematic web experiences with real data, polished interfaces, and immersive 3D interactions.",
  about:
    "This portfolio is designed as a dynamic space where the visuals feel alive and the content stays easy to manage through a secure admin panel.",
  availability: "Open to opportunities",
  location: "India",
  socialLinks: {
    github: "",
    linkedin: "",
    twitter: "",
    website: "",
  },
};

const Home = () => {
  const [profile, setProfile] = useState(fallbackProfile);
  const [skills, setSkills] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadHomeData = async () => {
      try {
        const [profileRes, skillsRes, projectsRes] = await Promise.allSettled([
          API.get("/profile"),
          API.get("/skills"),
          API.get("/projects"),
        ]);

        if (profileRes.status === "fulfilled" && profileRes.value.data) {
          setProfile((prev) => ({ ...prev, ...profileRes.value.data }));
        }

        if (skillsRes.status === "fulfilled") {
          setSkills(skillsRes.value.data || []);
        }

        if (projectsRes.status === "fulfilled") {
          setProjects(projectsRes.value.data || []);
        }
      } finally {
        setLoading(false);
      }
    };

    loadHomeData();
  }, []);

  return (
    <div className="min-h-screen bg-[#050816] text-white selection:bg-cyan-300 selection:text-slate-950">
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute left-[-10%] top-[-8%] h-72 w-72 rounded-full bg-cyan-500/20 blur-3xl" />
        <div className="absolute right-[-10%] top-[14%] h-96 w-96 rounded-full bg-fuchsia-500/10 blur-3xl" />
        <div className="absolute bottom-[-10%] left-[20%] h-80 w-80 rounded-full bg-emerald-400/10 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_30%),linear-gradient(180deg,rgba(255,255,255,0.03),transparent_30%)]" />
      </div>

      <Navbar profile={profile} />

      <main className="mx-auto max-w-7xl px-6 pb-20 pt-24 lg:px-8">
        <section className="grid min-h-[88vh] items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="space-y-8">
            <div className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-cyan-200 shadow-[0_0_30px_rgba(34,211,238,0.1)] backdrop-blur">
              Dynamic 3D MERN portfolio
            </div>

            <div className="space-y-5">
              <p className="text-sm uppercase tracking-[0.4em] text-white/45">
                {profile.availability || "Open to opportunities"}
              </p>
              <h1 className="max-w-3xl text-5xl font-black leading-[0.95] tracking-tight sm:text-6xl lg:text-7xl">
                {profile.fullName}
                <span className="mt-3 block bg-gradient-to-r from-cyan-300 via-sky-400 to-emerald-300 bg-clip-text text-transparent">
                  {profile.title}
                </span>
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-white/70 sm:text-xl">
                {profile.bio}
              </p>
            </div>

            <div className="flex flex-wrap gap-4">
              <a
                href="#projects"
                className="rounded-full bg-cyan-400 px-6 py-3 font-semibold text-slate-950 transition hover:-translate-y-0.5 hover:bg-cyan-300"
              >
                Explore projects
              </a>
              <a
                href="#contact"
                className="rounded-full border border-white/15 bg-white/5 px-6 py-3 font-semibold text-white transition hover:-translate-y-0.5 hover:bg-white/10"
              >
                Let&apos;s build something
              </a>
            </div>

            <div className="grid max-w-2xl gap-4 rounded-[2rem] border border-white/10 bg-white/5 p-6 backdrop-blur md:grid-cols-3">
              <div>
                <p className="text-3xl font-bold text-cyan-300">MERN</p>
                <p className="mt-2 text-sm text-white/55">Dynamic content managed through a full-stack architecture.</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-emerald-300">3D</p>
                <p className="mt-2 text-sm text-white/55">Immersive visual storytelling built with React Three Fiber.</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-fuchsia-300">Admin</p>
                <p className="mt-2 text-sm text-white/55">Portfolio updates without touching code every time.</p>
              </div>
            </div>
          </div>

          <HeroCanvas profile={profile} />
        </section>

        <About profile={profile} />
        <Projects projects={projects} loading={loading} />
        <Skills skills={skills} loading={loading} />
        <Contact profile={profile} />
      </main>
    </div>
  );
};

export default Home;
