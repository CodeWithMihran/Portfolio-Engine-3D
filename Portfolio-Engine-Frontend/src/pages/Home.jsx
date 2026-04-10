import { useEffect, useState } from "react";
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

const emptyProfile = {
  fullName: "",
  title: "",
  bio: "",
  about: "",
  email: "",
  location: "",
  availability: "",
  socialLinks: {
    github: "",
    linkedin: "",
    twitter: "",
    instagram: "",
    website: "",
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
        const [
          profileRes,
          skillsRes,
          projectsRes,
          experiencesRes,
          educationsRes,
          certificatesRes,
          achievementsRes,
        ] = await Promise.allSettled([
          API.get("/profile"),
          API.get("/skills"),
          API.get("/projects"),
          API.get("/experiences"),
          API.get("/education"),
          API.get("/certificates"),
          API.get("/achievements"),
        ]);

        if (profileRes.status === "fulfilled" && profileRes.value.data) {
          setProfile((prev) => ({
            ...prev,
            ...profileRes.value.data,
            socialLinks: {
              ...prev.socialLinks,
              ...(profileRes.value.data.socialLinks || {}),
            },
            sectionVisibility: {
              ...prev.sectionVisibility,
              ...(profileRes.value.data.sectionVisibility || {}),
            },
          }));
        }

        if (skillsRes.status === "fulfilled") {
          setSkills(skillsRes.value.data || []);
        }

        if (projectsRes.status === "fulfilled") {
          setProjects(projectsRes.value.data || []);
        }

        if (experiencesRes.status === "fulfilled") {
          setExperiences(experiencesRes.value.data || []);
        }

        if (educationsRes.status === "fulfilled") {
          setEducations(educationsRes.value.data || []);
        }

        if (certificatesRes.status === "fulfilled") {
          setCertificates(certificatesRes.value.data || []);
        }

        if (achievementsRes.status === "fulfilled") {
          setAchievements(achievementsRes.value.data || []);
        }
      } finally {
        setLoading(false);
      }
    };

    loadHomeData();
  }, []);

  const socialLabels = {
    github: "GitHub",
    linkedin: "LinkedIn",
    twitter: "Twitter",
    instagram: "Instagram",
    website: "Website",
  };

  const socialLinks = Object.entries(profile.socialLinks || {})
    .filter(([, value]) => value && value.trim())
    .map(([key, value]) => ({
      key,
      label: socialLabels[key] || key,
      value,
    }));

  const visibility = profile.sectionVisibility || {};
  const showHero =
    visibility.hero !== false &&
    [profile.fullName, profile.title, profile.bio].some((value) => value?.trim());
  const showAbout =
    visibility.about !== false &&
    [profile.about, profile.bio, profile.location, profile.availability].some(
      (value) => value?.trim()
    );
  const showProjects = visibility.projects !== false && projects.length > 0;
  const showSkills = visibility.skills !== false && skills.length > 0;
  const showExperience =
    visibility.experience !== false && experiences.length > 0;
  const showEducation = visibility.education !== false && educations.length > 0;
  const showCertificates =
    visibility.certificates !== false && certificates.length > 0;
  const showAchievements =
    visibility.achievements !== false && achievements.length > 0;
  const showContact = visibility.contact !== false;

  const navSections = [
    showAbout ? { id: "about", title: "About" } : null,
    showProjects ? { id: "projects", title: "Projects" } : null,
    showSkills ? { id: "skills", title: "Skills" } : null,
    showExperience ? { id: "experience", title: "Experience" } : null,
    showEducation ? { id: "education", title: "Education" } : null,
    showCertificates ? { id: "certificates", title: "Certificates" } : null,
    showAchievements ? { id: "achievements", title: "Achievements" } : null,
    showContact ? { id: "contact", title: "Contact" } : null,
  ].filter(Boolean);

  return (
    <div className="min-h-screen bg-[#050816] text-white selection:bg-cyan-300 selection:text-slate-950">
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute left-[-10%] top-[-8%] h-72 w-72 rounded-full bg-cyan-500/20 blur-3xl" />
        <div className="absolute right-[-10%] top-[14%] h-96 w-96 rounded-full bg-fuchsia-500/10 blur-3xl" />
        <div className="absolute bottom-[-10%] left-[20%] h-80 w-80 rounded-full bg-emerald-400/10 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_30%),linear-gradient(180deg,rgba(255,255,255,0.03),transparent_30%)]" />
      </div>

      <Navbar profile={profile} sections={navSections} />

      <main className="mx-auto max-w-7xl px-6 pb-20 pt-24 lg:px-8">
        {showHero ? (
          <section className="grid min-h-[88vh] items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="space-y-8">
              <div className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-cyan-200 shadow-[0_0_30px_rgba(34,211,238,0.1)] backdrop-blur">
                Dynamic 3D MERN portfolio
              </div>

              <div className="space-y-5">
                {profile.availability ? (
                  <p className="text-sm uppercase tracking-[0.4em] text-white/45">
                    {profile.availability}
                  </p>
                ) : null}
                <h1 className="max-w-3xl text-5xl font-black leading-[0.95] tracking-tight sm:text-6xl lg:text-7xl">
                  {profile.fullName}
                  {profile.title ? (
                    <span className="mt-3 block bg-gradient-to-r from-cyan-300 via-sky-400 to-emerald-300 bg-clip-text text-transparent">
                      {profile.title}
                    </span>
                  ) : null}
                </h1>
                {profile.bio ? (
                  <p className="max-w-2xl text-lg leading-8 text-white/70 sm:text-xl">
                    {profile.bio}
                  </p>
                ) : null}
              </div>

              <div className="flex flex-wrap gap-4">
                {showProjects ? (
                  <a
                    href="#projects"
                    className="rounded-full bg-cyan-400 px-6 py-3 font-semibold text-slate-950 transition hover:-translate-y-0.5 hover:bg-cyan-300"
                  >
                    Explore projects
                  </a>
                ) : null}
                {showContact ? (
                  <a
                    href="#contact"
                    className="rounded-full border border-white/15 bg-white/5 px-6 py-3 font-semibold text-white transition hover:-translate-y-0.5 hover:bg-white/10"
                  >
                    Let&apos;s build something
                  </a>
                ) : null}
              </div>

              <div className="grid max-w-2xl gap-4 rounded-[2rem] border border-white/10 bg-white/5 p-6 backdrop-blur md:grid-cols-3">
                <div>
                  <p className="text-3xl font-bold text-cyan-300">MERN</p>
                  <p className="mt-2 text-sm text-white/55">
                    Dynamic content managed through a full-stack architecture.
                  </p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-emerald-300">3D</p>
                  <p className="mt-2 text-sm text-white/55">
                    Immersive visual storytelling built with React Three Fiber.
                  </p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-fuchsia-300">Admin</p>
                  <p className="mt-2 text-sm text-white/55">
                    Portfolio updates without touching code every time.
                  </p>
                </div>
              </div>
            </div>

            <HeroCanvas profile={profile} />
          </section>
        ) : null}

        {showAbout ? <About profile={profile} socialLinks={socialLinks} /> : null}
        {showProjects ? <Projects projects={projects} loading={loading} /> : null}
        {showSkills ? <Skills skills={skills} loading={loading} /> : null}
        {showExperience ? (
          <Experience experiences={experiences} loading={loading} />
        ) : null}
        {showEducation ? (
          <Education educations={educations} loading={loading} />
        ) : null}
        {showCertificates ? (
          <Certificates certificates={certificates} loading={loading} />
        ) : null}
        {showAchievements ? (
          <Achievements achievements={achievements} loading={loading} />
        ) : null}
        {showContact ? <Contact profile={profile} /> : null}
      </main>
    </div>
  );
};

export default Home;
