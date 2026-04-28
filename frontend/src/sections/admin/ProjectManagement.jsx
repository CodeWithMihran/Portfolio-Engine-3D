import { Link } from 'react-router-dom';
import { Pencil, Star, Trash2 } from 'lucide-react';
import { api } from '../../services/api';
import { useStore } from '../../store/useStore';

export default function ProjectManagement() {
  const projects = useStore((state) => state.projects);
  const fetchAllData = useStore((state) => state.fetchAllData);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this project?')) {
      return;
    }

    await api.deleteProject(id);
    fetchAllData();
  };

  const handleToggleFeatured = async (id) => {
    await api.toggleFeaturedProject(id);
    fetchAllData();
  };

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-mono uppercase tracking-[0.35em] text-slate-500">
            Admin section
          </p>
          <h1 className="mt-2 text-3xl font-bold text-white">Project Management</h1>
        </div>
        <Link
          to="/admin/projects/new"
          className="rounded-2xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-500"
        >
          Add Project
        </Link>
      </div>

      <div className="grid gap-4">
        {projects.length ? (
          projects.map((project) => (
            <div
              key={project._id}
              className="flex flex-col gap-4 rounded-3xl border border-slate-800 bg-slate-900/50 p-6 backdrop-blur-md transition-all duration-300 hover:scale-[1.01] hover:border-slate-700 hover:bg-slate-800/50 hover:shadow-2xl hover:shadow-blue-500/10 lg:flex-row lg:items-center lg:justify-between"
            >
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-3">
                  <h2 className="text-xl font-semibold text-white">{project.title}</h2>
                  {project.featured && (
                    <span className="rounded-full border border-amber-500/20 bg-amber-500/10 px-3 py-1 text-xs font-mono uppercase tracking-[0.2em] text-amber-300">
                      Featured
                    </span>
                  )}
                </div>
                <p className="mt-2 max-w-3xl text-sm text-slate-400">
                  {project.shortDescription || project.description}
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <Link
                  to={`/admin/projects/edit/${project._id}`}
                  className="inline-flex items-center gap-2 rounded-2xl border border-cyan-500/20 bg-cyan-500/10 px-4 py-2 text-sm font-semibold text-cyan-200 transition hover:bg-cyan-500/15"
                >
                  <Pencil size={16} />
                  Edit
                </Link>
                <button
                  onClick={() => handleToggleFeatured(project._id)}
                  className="inline-flex items-center gap-2 rounded-2xl border border-amber-500/20 bg-amber-500/10 px-4 py-2 text-sm font-semibold text-amber-300 transition hover:bg-amber-500/15"
                >
                  <Star size={16} />
                  Toggle Featured
                </button>
                <button
                  onClick={() => handleDelete(project._id)}
                  className="inline-flex items-center gap-2 rounded-2xl border border-rose-500/20 bg-rose-500/10 px-4 py-2 text-sm font-semibold text-rose-300 transition hover:bg-rose-500/15"
                >
                  <Trash2 size={16} />
                  Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="rounded-3xl border border-slate-800 bg-slate-900/50 p-6 text-slate-400 backdrop-blur-md transition-all duration-300 hover:scale-[1.01] hover:border-slate-700 hover:bg-slate-800/50 hover:shadow-2xl hover:shadow-blue-500/10">No projects found yet.</div>
        )}
      </div>
    </section>
  );
}
