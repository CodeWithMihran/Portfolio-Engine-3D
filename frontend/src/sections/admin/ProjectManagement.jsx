import { Link } from 'react-router-dom';
import { ArrowUpRight, Pencil, Star, Trash2 } from 'lucide-react';
import OrderControls from '../../components/admin/OrderControls';
import { moveOrderedItem } from '../../lib/admin';
import { createProjectImageFallback, resolveMediaUrl } from '../../lib/media';
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
    await fetchAllData();
  };

  const handleToggleFeatured = async (id) => {
    await api.toggleFeaturedProject(id);
    await fetchAllData();
  };

  const handleMove = async (index, direction) => {
    await moveOrderedItem({
      items: projects,
      index,
      direction,
      updateItem: api.updateProject,
      refresh: fetchAllData,
    });
  };

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-mono uppercase tracking-[0.35em] text-slate-500">Admin section</p>
          <h1 className="mt-2 text-3xl font-bold text-white">Project Management</h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-400">
            Curate project order, highlight featured work, and shape the case-study presentation visitors see first.
          </p>
        </div>
        <Link
          to="/admin/projects/new"
          className="rounded-2xl bg-[linear-gradient(135deg,#06b6d4,#2563eb)] px-5 py-3 font-semibold text-white shadow-[0_16px_40px_rgba(37,99,235,0.2)] transition hover:brightness-110"
        >
          Add Project
        </Link>
      </div>

      <div className="grid gap-5">
        {projects.length ? (
          projects.map((project, index) => {
            const preview = resolveMediaUrl(
              project.thumbnail || project.images?.[0],
              createProjectImageFallback(project.title)
            );

            return (
              <div
                key={project._id}
                className="overflow-hidden rounded-[32px] border border-white/10 bg-[linear-gradient(180deg,rgba(7,14,28,0.92),rgba(9,17,31,0.78))] shadow-[0_24px_70px_rgba(2,6,23,0.3)] backdrop-blur-2xl"
              >
                <div className="grid gap-0 lg:grid-cols-[240px_1fr]">
                  <div className="relative min-h-[190px] overflow-hidden border-b border-white/8 lg:border-b-0 lg:border-r">
                    <img src={preview} alt={project.title} className="h-full w-full object-cover" />
                    <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(2,6,23,0.08),rgba(2,6,23,0.74))]" />
                    <div className="absolute left-4 top-4 flex flex-wrap gap-2">
                      <span className="rounded-full border border-white/10 bg-slate-950/55 px-3 py-1 text-[10px] font-mono uppercase tracking-[0.22em] text-slate-200">
                        #{index + 1}
                      </span>
                      {project.featured ? (
                        <span className="rounded-full border border-orange-300/20 bg-orange-400/12 px-3 py-1 text-[10px] font-mono uppercase tracking-[0.22em] text-orange-100">
                          Featured
                        </span>
                      ) : null}
                    </div>
                  </div>

                  <div className="space-y-5 p-6">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-3">
                          <h2 className="text-2xl font-semibold text-white">{project.title}</h2>
                          <span className="rounded-full border border-cyan-300/12 bg-cyan-400/10 px-3 py-1 text-[10px] font-mono uppercase tracking-[0.22em] text-cyan-100">
                            {project.status || 'completed'}
                          </span>
                        </div>
                        <p className="mt-2 max-w-3xl text-sm leading-7 text-slate-400">
                          {project.shortDescription || project.description}
                        </p>
                        <div className="mt-3 flex flex-wrap gap-2">
                          {(project.technologies || []).slice(0, 5).map((tech) => (
                            <span
                              key={`${project._id}-${tech}`}
                              className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-300"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <OrderControls index={index} total={projects.length} onMove={handleMove} />
                        {project.liveLink ? (
                          <a
                            href={project.liveLink}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-emerald-400/20 bg-emerald-400/10 text-emerald-200 transition hover:bg-emerald-400/15"
                          >
                            <ArrowUpRight size={16} />
                          </a>
                        ) : null}
                      </div>
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
                </div>
              </div>
            );
          })
        ) : (
          <div className="rounded-[28px] border border-dashed border-white/10 bg-white/5 p-6 text-slate-400">
            No projects found yet.
          </div>
        )}
      </div>
    </section>
  );
}
