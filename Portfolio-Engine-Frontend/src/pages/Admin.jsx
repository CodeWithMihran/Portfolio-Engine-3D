import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

const initialForm = {
  title: "",
  description: "",
  shortDescription: "",
  thumbnail: "",
  githubLink: "",
  liveLink: "",
};

const Admin = () => {
  const navigate = useNavigate();
  const storedAdmin = localStorage.getItem("admin");
  const admin = storedAdmin ? JSON.parse(storedAdmin) : null;

  const [form, setForm] = useState(initialForm);
  const [projects, setProjects] = useState([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const loadProjects = async () => {
    try {
      const response = await API.get("/projects");
      setProjects(response.data);
    } catch (err) {
      setError("Failed to load projects");
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    try {
      const response = await API.post("/projects", form);

      setMessage(response.data.message || "Project added successfully");
      setForm(initialForm);
      await loadProjects();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create project");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("admin");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-black text-white px-6 py-10">
      <div className="mx-auto max-w-6xl">
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

        <div className="grid gap-8 lg:grid-cols-[420px_1fr]">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h2 className="mb-5 text-xl font-semibold">Add Project</h2>

            {message ? (
              <div className="mb-4 rounded-lg bg-emerald-500/15 px-4 py-3 text-sm text-emerald-300">
                {message}
              </div>
            ) : null}

            {error ? (
              <div className="mb-4 rounded-lg bg-red-500/15 px-4 py-3 text-sm text-red-300">
                {error}
              </div>
            ) : null}

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                name="title"
                placeholder="Project title"
                value={form.title}
                onChange={handleChange}
                className="w-full rounded-lg border border-white/10 bg-black/40 px-4 py-3 outline-none focus:border-cyan-400"
                required
              />

              <textarea
                name="description"
                placeholder="Project description"
                value={form.description}
                onChange={handleChange}
                rows="4"
                className="w-full rounded-lg border border-white/10 bg-black/40 px-4 py-3 outline-none focus:border-cyan-400"
                required
              />

              <input
                name="shortDescription"
                placeholder="Short description"
                value={form.shortDescription}
                onChange={handleChange}
                className="w-full rounded-lg border border-white/10 bg-black/40 px-4 py-3 outline-none focus:border-cyan-400"
              />

              <input
                name="thumbnail"
                placeholder="Thumbnail URL"
                value={form.thumbnail}
                onChange={handleChange}
                className="w-full rounded-lg border border-white/10 bg-black/40 px-4 py-3 outline-none focus:border-cyan-400"
              />

              <input
                name="githubLink"
                placeholder="GitHub URL"
                value={form.githubLink}
                onChange={handleChange}
                className="w-full rounded-lg border border-white/10 bg-black/40 px-4 py-3 outline-none focus:border-cyan-400"
              />

              <input
                name="liveLink"
                placeholder="Live demo URL"
                value={form.liveLink}
                onChange={handleChange}
                className="w-full rounded-lg border border-white/10 bg-black/40 px-4 py-3 outline-none focus:border-cyan-400"
              />

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-cyan-500 px-4 py-3 font-semibold text-black transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? "Saving..." : "Add Project"}
              </button>
            </form>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
