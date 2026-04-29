import { useMemo, useState } from 'react';
import { ImagePlus, Layers3, Save, Sparkles } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import AssetUploadField from '../../components/admin/AssetUploadField';
import { api } from '../../services/api';
import { useStore } from '../../store/useStore';

const EMPTY_FORM = {
  title: '',
  role: '',
  shortDescription: '',
  description: '',
  technologies: '',
  githubLink: '',
  liveLink: '',
  thumbnail: '',
  images: '',
  challenges: '',
  learnings: '',
  featured: false,
  status: 'completed',
  order: 0,
};

function GalleryField({ value, onChange }) {
  const [uploading, setUploading] = useState(false);
  const urls = value
    .split('\n')
    .map((item) => item.trim())
    .filter(Boolean);

  const handleUpload = async (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setUploading(true);
    try {
      const response = await api.uploadImage(file);
      const next = [...urls, response.data.imageUrl].join('\n');
      onChange(next);
    } finally {
      setUploading(false);
      event.target.value = '';
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <label className="text-xs font-mono uppercase tracking-[0.28em] text-slate-500">
          Gallery images
        </label>
        <label className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-400/10 px-3 py-2 text-[10px] font-mono uppercase tracking-[0.24em] text-cyan-100 transition hover:bg-cyan-400/15">
          <ImagePlus size={12} />
          {uploading ? 'Uploading...' : 'Upload image'}
          <input type="file" accept="image/*" className="hidden" onChange={handleUpload} />
        </label>
      </div>
      <textarea
        rows={5}
        className="w-full rounded-[24px] border border-white/10 bg-slate-950/85 p-4 text-sm text-white outline-none transition focus:border-cyan-300/30"
        placeholder="One image URL per line"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
      {urls.length ? (
        <div className="grid gap-3 sm:grid-cols-3">
          {urls.slice(0, 6).map((url) => (
            <img
              key={url}
              src={url}
              alt="Project gallery asset"
              className="h-24 w-full rounded-2xl border border-white/10 object-cover"
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}

function ProjectEditor({ initialData, isEdit = false, projectId }) {
  const navigate = useNavigate();
  const fetchAllData = useStore((state) => state.fetchAllData);
  const [formData, setFormData] = useState(initialData);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const payload = {
      ...formData,
      technologies: formData.technologies
        .split(',')
        .map((tech) => tech.trim())
        .filter(Boolean),
      images: formData.images
        .split('\n')
        .map((image) => image.trim())
        .filter(Boolean),
      order: Number(formData.order) || 0,
      shortDescription: formData.shortDescription || undefined,
      role: formData.role || undefined,
      thumbnail: formData.thumbnail || undefined,
      challenges: formData.challenges || undefined,
      learnings: formData.learnings || undefined,
    };

    if (isEdit && projectId) {
      await api.updateProject(projectId, payload);
    } else {
      await api.createProject(payload);
    }

    await fetchAllData();
    navigate('/admin/projects');
  };

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-mono uppercase tracking-[0.35em] text-slate-500">
            Project editor
          </p>
          <h1 className="mt-2 text-3xl font-black text-white">
            {isEdit ? 'Refine Project Story' : 'Create New Project'}
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-400">
            Build a stronger case-study presentation with cleaner copy, a polished cover image, and clear project metadata.
          </p>
        </div>
        <div className="rounded-[24px] border border-cyan-300/12 bg-cyan-400/10 px-4 py-3 text-sm text-cyan-100">
          {isEdit ? 'Editing live project data' : 'New project draft'}
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-6 rounded-[32px] border border-white/10 bg-[linear-gradient(180deg,rgba(6,12,24,0.9),rgba(8,16,32,0.76))] p-6 shadow-[0_24px_80px_rgba(2,6,23,0.35)] backdrop-blur-2xl"
      >
        <div className="grid gap-6 xl:grid-cols-[1.08fr_0.92fr]">
          <div className="space-y-5">
            <div className="grid gap-5 md:grid-cols-2">
              <div className="space-y-2 md:col-span-2">
                <label className="text-xs font-mono uppercase tracking-[0.28em] text-slate-500">
                  Project title
                </label>
                <input
                  type="text"
                  required
                  className="w-full rounded-[22px] border border-white/10 bg-slate-950/85 p-4 text-white outline-none transition focus:border-cyan-300/30"
                  value={formData.title}
                  onChange={(event) => setFormData({ ...formData, title: event.target.value })}
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-mono uppercase tracking-[0.28em] text-slate-500">
                  Role
                </label>
                <input
                  type="text"
                  className="w-full rounded-[22px] border border-white/10 bg-slate-950/85 p-4 text-white outline-none transition focus:border-cyan-300/30"
                  placeholder="Full Stack Developer"
                  value={formData.role}
                  onChange={(event) => setFormData({ ...formData, role: event.target.value })}
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-mono uppercase tracking-[0.28em] text-slate-500">
                  Status
                </label>
                <select
                  className="w-full rounded-[22px] border border-white/10 bg-slate-950/85 p-4 text-white outline-none transition focus:border-cyan-300/30"
                  value={formData.status}
                  onChange={(event) => setFormData({ ...formData, status: event.target.value })}
                >
                  {['completed', 'in-progress', 'archived'].map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-xs font-mono uppercase tracking-[0.28em] text-slate-500">
                  Short description
                </label>
                <input
                  type="text"
                  className="w-full rounded-[22px] border border-white/10 bg-slate-950/85 p-4 text-white outline-none transition focus:border-cyan-300/30"
                  placeholder="One-line positioning statement for cards and hero"
                  value={formData.shortDescription}
                  onChange={(event) => setFormData({ ...formData, shortDescription: event.target.value })}
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-xs font-mono uppercase tracking-[0.28em] text-slate-500">
                  Full description
                </label>
                <textarea
                  rows={5}
                  required
                  className="w-full rounded-[22px] border border-white/10 bg-slate-950/85 p-4 text-white outline-none transition focus:border-cyan-300/30"
                  value={formData.description}
                  onChange={(event) => setFormData({ ...formData, description: event.target.value })}
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-xs font-mono uppercase tracking-[0.28em] text-slate-500">
                  Technologies
                </label>
                <input
                  type="text"
                  className="w-full rounded-[22px] border border-white/10 bg-slate-950/85 p-4 text-white outline-none transition focus:border-cyan-300/30"
                  placeholder="React, Node.js, MongoDB"
                  value={formData.technologies}
                  onChange={(event) => setFormData({ ...formData, technologies: event.target.value })}
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-mono uppercase tracking-[0.28em] text-slate-500">
                  GitHub link
                </label>
                <input
                  type="url"
                  className="w-full rounded-[22px] border border-white/10 bg-slate-950/85 p-4 text-white outline-none transition focus:border-cyan-300/30"
                  value={formData.githubLink}
                  onChange={(event) => setFormData({ ...formData, githubLink: event.target.value })}
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-mono uppercase tracking-[0.28em] text-slate-500">
                  Live link
                </label>
                <input
                  type="url"
                  className="w-full rounded-[22px] border border-white/10 bg-slate-950/85 p-4 text-white outline-none transition focus:border-cyan-300/30"
                  value={formData.liveLink}
                  onChange={(event) => setFormData({ ...formData, liveLink: event.target.value })}
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-mono uppercase tracking-[0.28em] text-slate-500">
                  Display order
                </label>
                <input
                  type="number"
                  className="w-full rounded-[22px] border border-white/10 bg-slate-950/85 p-4 text-white outline-none transition focus:border-cyan-300/30"
                  value={formData.order}
                  onChange={(event) => setFormData({ ...formData, order: event.target.value })}
                />
              </div>

              <label className="flex items-center gap-3 rounded-[22px] border border-white/10 bg-white/5 px-4 py-4 text-sm text-slate-300">
                <input
                  type="checkbox"
                  checked={formData.featured}
                  onChange={(event) => setFormData({ ...formData, featured: event.target.checked })}
                />
                Feature this project in the portfolio story
              </label>
            </div>
          </div>

          <div className="space-y-5">
            <AssetUploadField
              label="Project thumbnail"
              value={formData.thumbnail}
              onChange={(value) => setFormData({ ...formData, thumbnail: value })}
              hint="Used in hero and project case-study cards."
            />

            <GalleryField
              value={formData.images}
              onChange={(value) => setFormData({ ...formData, images: value })}
            />
          </div>
        </div>

        <div className="grid gap-5 lg:grid-cols-2">
          <div className="rounded-[28px] border border-cyan-300/10 bg-cyan-400/8 p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-cyan-300/18 bg-cyan-400/10 text-cyan-100">
                <Layers3 size={18} />
              </div>
              <div>
                <p className="text-xs font-mono uppercase tracking-[0.26em] text-cyan-100/60">
                  Challenge
                </p>
                <p className="text-sm text-slate-300">What problem was solved?</p>
              </div>
            </div>
            <textarea
              rows={5}
              className="mt-4 w-full rounded-[22px] border border-white/10 bg-slate-950/85 p-4 text-white outline-none transition focus:border-cyan-300/30"
              placeholder="Main constraint, problem, or product challenge"
              value={formData.challenges}
              onChange={(event) => setFormData({ ...formData, challenges: event.target.value })}
            />
          </div>

          <div className="rounded-[28px] border border-orange-300/10 bg-orange-400/8 p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-orange-300/18 bg-orange-400/10 text-orange-100">
                <Sparkles size={18} />
              </div>
              <div>
                <p className="text-xs font-mono uppercase tracking-[0.26em] text-orange-100/60">
                  Outcome
                </p>
                <p className="text-sm text-slate-300">What changed or improved?</p>
              </div>
            </div>
            <textarea
              rows={5}
              className="mt-4 w-full rounded-[22px] border border-white/10 bg-slate-950/85 p-4 text-white outline-none transition focus:border-orange-300/30"
              placeholder="Impact, result, or what you learned"
              value={formData.learnings}
              onChange={(event) => setFormData({ ...formData, learnings: event.target.value })}
            />
          </div>
        </div>

        <button
          type="submit"
          className="inline-flex w-full items-center justify-center gap-3 rounded-[24px] bg-[linear-gradient(135deg,#06b6d4,#2563eb)] px-6 py-4 font-semibold text-white shadow-[0_18px_45px_rgba(37,99,235,0.25)] transition hover:brightness-110"
        >
          <Save size={18} />
          {isEdit ? 'Save Project Updates' : 'Create Project'}
        </button>
      </form>
    </section>
  );
}

export default function AddProject({ isEdit = false }) {
  const { id } = useParams();
  const projects = useStore((state) => state.projects);
  const existingProject = useMemo(() => projects.find((item) => item._id === id), [id, projects]);

  const initialData = useMemo(
    () => ({
      ...EMPTY_FORM,
      title: existingProject?.title || '',
      role: existingProject?.role || '',
      shortDescription: existingProject?.shortDescription || '',
      description: existingProject?.description || '',
      technologies: existingProject?.technologies?.join(', ') || '',
      githubLink: existingProject?.githubLink || '',
      liveLink: existingProject?.liveLink || '',
      thumbnail: existingProject?.thumbnail || '',
      images: existingProject?.images?.join('\n') || '',
      challenges: existingProject?.challenges || '',
      learnings: existingProject?.learnings || '',
      featured: Boolean(existingProject?.featured),
      status: existingProject?.status || 'completed',
      order: existingProject?.order ?? 0,
    }),
    [existingProject]
  );

  if (isEdit && id && !existingProject) {
    return (
      <div className="max-w-3xl rounded-[28px] border border-white/10 bg-white/5 p-6 text-slate-300">
        Loading project record...
      </div>
    );
  }

  return <ProjectEditor key={existingProject?._id || 'new-project'} initialData={initialData} isEdit={isEdit} projectId={id} />;
}
