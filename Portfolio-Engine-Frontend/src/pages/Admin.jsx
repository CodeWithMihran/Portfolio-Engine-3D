import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

const initialProjectForm = {
  title: "",
  description: "",
  shortDescription: "",
  thumbnail: "",
  githubLink: "",
  liveLink: "",
};

const initialProfileForm = {
  fullName: "",
  title: "",
  bio: "",
  about: "",
  email: "",
  phone: "",
  location: "",
  availability: "",
  tagline: "",
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

const sectionFields = [
  { key: "hero", label: "Hero" },
  { key: "about", label: "About" },
  { key: "projects", label: "Projects" },
  { key: "skills", label: "Skills" },
  { key: "experience", label: "Experience" },
  { key: "education", label: "Education" },
  { key: "certificates", label: "Certificates" },
  { key: "achievements", label: "Achievements" },
  { key: "contact", label: "Contact" },
];

const socialFields = [
  { key: "github", label: "GitHub" },
  { key: "linkedin", label: "LinkedIn" },
  { key: "twitter", label: "Twitter" },
  { key: "instagram", label: "Instagram" },
  { key: "website", label: "Website" },
];

const Admin = () => {
  const navigate = useNavigate();
  const storedAdmin = localStorage.getItem("admin");
  const admin = storedAdmin ? JSON.parse(storedAdmin) : null;

  const [projectForm, setProjectForm] = useState(initialProjectForm);
  const [profileForm, setProfileForm] = useState(initialProfileForm);
  const [projects, setProjects] = useState([]);
  const [projectMessage, setProjectMessage] = useState("");
  const [projectError, setProjectError] = useState("");
  const [profileMessage, setProfileMessage] = useState("");
  const [profileError, setProfileError] = useState("");
  const [projectLoading, setProjectLoading] = useState(false);
  const [profileLoading, setProfileLoading] = useState(false);

  const loadProjects = async () => {
    const response = await API.get("/projects");
    setProjects(response.data);
  };

  const loadProfile = async () => {
    try {
      const response = await API.get("/profile");
      const data = response.data;

      setProfileForm((prev) => ({
        ...prev,
        ...data,
        socialLinks: {
          ...prev.socialLinks,
          ...(data.socialLinks || {}),
        },
        sectionVisibility: {
          ...prev.sectionVisibility,
          ...(data.sectionVisibility || {}),
        },
      }));
    } catch (error) {
      if (error.response?.status !== 404) {
        setProfileError("Failed to load profile data");
      }
    }
  };

  useEffect(() => {
    const initialize = async () => {
      try {
        await Promise.all([loadProjects(), loadProfile()]);
      } catch (error) {
        setProjectError("Failed to load admin data");
      }
    };

    initialize();
  }, []);

  const handleProjectChange = (event) => {
    const { name, value } = event.target;
    setProjectForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleProfileChange = (event) => {
    const { name, value } = event.target;
    setProfileForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSocialChange = (key, value) => {
    setProfileForm((prev) => ({
      ...prev,
      socialLinks: {
        ...prev.socialLinks,
        [key]: value,
      },
    }));
  };

  const handleVisibilityToggle = (key) => {
    setProfileForm((prev) => ({
      ...prev,
      sectionVisibility: {
        ...prev.sectionVisibility,
        [key]: !prev.sectionVisibility[key],
      },
    }));
  };

  const handleProjectSubmit = async (event) => {
    event.preventDefault();
    setProjectLoading(true);
    setProjectMessage("");
    setProjectError("");

    try {
      const response = await API.post("/projects", projectForm);
      setProjectMessage(response.data.message || "Project added successfully");
      setProjectForm(initialProjectForm);
      await loadProjects();
    } catch (error) {
      setProjectError(
        error.response?.data?.message || "Failed to create project"
      );
    } finally {
      setProjectLoading(false);
    }
  };

  const handleProfileSubmit = async (event) => {
    event.preventDefault();
    setProfileLoading(true);
    setProfileMessage("");
    setProfileError("");

    try {
      const response = await API.put("/profile", profileForm);
      setProfileMessage(response.data.message || "Profile saved successfully");
    } catch (error) {
      setProfileError(
        error.response?.data?.message || "Failed to save profile"
      );
    } finally {
      setProfileLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("admin");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-black text-white px-6 py-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-white/60">
              Logged in as {admin?.name || "Admin"}
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="rounded-lg border border-white/15 px-4 py-2 text-sm hover:bg-white/10"
          >
            Logout
          </button>
        </div>

        <div className="grid gap-8 xl:grid-cols-[1.05fr_0.95fr]">
          <div className="space-y-8">
            <section className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <div className="mb-5">
                <h2 className="text-xl font-semibold">Profile Content</h2>
                <p className="mt-1 text-sm text-white/55">
                  Control your hero, about details, social links, and which
                  sections appear on the public portfolio.
                </p>
              </div>

              {profileMessage ? (
                <div className="mb-4 rounded-lg bg-emerald-500/15 px-4 py-3 text-sm text-emerald-300">
                  {profileMessage}
                </div>
              ) : null}

              {profileError ? (
                <div className="mb-4 rounded-lg bg-red-500/15 px-4 py-3 text-sm text-red-300">
                  {profileError}
                </div>
              ) : null}

              <form onSubmit={handleProfileSubmit} className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <input
                    name="fullName"
                    placeholder="Full name"
                    value={profileForm.fullName}
                    onChange={handleProfileChange}
                    className="w-full rounded-lg border border-white/10 bg-black/40 px-4 py-3 outline-none focus:border-cyan-400"
                  />
                  <input
                    name="title"
                    placeholder="Title"
                    value={profileForm.title}
                    onChange={handleProfileChange}
                    className="w-full rounded-lg border border-white/10 bg-black/40 px-4 py-3 outline-none focus:border-cyan-400"
                  />
                </div>

                <textarea
                  name="bio"
                  placeholder="Short bio"
                  value={profileForm.bio}
                  onChange={handleProfileChange}
                  rows="3"
                  className="w-full rounded-lg border border-white/10 bg-black/40 px-4 py-3 outline-none focus:border-cyan-400"
                />

                <textarea
                  name="about"
                  placeholder="Detailed about section"
                  value={profileForm.about}
                  onChange={handleProfileChange}
                  rows="5"
                  className="w-full rounded-lg border border-white/10 bg-black/40 px-4 py-3 outline-none focus:border-cyan-400"
                />

                <div className="grid gap-4 md:grid-cols-2">
                  <input
                    name="email"
                    placeholder="Public email"
                    value={profileForm.email}
                    onChange={handleProfileChange}
                    className="w-full rounded-lg border border-white/10 bg-black/40 px-4 py-3 outline-none focus:border-cyan-400"
                  />
                  <input
                    name="phone"
                    placeholder="Phone"
                    value={profileForm.phone}
                    onChange={handleProfileChange}
                    className="w-full rounded-lg border border-white/10 bg-black/40 px-4 py-3 outline-none focus:border-cyan-400"
                  />
                  <input
                    name="location"
                    placeholder="Location"
                    value={profileForm.location}
                    onChange={handleProfileChange}
                    className="w-full rounded-lg border border-white/10 bg-black/40 px-4 py-3 outline-none focus:border-cyan-400"
                  />
                  <input
                    name="availability"
                    placeholder="Availability"
                    value={profileForm.availability}
                    onChange={handleProfileChange}
                    className="w-full rounded-lg border border-white/10 bg-black/40 px-4 py-3 outline-none focus:border-cyan-400"
                  />
                </div>

                <input
                  name="tagline"
                  placeholder="Tagline"
                  value={profileForm.tagline}
                  onChange={handleProfileChange}
                  className="w-full rounded-lg border border-white/10 bg-black/40 px-4 py-3 outline-none focus:border-cyan-400"
                />

                <div className="space-y-3 rounded-2xl border border-white/10 bg-black/20 p-4">
                  <h3 className="font-semibold">Social Links</h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    {socialFields.map((field) => (
                      <input
                        key={field.key}
                        placeholder={`${field.label} URL`}
                        value={profileForm.socialLinks[field.key]}
                        onChange={(event) =>
                          handleSocialChange(field.key, event.target.value)
                        }
                        className="w-full rounded-lg border border-white/10 bg-black/40 px-4 py-3 outline-none focus:border-cyan-400"
                      />
                    ))}
                  </div>
                </div>

                <div className="space-y-3 rounded-2xl border border-white/10 bg-black/20 p-4">
                  <h3 className="font-semibold">Section Visibility</h3>
                  <div className="grid gap-3 md:grid-cols-2">
                    {sectionFields.map((field) => (
                      <label
                        key={field.key}
                        className="flex items-center justify-between rounded-xl border border-white/10 bg-black/30 px-4 py-3"
                      >
                        <span>{field.label}</span>
                        <input
                          type="checkbox"
                          checked={profileForm.sectionVisibility[field.key]}
                          onChange={() => handleVisibilityToggle(field.key)}
                          className="h-4 w-4 accent-cyan-400"
                        />
                      </label>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={profileLoading}
                  className="w-full rounded-lg bg-emerald-400 px-4 py-3 font-semibold text-slate-950 transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {profileLoading ? "Saving profile..." : "Save Profile Settings"}
                </button>
              </form>
            </section>

            <section className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <h2 className="mb-5 text-xl font-semibold">Add Project</h2>

              {projectMessage ? (
                <div className="mb-4 rounded-lg bg-emerald-500/15 px-4 py-3 text-sm text-emerald-300">
                  {projectMessage}
                </div>
              ) : null}

              {projectError ? (
                <div className="mb-4 rounded-lg bg-red-500/15 px-4 py-3 text-sm text-red-300">
                  {projectError}
                </div>
              ) : null}

              <form onSubmit={handleProjectSubmit} className="space-y-4">
                <input
                  name="title"
                  placeholder="Project title"
                  value={projectForm.title}
                  onChange={handleProjectChange}
                  className="w-full rounded-lg border border-white/10 bg-black/40 px-4 py-3 outline-none focus:border-cyan-400"
                  required
                />

                <textarea
                  name="description"
                  placeholder="Project description"
                  value={projectForm.description}
                  onChange={handleProjectChange}
                  rows="4"
                  className="w-full rounded-lg border border-white/10 bg-black/40 px-4 py-3 outline-none focus:border-cyan-400"
                  required
                />

                <input
                  name="shortDescription"
                  placeholder="Short description"
                  value={projectForm.shortDescription}
                  onChange={handleProjectChange}
                  className="w-full rounded-lg border border-white/10 bg-black/40 px-4 py-3 outline-none focus:border-cyan-400"
                />

                <input
                  name="thumbnail"
                  placeholder="Thumbnail URL"
                  value={projectForm.thumbnail}
                  onChange={handleProjectChange}
                  className="w-full rounded-lg border border-white/10 bg-black/40 px-4 py-3 outline-none focus:border-cyan-400"
                />

                <div className="grid gap-4 md:grid-cols-2">
                  <input
                    name="githubLink"
                    placeholder="GitHub URL"
                    value={projectForm.githubLink}
                    onChange={handleProjectChange}
                    className="w-full rounded-lg border border-white/10 bg-black/40 px-4 py-3 outline-none focus:border-cyan-400"
                  />
                  <input
                    name="liveLink"
                    placeholder="Live demo URL"
                    value={projectForm.liveLink}
                    onChange={handleProjectChange}
                    className="w-full rounded-lg border border-white/10 bg-black/40 px-4 py-3 outline-none focus:border-cyan-400"
                  />
                </div>

                <button
                  type="submit"
                  disabled={projectLoading}
                  className="w-full rounded-lg bg-cyan-500 px-4 py-3 font-semibold text-black transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {projectLoading ? "Saving..." : "Add Project"}
                </button>
              </form>
            </section>
          </div>

          <section className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h2 className="mb-5 text-xl font-semibold">Current Projects</h2>

            {projects.length === 0 ? (
              <p className="text-white/60">No projects added yet.</p>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {projects.map((project) => (
                  <div
                    key={project._id}
                    className="rounded-xl border border-white/10 bg-black/30 p-4"
                  >
                    {project.thumbnail ? (
                      <img
                        src={project.thumbnail}
                        alt={project.title}
                        className="mb-4 h-40 w-full rounded-lg object-cover"
                      />
                    ) : null}

                    <h3 className="text-lg font-semibold">{project.title}</h3>
                    <p className="mt-2 text-sm text-white/65">
                      {project.shortDescription || project.description}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};

export default Admin;
