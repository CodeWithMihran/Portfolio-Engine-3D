import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../services/api';

export default function AddProject() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    technologies: '',
    githubLink: '',
    liveLink: '',
    featured: false
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Process technologies string into array
      const techArray = formData.technologies.split(',').map(t => t.trim());
      await api.createProject({ ...formData, technologies: techArray });
      window.alert('Project initialized successfully.');
      navigate('/admin/projects');
    } catch {
      window.alert('Initialization error.');
    }
  };

  return (
    <div className="max-w-3xl">
      <h1 className="text-3xl font-bold mb-8 italic tracking-tighter">INITIALIZE_NEW_PROJECT</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6 rounded-3xl border border-slate-800 bg-slate-900/50 p-6 backdrop-blur-md transition-all duration-300 hover:scale-[1.01] hover:border-slate-700 hover:bg-slate-800/50 hover:shadow-2xl hover:shadow-blue-500/10">
        <div className="space-y-2">
          <label className="text-xs font-mono text-slate-500 uppercase tracking-widest">Project Title</label>
          <input 
            type="text" required
            className="w-full bg-slate-950 border border-slate-800 p-4 rounded-2xl focus:border-blue-500 outline-none"
            onChange={e => setFormData({...formData, title: e.target.value})}
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-mono text-slate-500 uppercase tracking-widest">Description</label>
          <textarea 
            rows={4} required
            className="w-full bg-slate-950 border border-slate-800 p-4 rounded-2xl focus:border-blue-500 outline-none"
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
              onChange={e => setFormData({...formData, technologies: e.target.value})}
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-mono text-slate-500 uppercase tracking-widest">GitHub Uplink</label>
            <input type="url" className="w-full bg-slate-950 border border-slate-800 p-4 rounded-2xl outline-none" onChange={e => setFormData({...formData, githubLink: e.target.value})}/>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-mono text-slate-500 uppercase tracking-widest">Live Deployment</label>
            <input type="url" className="w-full bg-slate-950 border border-slate-800 p-4 rounded-2xl outline-none" onChange={e => setFormData({...formData, liveLink: e.target.value})}/>
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
          COMMIT_TO_DATABASE
        </button>
      </form>
    </div>
  );
}
