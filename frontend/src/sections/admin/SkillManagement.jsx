import { useMemo, useState } from 'react';
import { useStore } from '../../store/useStore';
import { api } from '../../services/api';
import { Pencil, Plus, Trash2, Zap } from 'lucide-react';

export default function SkillManagement() {
  const skills = useStore((state) => state.skills);
  const fetchAllData = useStore((state) => state.fetchAllData);
  const [editingId, setEditingId] = useState(null);
  const blankSkill = useMemo(
    () => ({ name: '', category: 'frontend', proficiency: 80, icon: '', color: '#8b5cf6' }),
    []
  );
  const [newSkill, setNewSkill] = useState(blankSkill);

  const addSkill = async (e) => {
    e.preventDefault();
    if (editingId) {
      await api.updateSkill(editingId, newSkill);
    } else {
      await api.createSkill(newSkill);
    }
    setEditingId(null);
    setNewSkill(blankSkill);
    fetchAllData();
  };

  const startEdit = (skill) => {
    setEditingId(skill._id);
    setNewSkill({
      name: skill.name || '',
      category: skill.category || 'frontend',
      proficiency: skill.proficiency || 80,
      icon: skill.icon || '',
      color: skill.color || '#8b5cf6',
    });
  };

  return (
    <div className="max-w-4xl">
      <h1 className="mb-8 text-3xl font-bold">SKILL_MANIFEST</h1>
      
      <form onSubmit={addSkill} className="mb-8 flex flex-wrap items-end gap-4 rounded-3xl border border-slate-800 bg-slate-900/50 p-6 backdrop-blur-md transition-all duration-300 hover:scale-[1.01] hover:border-slate-700 hover:bg-slate-800/50 hover:shadow-2xl hover:shadow-blue-500/10">
        <div className="flex-1 min-w-[200px]">
          <label className="text-[10px] font-mono text-slate-500 uppercase block mb-2">Skill Name</label>
          <input 
            className="w-full bg-slate-950 border border-slate-800 p-3 rounded-xl outline-none focus:border-blue-500"
            value={newSkill.name} onChange={e => setNewSkill({...newSkill, name: e.target.value})}
          />
        </div>
        <div>
          <label className="text-[10px] font-mono text-slate-500 uppercase block mb-2">Category</label>
          <select 
            className="bg-slate-950 border border-slate-800 p-3 rounded-xl outline-none"
            value={newSkill.category} onChange={e => setNewSkill({...newSkill, category: e.target.value})}
          >
            {["frontend", "backend", "database", "programming", "tools", "other"].map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label className="text-[10px] font-mono text-slate-500 uppercase block mb-2">Proficiency</label>
          <input
            type="number"
            min="1"
            max="100"
            className="w-28 bg-slate-950 border border-slate-800 p-3 rounded-xl outline-none"
            value={newSkill.proficiency}
            onChange={e => setNewSkill({...newSkill, proficiency: Number(e.target.value)})}
          />
        </div>
        <div className="min-w-[200px]">
          <label className="mb-2 block text-[10px] font-mono uppercase text-slate-500">Icon URL</label>
          <input
            type="url"
            className="w-full rounded-xl border border-slate-800 bg-slate-950 p-3 outline-none"
            value={newSkill.icon}
            onChange={e => setNewSkill({ ...newSkill, icon: e.target.value })}
          />
        </div>
        <div>
          <label className="mb-2 block text-[10px] font-mono uppercase text-slate-500">Tint</label>
          <input
            type="color"
            className="h-12 w-20 rounded-xl border border-slate-800 bg-slate-950 p-2 outline-none"
            value={newSkill.color}
            onChange={e => setNewSkill({ ...newSkill, color: e.target.value })}
          />
        </div>
        <button className="bg-blue-600 hover:bg-blue-500 px-6 py-3 rounded-xl font-bold transition-all flex items-center gap-2">
          <Plus size={18} /> {editingId ? 'UPDATE' : 'INSTALL'}
        </button>
        {editingId ? (
          <button
            type="button"
            onClick={() => {
              setEditingId(null);
              setNewSkill(blankSkill);
            }}
            className="rounded-xl border border-white/10 px-5 py-3 text-sm font-semibold text-slate-300 transition hover:bg-white/5"
          >
            Cancel
          </button>
        ) : null}
      </form>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {skills.map(s => (
          <div key={s._id} className="flex items-center justify-between rounded-3xl border border-slate-800 bg-slate-900/50 px-6 py-4 backdrop-blur-md transition-all duration-300 hover:scale-[1.01] hover:border-slate-700 hover:bg-slate-800/50 hover:shadow-2xl hover:shadow-blue-500/10">
            <div className="flex items-center gap-3">
              <Zap size={16} className="text-blue-400" />
              <span className="font-bold">{s.name}</span>
              <span className="text-[10px] text-slate-500 uppercase font-mono">{s.category}</span>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={() => startEdit(s)} className="text-slate-500 transition-colors hover:text-cyan-300">
                <Pencil size={16} />
              </button>
              <button onClick={async () => { await api.deleteSkill(s._id); fetchAllData(); }} className="text-slate-600 hover:text-rose-500 transition-colors">
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
