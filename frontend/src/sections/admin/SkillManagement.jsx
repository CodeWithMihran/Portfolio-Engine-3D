import { useState } from 'react';
import { useStore } from '../../store/useStore';
import { api } from '../../services/api';
import { Plus, Trash2, Zap } from 'lucide-react';

export default function SkillManagement() {
  const skills = useStore((state) => state.skills);
  const fetchAllData = useStore((state) => state.fetchAllData);
  const [newSkill, setNewSkill] = useState({ name: '', category: 'frontend', proficiency: 80 });

  const addSkill = async (e) => {
    e.preventDefault();
    await api.createSkill(newSkill);
    setNewSkill({ name: '', category: 'frontend', proficiency: 80 });
    fetchAllData();
  };

  return (
    <div className="max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">SKILL_MANIFEST</h1>
      
      <form onSubmit={addSkill} className="mb-8 flex flex-wrap gap-4 items-end rounded-3xl border border-slate-800 bg-slate-900/50 p-6 backdrop-blur-md transition-all duration-300 hover:scale-[1.01] hover:border-slate-700 hover:bg-slate-800/50 hover:shadow-2xl hover:shadow-blue-500/10">
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
        <button className="bg-blue-600 hover:bg-blue-500 px-6 py-3 rounded-xl font-bold transition-all flex items-center gap-2">
          <Plus size={18} /> INSTALL
        </button>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {skills.map(s => (
          <div key={s._id} className="flex items-center justify-between rounded-3xl border border-slate-800 bg-slate-900/50 px-6 py-4 backdrop-blur-md transition-all duration-300 hover:scale-[1.01] hover:border-slate-700 hover:bg-slate-800/50 hover:shadow-2xl hover:shadow-blue-500/10">
            <div className="flex items-center gap-3">
              <Zap size={16} className="text-blue-400" />
              <span className="font-bold">{s.name}</span>
              <span className="text-[10px] text-slate-500 uppercase font-mono">{s.category}</span>
            </div>
            <button onClick={async () => { await api.deleteSkill(s._id); fetchAllData(); }} className="text-slate-600 hover:text-rose-500 transition-colors">
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
