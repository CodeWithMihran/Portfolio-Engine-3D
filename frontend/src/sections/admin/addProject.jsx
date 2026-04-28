import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '../../services/api';
import { useStore } from '../../store/useStore';

function ProjectEditor({ initialData, isEdit = false, projectId }) {
  const navigate = useNavigate();
  const fetchAllData = useStore((state) => state.fetchAllData);
  const [formData, setFormData] = useState(initialData);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const techArray = formData.technologies
        .split(',')
        .map((tech) => tech.trim())
        .filter(Boolean);
      const payload = { ...formData, technologies: techArray };

      if (isEdit && projectId) {
        await api.updateProject(projectId, payload);
        window.alert('Project updated successfully.');
      } else {
        await api.createProject(payload);
        window.alert('Project initialized successfully.');
      }
      await fetchAllData();
      navigate('/admin/projects');
    } catch {
      window.alert('Initialization error.');
    }
  };

  return (
    <div className="max-w-3xl">
      <h1 className="text-3xl font-bold mb-8 italic tracking-tighter">
        {isEdit ? 'UPDATE_PROJECT_RECORD' : 'INITIALIZE_NEW_PROJECT'}
      </h1>
      
      <form onSubmit={handleSubmit} className="space-y-6 rounded-3xl border border-slate-800 bg-slate-900/50 p-6 backdrop-blur-md transition-all duration-300 hover:scale-[1.01] hover:border-slate-700 hover:bg-slate-800/50 hover:shadow-2xl hover:shadow-blue-500/10">
        <div className="space-y-2">
          <label className="text-xs font-mono text-slate-500 uppercase tracking-widest">Project Title</label>
          <input 
            type="text" required
            className="w-full bg-slate-950 border border-slate-800 p-4 rounded-2xl focus:border-blue-500 outline-none"
            value={formData.title}
            onChange={e => setFormData({...formData, title: e.target.value})}
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-mono text-slate-500 uppercase tracking-widest">Description</label>
          <textarea 
            rows={4} required
            className="w-full bg-slate-950 border border-slate-800 p-4 rounded-2xl focus:border-blue-500 outline-none"
            value={formData.description}
            onChange={e => setFormData({...formData, description: e.target.value})}
          />
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-mono text-slate-500 uppercase tracking-widest">Technologies</label>
            <input
              type="text"
              placeholder="React, Node.js, MongoDB"
              className="w-full bg-slate-950 border border-slate-800 p-4 rounded-2xl outline-none"
              value={formData.technologies}
              onChange={e => setFormData({...formData, technologies: e.target.value})}
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-mono text-slate-500 uppercase tracking-widest">GitHub Uplink</label>
            <input type="url" className="w-full bg-slate-950 border border-slate-800 p-4 rounded-2xl outline-none" value={formData.githubLink} onChange={e => setFormData({...formData, githubLink: e.target.value})}/>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-mono text-slate-500 uppercase tracking-widest">Live Deployment</label>
            <input type="url" className="w-full bg-slate-950 border border-slate-800 p-4 rounded-2xl outline-none" value={formData.liveLink} onChange={e => setFormData({...formData, liveLink: e.target.value})}/>
          </div>
        </div>

        <label className="flex items-center gap-3 text-sm text-slate-300">
          <input
            type="checkbox"
            checked={formData.featured}
            onChange={e => setFormData({ ...formData, featured: e.target.checked })}
          />
          Mark as featured
        </label>

        <button type="submit" className="w-full py-4 bg-gradient-to-r from-blue-600 to-emerald-600 font-bold rounded-2xl shadow-xl shadow-blue-500/20 hover:scale-[1.02] transition-transform">
          {isEdit ? 'SAVE_PROJECT_UPDATES' : 'COMMIT_TO_DATABASE'}
        </button>
      </form>
    </div>
  );
}

export default function AddProject({ isEdit = false }) {
  const { id } = useParams();
  const projects = useStore((state) => state.projects);
  const existingProject = useMemo(
    () => projects.find((item) => item._id === id),
    [id, projects]
  );

  const initialData = useMemo(
    () => ({
      title: existingProject?.title || '',
      description: existingProject?.description || '',
      technologies: existingProject?.technologies?.join(', ') || '',
      githubLink: existingProject?.githubLink || '',
      liveLink: existingProject?.liveLink || '',
      featured: existingProject?.featured || false,
    }),
    [existingProject]
  );

  if (isEdit && id && !existingProject) {
    return (
      <div className="max-w-3xl rounded-3xl border border-slate-800 bg-slate-900/50 p-6 text-slate-300 backdrop-blur-md">
        Loading project record...
      </div>
    );
  }

  return <ProjectEditor key={existingProject?._id || 'new-project'} initialData={initialData} isEdit={isEdit} projectId={id} />;
}
